/* Timezone converter — dynamic zones with localStorage persistence */

document.addEventListener("DOMContentLoaded", () => {

  // =================== CATALOG ===================
  const TIMEZONE_CATALOG = [
    // Americas
    { tz: "America/Santiago",                  name: "Chile",          location: "Santiago",      flag: "🇨🇱", region: "Americas" },
    { tz: "America/New_York",                  name: "United States",  location: "New York",      flag: "🇺🇸", region: "Americas" },
    { tz: "America/Chicago",                   name: "United States",  location: "Chicago",       flag: "🇺🇸", region: "Americas" },
    { tz: "America/Denver",                    name: "United States",  location: "Denver",        flag: "🇺🇸", region: "Americas" },
    { tz: "America/Los_Angeles",               name: "United States",  location: "Los Angeles",   flag: "🇺🇸", region: "Americas" },
    { tz: "America/Anchorage",                 name: "United States",  location: "Anchorage",     flag: "🇺🇸", region: "Americas" },
    { tz: "Pacific/Honolulu",                  name: "United States",  location: "Honolulu",      flag: "🇺🇸", region: "Americas" },
    { tz: "America/Sao_Paulo",                 name: "Brazil",         location: "Sao Paulo",     flag: "🇧🇷", region: "Americas" },
    { tz: "America/Bogota",                    name: "Colombia",       location: "Bogota",        flag: "🇨🇴", region: "Americas" },
    { tz: "America/Mexico_City",               name: "Mexico",         location: "Mexico City",   flag: "🇲🇽", region: "Americas" },
    { tz: "America/Argentina/Buenos_Aires",    name: "Argentina",      location: "Buenos Aires",  flag: "🇦🇷", region: "Americas" },
    { tz: "America/Lima",                      name: "Peru",           location: "Lima",          flag: "🇵🇪", region: "Americas" },
    { tz: "America/Caracas",                   name: "Venezuela",      location: "Caracas",       flag: "🇻🇪", region: "Americas" },
    { tz: "America/La_Paz",                    name: "Bolivia",        location: "La Paz",        flag: "🇧🇴", region: "Americas" },
    { tz: "America/Guayaquil",                 name: "Ecuador",        location: "Guayaquil",     flag: "🇪🇨", region: "Americas" },
    { tz: "America/Asuncion",                  name: "Paraguay",       location: "Asuncion",      flag: "🇵🇾", region: "Americas" },
    { tz: "America/Montevideo",                name: "Uruguay",        location: "Montevideo",    flag: "🇺🇾", region: "Americas" },
    { tz: "America/Havana",                    name: "Cuba",           location: "Havana",        flag: "🇨🇺", region: "Americas" },
    { tz: "America/Toronto",                   name: "Canada",         location: "Toronto",       flag: "🇨🇦", region: "Americas" },
    { tz: "America/Vancouver",                 name: "Canada",         location: "Vancouver",     flag: "🇨🇦", region: "Americas" },
    { tz: "America/Panama",                    name: "Panama",         location: "Panama City",   flag: "🇵🇦", region: "Americas" },
    { tz: "America/Costa_Rica",                name: "Costa Rica",     location: "San Jose",      flag: "🇨🇷", region: "Americas" },
    { tz: "America/Guatemala",                 name: "Guatemala",      location: "Guatemala City",flag: "🇬🇹", region: "Americas" },
    { tz: "America/Puerto_Rico",               name: "Puerto Rico",    location: "San Juan",      flag: "🇵🇷", region: "Americas" },
    { tz: "America/Santo_Domingo",             name: "Dom. Republic",  location: "Santo Domingo", flag: "🇩🇴", region: "Americas" },
    // Europe
    { tz: "Europe/London",                     name: "United Kingdom", location: "London",        flag: "🇬🇧", region: "Europe" },
    { tz: "Europe/Paris",                      name: "France",         location: "Paris",         flag: "🇫🇷", region: "Europe" },
    { tz: "Europe/Berlin",                     name: "Germany",        location: "Berlin",        flag: "🇩🇪", region: "Europe" },
    { tz: "Europe/Madrid",                     name: "Spain",          location: "Madrid",        flag: "🇪🇸", region: "Europe" },
    { tz: "Europe/Rome",                       name: "Italy",          location: "Rome",          flag: "🇮🇹", region: "Europe" },
    { tz: "Europe/Amsterdam",                  name: "Netherlands",    location: "Amsterdam",     flag: "🇳🇱", region: "Europe" },
    { tz: "Europe/Brussels",                   name: "Belgium",        location: "Brussels",      flag: "🇧🇪", region: "Europe" },
    { tz: "Europe/Zurich",                     name: "Switzerland",    location: "Zurich",        flag: "🇨🇭", region: "Europe" },
    { tz: "Europe/Stockholm",                  name: "Sweden",         location: "Stockholm",     flag: "🇸🇪", region: "Europe" },
    { tz: "Europe/Oslo",                       name: "Norway",         location: "Oslo",          flag: "🇳🇴", region: "Europe" },
    { tz: "Europe/Helsinki",                   name: "Finland",        location: "Helsinki",      flag: "🇫🇮", region: "Europe" },
    { tz: "Europe/Warsaw",                     name: "Poland",         location: "Warsaw",        flag: "🇵🇱", region: "Europe" },
    { tz: "Europe/Prague",                     name: "Czech Republic", location: "Prague",        flag: "🇨🇿", region: "Europe" },
    { tz: "Europe/Vienna",                     name: "Austria",        location: "Vienna",        flag: "🇦🇹", region: "Europe" },
    { tz: "Europe/Lisbon",                     name: "Portugal",       location: "Lisbon",        flag: "🇵🇹", region: "Europe" },
    { tz: "Europe/Moscow",                     name: "Russia",         location: "Moscow",        flag: "🇷🇺", region: "Europe" },
    { tz: "Europe/Istanbul",                   name: "Turkey",         location: "Istanbul",      flag: "🇹🇷", region: "Europe" },
    { tz: "Europe/Athens",                     name: "Greece",         location: "Athens",        flag: "🇬🇷", region: "Europe" },
    { tz: "Europe/Bucharest",                  name: "Romania",        location: "Bucharest",     flag: "🇷🇴", region: "Europe" },
    { tz: "Europe/Budapest",                   name: "Hungary",        location: "Budapest",      flag: "🇭🇺", region: "Europe" },
    { tz: "Europe/Kyiv",                       name: "Ukraine",        location: "Kyiv",          flag: "🇺🇦", region: "Europe" },
    { tz: "Europe/Copenhagen",                 name: "Denmark",        location: "Copenhagen",    flag: "🇩🇰", region: "Europe" },
    { tz: "Europe/Dublin",                     name: "Ireland",        location: "Dublin",        flag: "🇮🇪", region: "Europe" },
    // Asia
    { tz: "Asia/Dubai",                        name: "UAE",            location: "Dubai",         flag: "🇦🇪", region: "Asia" },
    { tz: "Asia/Riyadh",                       name: "Saudi Arabia",   location: "Riyadh",        flag: "🇸🇦", region: "Asia" },
    { tz: "Asia/Jerusalem",                    name: "Israel",         location: "Jerusalem",     flag: "🇮🇱", region: "Asia" },
    { tz: "Asia/Tehran",                       name: "Iran",           location: "Tehran",        flag: "🇮🇷", region: "Asia" },
    { tz: "Asia/Kolkata",                      name: "India",          location: "Mumbai",        flag: "🇮🇳", region: "Asia" },
    { tz: "Asia/Dhaka",                        name: "Bangladesh",     location: "Dhaka",         flag: "🇧🇩", region: "Asia" },
    { tz: "Asia/Colombo",                      name: "Sri Lanka",      location: "Colombo",       flag: "🇱🇰", region: "Asia" },
    { tz: "Asia/Kathmandu",                    name: "Nepal",          location: "Kathmandu",     flag: "🇳🇵", region: "Asia" },
    { tz: "Asia/Bangkok",                      name: "Thailand",       location: "Bangkok",       flag: "🇹🇭", region: "Asia" },
    { tz: "Asia/Singapore",                    name: "Singapore",      location: "Singapore",     flag: "🇸🇬", region: "Asia" },
    { tz: "Asia/Kuala_Lumpur",                 name: "Malaysia",       location: "Kuala Lumpur",  flag: "🇲🇾", region: "Asia" },
    { tz: "Asia/Jakarta",                      name: "Indonesia",      location: "Jakarta",       flag: "🇮🇩", region: "Asia" },
    { tz: "Asia/Shanghai",                     name: "China",          location: "Beijing",       flag: "🇨🇳", region: "Asia" },
    { tz: "Asia/Hong_Kong",                    name: "Hong Kong",      location: "Hong Kong",     flag: "🇭🇰", region: "Asia" },
    { tz: "Asia/Tokyo",                        name: "Japan",          location: "Tokyo",         flag: "🇯🇵", region: "Asia" },
    { tz: "Asia/Seoul",                        name: "South Korea",    location: "Seoul",         flag: "🇰🇷", region: "Asia" },
    { tz: "Asia/Taipei",                       name: "Taiwan",         location: "Taipei",        flag: "🇹🇼", region: "Asia" },
    { tz: "Asia/Manila",                       name: "Philippines",    location: "Manila",        flag: "🇵🇭", region: "Asia" },
    { tz: "Asia/Karachi",                      name: "Pakistan",       location: "Karachi",       flag: "🇵🇰", region: "Asia" },
    { tz: "Asia/Kabul",                        name: "Afghanistan",    location: "Kabul",         flag: "🇦🇫", region: "Asia" },
    { tz: "Asia/Tashkent",                     name: "Uzbekistan",     location: "Tashkent",      flag: "🇺🇿", region: "Asia" },
    { tz: "Asia/Almaty",                       name: "Kazakhstan",     location: "Almaty",        flag: "🇰🇿", region: "Asia" },
    // Africa
    { tz: "Africa/Cairo",                      name: "Egypt",          location: "Cairo",         flag: "🇪🇬", region: "Africa" },
    { tz: "Africa/Lagos",                      name: "Nigeria",        location: "Lagos",         flag: "🇳🇬", region: "Africa" },
    { tz: "Africa/Nairobi",                    name: "Kenya",          location: "Nairobi",       flag: "🇰🇪", region: "Africa" },
    { tz: "Africa/Johannesburg",               name: "South Africa",   location: "Johannesburg",  flag: "🇿🇦", region: "Africa" },
    { tz: "Africa/Casablanca",                 name: "Morocco",        location: "Casablanca",    flag: "🇲🇦", region: "Africa" },
    { tz: "Africa/Accra",                      name: "Ghana",          location: "Accra",         flag: "🇬🇭", region: "Africa" },
    { tz: "Africa/Addis_Ababa",                name: "Ethiopia",       location: "Addis Ababa",   flag: "🇪🇹", region: "Africa" },
    // Pacific / Australia
    { tz: "Australia/Sydney",                  name: "Australia",      location: "Sydney",        flag: "🇦🇺", region: "Pacific" },
    { tz: "Australia/Melbourne",               name: "Australia",      location: "Melbourne",     flag: "🇦🇺", region: "Pacific" },
    { tz: "Australia/Perth",                   name: "Australia",      location: "Perth",         flag: "🇦🇺", region: "Pacific" },
    { tz: "Pacific/Auckland",                  name: "New Zealand",    location: "Auckland",      flag: "🇳🇿", region: "Pacific" },
    { tz: "Pacific/Fiji",                      name: "Fiji",           location: "Suva",          flag: "🇫🇯", region: "Pacific" },
  ];

  const DEFAULT_TIMEZONES = [
    "America/Santiago",
    "America/New_York",
    "America/Sao_Paulo",
    "America/Bogota",
    "America/Mexico_City",
  ];

  const LS_KEY_ZONES = "timezone-app-zones";

  // =================== STATE ===================
  let activeTimezones = loadActiveZones();
  let lastEditedTimezone = activeTimezones[0];
  let isUpdating = false;

  const catalogByTz = {};
  TIMEZONE_CATALOG.forEach(item => { catalogByTz[item.tz] = item; });

  // =================== DOM REFS ===================
  const dateInput         = document.getElementById("dateInput");
  const userTimezoneSpan  = document.getElementById("userTimezone");
  const currentDateTimeSpan = document.getElementById("currentDateTime");
  const statusMessage     = document.getElementById("statusMessage");
  const timezoneGrid      = document.querySelector(".timezone-grid");
  const addBtn            = document.getElementById("addTimezoneBtn");
  const modal             = document.getElementById("tzModal");
  const modalClose        = document.getElementById("modalClose");
  const modalSearch       = document.getElementById("modalSearch");
  const modalList         = document.getElementById("modalList");

  // =================== STORAGE ===================
  function loadActiveZones() {
    try {
      const saved = localStorage.getItem(LS_KEY_ZONES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [...DEFAULT_TIMEZONES];
  }

  function saveActiveZones() {
    localStorage.setItem(LS_KEY_ZONES, JSON.stringify(activeTimezones));
  }

  // =================== CONVERSION HELPERS ===================
  function getOffset(date, timeZone) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const v = {};
    for (const p of dtf.formatToParts(date)) if (p.type !== "literal") v[p.type] = p.value;
    const asUTC = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute, +v.second);
    return -((date.getTime() - asUTC) / 60000);
  }

  function calculateEpoch(dateStr, timeStr, sourceTz) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const [h, min]  = timeStr.split(":").map(Number);
    const anchor = new Date(Date.UTC(y, m - 1, d, h, min, 0));
    const offset = getOffset(anchor, sourceTz);
    return Date.UTC(y, m - 1, d, h, min) - offset * 60 * 1000;
  }

  function convertLocally(sourceTz, date, time) {
    const epoch = calculateEpoch(date, time, sourceTz);
    const results = {};
    for (const tz of activeTimezones) {
      results[tz] = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
      }).format(new Date(epoch));
    }
    return results;
  }

  function formatDateTime(date, time, timezone) {
    try {
      const [y, m, d] = date.split("-");
      const [h, min]  = time.split(":");
      return new Date(y, m - 1, d, h, min).toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", timeZone: timezone,
      });
    } catch { return `${date} ${time}`; }
  }

  function updateTimezoneOffsets(date) {
    document.querySelectorAll(".timezone-offset").forEach(el => {
      const tz = el.getAttribute("data-timezone");
      try {
        const testDate = new Date(`${date}T12:00:00`);
        const parts = new Intl.DateTimeFormat("en", {
          timeZone: tz, timeZoneName: "longOffset",
        }).formatToParts(testDate);
        const part = parts.find(p => p.type === "timeZoneName");
        if (part) el.textContent = part.value.replace("GMT", "UTC");
      } catch (_) {}
    });
  }

  function updateAmPmDisplay(tz, time24) {
    const hour = parseInt(time24.split(":")[0], 10);
    const el = document.querySelector(`[data-timezone="${tz}"] .ampm-display`);
    if (el) el.textContent = hour >= 12 ? "PM" : "AM";
  }

  function highlightActiveTimezone(tz) {
    document.querySelectorAll(".timezone-card").forEach(c => c.classList.remove("timezone-card--active"));
    const card = document.querySelector(`.timezone-card[data-timezone="${tz}"]`);
    if (card) card.classList.add("timezone-card--active");
  }

  // =================== DRAG AND DROP ===================
  let dragSrcTz = null;

  function attachDragEvents(card, tz) {
    card.setAttribute("draggable", "true");

    card.addEventListener("dragstart", (e) => {
      dragSrcTz = tz;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", tz);
      setTimeout(() => card.classList.add("is-dragging"), 0);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      document.querySelectorAll(".timezone-card").forEach(c => c.classList.remove("drag-over"));
    });

    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (tz !== dragSrcTz) card.classList.add("drag-over");
    });

    card.addEventListener("dragleave", (e) => {
      if (!card.contains(e.relatedTarget)) card.classList.remove("drag-over");
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();
      card.classList.remove("drag-over");
      if (!dragSrcTz || dragSrcTz === tz) return;

      const snapshot = captureCurrentTimes();
      const fromIdx = activeTimezones.indexOf(dragSrcTz);
      const toIdx   = activeTimezones.indexOf(tz);
      if (fromIdx === -1 || toIdx === -1) return;

      activeTimezones.splice(fromIdx, 1);
      activeTimezones.splice(toIdx, 0, dragSrcTz);
      saveActiveZones();
      renderGrid();
      restoreAndSync(snapshot);
    });
  }

  // =================== RENDERING ===================
  function createCard(tzObj) {
    const card = document.createElement("div");
    card.className = "timezone-card";
    card.setAttribute("data-timezone", tzObj.tz);

    card.innerHTML = `
      <button class="remove-btn" data-timezone="${tzObj.tz}" title="Remove timezone" aria-label="Remove ${tzObj.name}">×</button>
      <div class="card-header">
        <div class="drag-handle" title="Drag to reorder">⠿</div>
        <div class="flag-container">${tzObj.flag}</div>
        <div class="timezone-info">
          <div class="timezone-name">${tzObj.name}</div>
          <div class="timezone-location">${tzObj.location}</div>
        </div>
      </div>
      <div class="time-section">
        <input type="time" class="time-input" data-timezone="${tzObj.tz}" step="60" />
        <div class="ampm-display">AM</div>
        <div class="timezone-offset" data-timezone="${tzObj.tz}">UTC</div>
      </div>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => removeZone(tzObj.tz));
    const ti = card.querySelector(".time-input");
    ti.addEventListener("change", handleTimeInputChange);
    ti.addEventListener("input", handleTimeInputChange);

    attachDragEvents(card, tzObj.tz);

    return card;
  }

  function renderGrid() {
    timezoneGrid.innerHTML = "";
    for (const tz of activeTimezones) {
      const tzObj = catalogByTz[tz];
      if (tzObj) timezoneGrid.appendChild(createCard(tzObj));
    }
    // hide remove btn when only 1 zone remains
    if (activeTimezones.length === 1) {
      const btn = timezoneGrid.querySelector(".remove-btn");
      if (btn) btn.style.display = "none";
    }
  }

  // =================== ZONE MANAGEMENT ===================
  function captureCurrentTimes() {
    const snapshot = {};
    document.querySelectorAll(".time-input").forEach(input => {
      const tz = input.getAttribute("data-timezone");
      if (input.value) snapshot[tz] = input.value;
    });
    return snapshot;
  }

  function addZone(tz) {
    if (activeTimezones.includes(tz)) return;
    const snapshot = captureCurrentTimes();
    activeTimezones.push(tz);
    saveActiveZones();
    renderGrid();
    restoreAndSync(snapshot);
    closeModal();
  }

  function removeZone(tz) {
    if (activeTimezones.length <= 1) return;
    const snapshot = captureCurrentTimes();
    activeTimezones = activeTimezones.filter(z => z !== tz);
    if (lastEditedTimezone === tz) lastEditedTimezone = activeTimezones[0];
    saveActiveZones();
    renderGrid();
    restoreAndSync(snapshot);
  }

  function restoreAndSync(snapshot) {
    const date = dateInput.value;
    // restore saved values to existing inputs
    document.querySelectorAll(".time-input").forEach(input => {
      const tz = input.getAttribute("data-timezone");
      if (snapshot[tz]) {
        input.value = snapshot[tz];
        updateAmPmDisplay(tz, snapshot[tz]);
      }
    });
    // use the source timezone to recalculate missing ones
    const srcInput = document.querySelector(`.time-input[data-timezone="${lastEditedTimezone}"]`);
    const time = srcInput ? srcInput.value : null;
    if (date && time) {
      convertTimes(lastEditedTimezone, date, time);
    }
    updateTimezoneOffsets(date);
    highlightActiveTimezone(lastEditedTimezone);
  }

  // =================== CONVERSION ===================
  async function convertTimes(sourceTz, date, time) {
    if (isUpdating) return;
    statusMessage.textContent = "Updating conversions...";
    statusMessage.className = "status-message status-message--loading";

    const data = convertLocally(sourceTz, date, time);
    try {
      isUpdating = true;
      document.querySelectorAll(".time-input").forEach(input => {
        const tz = input.getAttribute("data-timezone");
        if (data[tz]) {
          input.value = data[tz];
          updateAmPmDisplay(tz, data[tz]);
        }
      });
      updateTimezoneOffsets(date);
      highlightActiveTimezone(sourceTz);
      statusMessage.textContent = `Conversions based on ${catalogByTz[sourceTz]?.name || sourceTz}`;
      statusMessage.className = "status-message status-message--success";
    } catch (e) {
      statusMessage.textContent = `Error: ${e.message}`;
      statusMessage.className = "status-message status-message--error";
    } finally {
      isUpdating = false;
    }
  }

  function handleTimeInputChange(event) {
    const input = event.target;
    const tz   = input.getAttribute("data-timezone");
    const time = input.value;
    const date = dateInput.value;
    if (date && time && !isUpdating) {
      lastEditedTimezone = tz;
      updateAmPmDisplay(tz, time);
      convertTimes(tz, date, time);
    }
  }

  function handleDateChange() {
    const date = dateInput.value;
    if (date && !isUpdating) {
      const srcInput = document.querySelector(`.time-input[data-timezone="${lastEditedTimezone}"]`);
      const time = srcInput ? srcInput.value : "12:00";
      if (time) convertTimes(lastEditedTimezone, date, time);
    }
  }

  async function loadInitialTimes() {
    statusMessage.textContent = "Loading current times...";
    statusMessage.className = "status-message status-message--loading";

    const now = new Date();
    // Use local date in the source timezone, not UTC (avoids midnight-edge mismatch)
    const currentDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: lastEditedTimezone,
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(now);
    const userTime = new Intl.DateTimeFormat("en-US", {
      timeZone: lastEditedTimezone, hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(now);

    dateInput.value = currentDate;

    const srcInput = document.querySelector(`.time-input[data-timezone="${lastEditedTimezone}"]`);
    if (srcInput) {
      srcInput.value = userTime;
      updateAmPmDisplay(lastEditedTimezone, userTime);
    }

    currentDateTimeSpan.textContent = formatDateTime(currentDate, userTime, lastEditedTimezone);
    await convertTimes(lastEditedTimezone, currentDate, userTime);
    updateTimezoneOffsets(currentDate);
    highlightActiveTimezone(lastEditedTimezone);
  }

  // =================== MODAL ===================
  function openModal() {
    renderModalList("");
    modal.classList.add("modal--open");
    modalSearch.value = "";
    setTimeout(() => modalSearch.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove("modal--open");
  }

  const REGION_ORDER = ["Americas", "Europe", "Asia", "Africa", "Pacific"];

  function renderModalList(query) {
    const q = query.toLowerCase().trim();
    const grouped = {};

    for (const item of TIMEZONE_CATALOG) {
      if (q && !item.name.toLowerCase().includes(q)
             && !item.location.toLowerCase().includes(q)
             && !item.region.toLowerCase().includes(q)) continue;
      if (!grouped[item.region]) grouped[item.region] = [];
      grouped[item.region].push(item);
    }

    modalList.innerHTML = "";
    let totalItems = 0;

    for (const region of REGION_ORDER) {
      if (!grouped[region]) continue;
      const groupEl = document.createElement("div");
      groupEl.className = "modal-group";
      groupEl.innerHTML = `<div class="modal-group-label">${region}</div>`;

      for (const item of grouped[region]) {
        totalItems++;
        const isActive = activeTimezones.includes(item.tz);
        const row = document.createElement("button");
        row.className = `modal-item${isActive ? " modal-item--active" : ""}`;
        row.disabled = isActive;
        row.innerHTML = `
          <span class="modal-item-flag">${item.flag}</span>
          <span class="modal-item-info">
            <span class="modal-item-name">${item.name}</span>
            <span class="modal-item-location">${item.location}</span>
          </span>
          ${isActive ? '<span class="modal-item-check">✓</span>' : '<span class="modal-item-add">+</span>'}
        `;
        if (!isActive) row.addEventListener("click", () => addZone(item.tz));
        groupEl.appendChild(row);
      }
      modalList.appendChild(groupEl);
    }

    if (totalItems === 0) {
      modalList.innerHTML = `<div class="modal-empty">No results for "${query}"</div>`;
    }
  }

  // =================== THEME ===================
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon   = document.querySelector(".theme-icon");
  const savedTheme  = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    const cur  = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // =================== INIT ===================
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  userTimezoneSpan.textContent = userTimezone;

  // Seed from user's actual timezone if it's in the active list, else first active
  lastEditedTimezone = activeTimezones.includes(userTimezone)
    ? userTimezone
    : activeTimezones[0];

  renderGrid();

  dateInput.addEventListener("change", handleDateChange);
  addBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  modalSearch.addEventListener("input", e => renderModalList(e.target.value));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  loadInitialTimes();

  setInterval(() => {
    if (dateInput.value === new Date().toISOString().split("T")[0]) {
      updateTimezoneOffsets(dateInput.value);
    }
  }, 60000);
});
