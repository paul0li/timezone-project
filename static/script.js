/*
 * Multi-timezone converter with individual editable inputs.
 *
 * This script manages multiple timezone inputs where each timezone has its own
 * time input field. When any input is changed, it becomes the "source" and all
 * other timezone inputs are updated automatically. The interface highlights
 * which timezone is currently being used as the reference.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("dateInput");
  const timeInputs = document.querySelectorAll(".time-input");
  const userTimezoneSpan = document.getElementById("userTimezone");
  const currentDateTimeSpan = document.getElementById("currentDateTime");
  const statusMessage = document.getElementById("statusMessage");

  let lastEditedTimezone = "America/Santiago"; // Default source timezone
  let isUpdating = false; // Prevent recursive updates

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  userTimezoneSpan.textContent = userTimezone;

  // Timezone information
  const timezoneData = {
    "America/Santiago": {
      name: "Chile",
      location: "Santiago",
      country: "CL",
    },
    "America/New_York": {
      name: "United States",
      location: "New York (Eastern Time)",
      country: "US",
    },
    "America/Argentina/Buenos_Aires": {
      name: "Argentina",
      location: "Buenos Aires",
      country: "AR",
    },
    "America/Bogota": {
      name: "Colombia",
      location: "Bogotá",
      country: "CO",
    },
    "America/Santo_Domingo": {
      name: "Dominican Republic",
      location: "Santo Domingo",
      country: "DO",
    },
  };

  /**
   * Update timezone offset display
   */
  function updateTimezoneOffsets(date) {
    const offsetElements = document.querySelectorAll(".timezone-offset");

    offsetElements.forEach((element) => {
      const timezone = element.getAttribute("data-timezone");
      try {
        // Create a date object for the selected date at noon to avoid DST edge cases
        const testDate = new Date(`${date}T12:00:00`);
        const formatter = new Intl.DateTimeFormat("en", {
          timeZone: timezone,
          timeZoneName: "longOffset",
        });

        const parts = formatter.formatToParts(testDate);
        const offsetPart = parts.find((part) => part.type === "timeZoneName");

        if (offsetPart) {
          element.textContent = offsetPart.value.replace("GMT", "UTC");
        }
      } catch (error) {
        console.warn(`Could not get offset for ${timezone}:`, error);
      }
    });
  }

  /**
   * Format date and time for display
   */
  function formatDateTime(date, time, timezone) {
    try {
      const [year, month, day] = date.split("-");
      const [hour, minute] = time.split(":");
      const dateObj = new Date(year, month - 1, day, hour, minute);

      return dateObj.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      });
    } catch (error) {
      return `${date} ${time}`;
    }
  }

  /**
   * Highlight the active timezone row
   */
  function highlightActiveTimezone(activeTimezone) {
    // Remove previous highlights
    document.querySelectorAll(".timezone-row").forEach((row) => {
      row.classList.remove("timezone-row--active");
    });

    // Add highlight to active timezone
    const activeRow = document.querySelector(
      `[data-timezone="${activeTimezone}"]`,
    );
    if (activeRow) {
      activeRow.classList.add("timezone-row--active");
    }
  }

  /**
   * Convert times from source timezone to all others
   */
  async function convertTimes(sourceTimezone, date, time) {
    if (isUpdating) return;

    try {
      statusMessage.textContent = "Updating conversions...";
      statusMessage.className = "status-message status-message--loading";

      const response = await fetch(
        `/convert-multi?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&source=${encodeURIComponent(sourceTimezone)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      isUpdating = true;

      // Update all time inputs with converted times
      timeInputs.forEach((input) => {
        const timezone = input.getAttribute("data-timezone");
        if (timezone !== sourceTimezone && data[timezone]) {
          input.value = data[timezone];
        }
      });

      // Update current datetime display if using system timezone
      if (
        sourceTimezone === userTimezone ||
        sourceTimezone === "America/Santiago"
      ) {
        const displayTimezone =
          sourceTimezone === userTimezone ? userTimezone : sourceTimezone;
        currentDateTimeSpan.textContent = formatDateTime(
          date,
          time,
          displayTimezone,
        );
      }

      // Update timezone offsets
      updateTimezoneOffsets(date);

      // Highlight active timezone
      highlightActiveTimezone(sourceTimezone);

      statusMessage.textContent = `Conversions based on ${timezoneData[sourceTimezone]?.name || sourceTimezone}`;
      statusMessage.className = "status-message status-message--success";
    } catch (error) {
      console.error("Error converting times:", error);
      statusMessage.textContent = `Error converting times: ${error.message}`;
      statusMessage.className = "status-message status-message--error";
    } finally {
      isUpdating = false;
    }
  }

  /**
   * Load current time and perform initial conversion
   */
  async function loadInitialTimes() {
    try {
      statusMessage.textContent = "Loading current times...";
      statusMessage.className = "status-message status-message--loading";

      const response = await fetch("/current");

      if (response.ok) {
        const data = await response.json();

        // Set date input
        dateInput.value = data.date;

        // Set initial time for Chile (default source)
        const chileInput = document.querySelector(
          '[data-timezone="America/Santiago"]',
        );
        if (chileInput) {
          chileInput.value = data.time;
          lastEditedTimezone = "America/Santiago";
        }

        // Update current date/time display
        currentDateTimeSpan.textContent = formatDateTime(
          data.date,
          data.time,
          userTimezone,
        );

        // Perform initial conversion
        await convertTimes("America/Santiago", data.date, data.time);
      } else {
        // Fallback to local time
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const currentDate = now.toISOString().split("T")[0];
        const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

        dateInput.value = currentDate;

        const chileInput = document.querySelector(
          '[data-timezone="America/Santiago"]',
        );
        if (chileInput) {
          chileInput.value = currentTime;
        }

        currentDateTimeSpan.textContent = formatDateTime(
          currentDate,
          currentTime,
          userTimezone,
        );
        await convertTimes("America/Santiago", currentDate, currentTime);
      }
    } catch (error) {
      console.error("Error loading initial times:", error);

      // Fallback to current local time
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

      dateInput.value = currentDate;
      const chileInput = document.querySelector(
        '[data-timezone="America/Santiago"]',
      );
      if (chileInput) {
        chileInput.value = currentTime;
      }

      statusMessage.textContent = "Using local browser time";
      statusMessage.className = "status-message status-message--warning";
    }
  }

  /**
   * Handle time input changes
   */
  function handleTimeInputChange(event) {
    const input = event.target;
    const timezone = input.getAttribute("data-timezone");
    const time = input.value;
    const date = dateInput.value;

    if (date && time && !isUpdating) {
      lastEditedTimezone = timezone;
      convertTimes(timezone, date, time);
    }
  }

  /**
   * Handle date input changes
   */
  function handleDateChange() {
    const date = dateInput.value;

    if (date && !isUpdating) {
      // Find the last edited time input and use it as source
      const sourceInput = document.querySelector(
        `[data-timezone="${lastEditedTimezone}"]`,
      );
      const time = sourceInput ? sourceInput.value : "12:00";

      if (time) {
        convertTimes(lastEditedTimezone, date, time);
      }
    }
  }

  // Event listeners
  timeInputs.forEach((input) => {
    input.addEventListener("change", handleTimeInputChange);
    input.addEventListener("input", handleTimeInputChange);
  });

  dateInput.addEventListener("change", handleDateChange);

  // Update time displays every minute
  function updateCurrentTime() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Only update if we're still showing "today" and haven't manually changed the date
    if (dateInput.value === currentDate) {
      // Update timezone offsets as they might change due to DST
      updateTimezoneOffsets(currentDate);
    }
  }

  // Load initial times when page loads
  loadInitialTimes();

  // Update displays every minute
  setInterval(updateCurrentTime, 60000);
});
