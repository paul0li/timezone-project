/*
 * Simple Node.js HTTP server to serve a static time‑zone converter application.
 *
 * The server exposes three types of resources:
 *   • Static assets under the `static` directory (index.html, script.js, styles.css).
 *   • A `/convert` endpoint that accepts `date` (YYYY‑MM‑DD) and `time` (HH:MM)
 *     query parameters and returns a JSON object with the equivalent local times
 *     for several target time zones.  The calculation honours daylight saving
 *     time transitions by computing the correct UTC offsets at the exact moment
 *     specified.
 *
 * The conversion logic is intentionally implemented without external
 * dependencies.  It leverages JavaScript's built‑in `Intl.DateTimeFormat`
 * facilities to determine time‑zone offsets dynamically.  See `getOffset`
 * and `convertTime` for the details.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

/**
 * Determine the time‑zone offset (in minutes) for a given moment and zone.
 *
 * This helper computes the difference between UTC and local time in the
 * specified time zone at the provided moment.  The returned value is the
 * conventional offset used in programming: negative numbers denote zones
 * west of UTC (e.g. UTC‑5 → ‑300), while positive numbers denote zones
 * east of UTC.  The calculation uses `Intl.DateTimeFormat` to format
 * `date` in the target zone and then reconstructs an equivalent UTC date
 * from its parts.
 *
 * @param {Date} date Moment in time (interpreted as absolute, not local)
 * @param {string} timeZone IANA time zone identifier (e.g. 'America/Santiago')
 * @returns {number} Offset in minutes relative to UTC
 */
function getOffset(date, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const values = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }
  // Construct a UTC timestamp for the same calendar components as observed in the
  // target time zone.  For example, if the formatted time in the zone is
  // 2025-09-04 11:00:00, this UTC date corresponds to 11:00 UTC.
  const asUTC = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  // The difference between the supplied moment (in UTC) and the reconstructed
  // UTC date yields the offset.  A negative result means the zone is behind UTC.
  return -((date.getTime() - asUTC) / 60000);
}

/**
 * Convert a local date/time from any source timezone to multiple other time zones.
 *
 * The function expects a calendar date (`YYYY-MM-DD`) and a 24‑hour clock
 * (`HH:MM`), both interpreted as the local time observed in the specified
 * source time zone. It first determines the UTC offset for the source timezone
 * at that moment, then computes the corresponding absolute epoch.
 * Finally, for each target zone it determines its offset at that instant
 * and constructs a human‑readable time.
 *
 * @param {string} dateStr Date in the form 'YYYY-MM-DD'
 * @param {string} timeStr Time in the form 'HH:MM'
 * @param {string} sourceTimezone IANA timezone identifier for source (default: 'America/Santiago')
 * @returns {Record<string, string>} Map of IANA time zone names to 'HH:MM' strings
 */
function convertTime(dateStr, timeStr, sourceTimezone = "America/Santiago") {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  if (
    !year ||
    !month ||
    !day ||
    hour == null ||
    minute == null ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    throw new Error("Invalid date or time format");
  }
  // Create a UTC date for the specified calendar components.  This object
  // represents midnight UTC plus the provided hours and minutes.  We use
  // this as an anchor to calculate the offsets; the actual moment will be
  // adjusted below.
  const anchorUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  // Determine the offset (in minutes) for the source timezone at that moment.
  const offsetSource = getOffset(anchorUTC, sourceTimezone);
  // Compute the epoch time (milliseconds since 1970-01-01 UTC) for the
  // specified local time in the source timezone. The offset is subtracted
  // to get the correct UTC timestamp.
  const epochUTC =
    Date.UTC(year, month - 1, day, hour, minute) - offsetSource * 60 * 1000;
  // List of all supported time zones including the source.
  // We return the IANA names as keys; the presentation layer on the client maps these to human‑friendly labels.
  const allZones = [
    "America/Santiago",
    "America/New_York",
    "America/Argentina/Buenos_Aires",
    "America/Bogota",
    "America/Santo_Domingo",
  ];

  // Filter out the source timezone from results to avoid duplication
  const zones = allZones.filter((tz) => tz !== sourceTimezone);
  const results = {};
  const dateUTC = new Date(epochUTC);
  // For each zone, format the UTC moment into the local time.  The
  // Intl.DateTimeFormat API applies the correct DST rules for the target
  // region, so no manual offset calculation is needed beyond the Chilean
  // adjustment already performed.
  for (const tz of zones) {
    const formatted = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dateUTC);
    results[tz] = formatted;
  }
  return results;
}

/**
 * HTTP server instance.
 *
 * The server serves static files from the `static` directory.  When a request
 * targets `/convert`, it returns a JSON object with converted times.  All
 * other requests fall back to static file resolution and return 404 if the
 * file does not exist.
 */
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  if (req.method === "GET" && pathname === "/") {
    // Serve the landing page
    fs.readFile(path.join(__dirname, "static", "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }
  // Serve client‑side JavaScript
  if (req.method === "GET" && pathname === "/script.js") {
    fs.readFile(path.join(__dirname, "static", "script.js"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading script.js");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
    return;
  }
  // Serve stylesheet
  if (req.method === "GET" && pathname === "/styles.css") {
    fs.readFile(path.join(__dirname, "static", "styles.css"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading styles.css");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
    return;
  }
  // Current time endpoint
  if (req.method === "GET" && pathname === "/current") {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    // Get current time in Chile timezone
    const chileTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Santiago",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    try {
      // Get all timezone conversions using Chile as source
      const allZones = [
        "America/Santiago",
        "America/New_York",
        "America/Argentina/Buenos_Aires",
        "America/Bogota",
        "America/Santo_Domingo",
      ];

      const epochUTC = calculateEpochFromTimezone(
        currentDate,
        chileTime,
        "America/Santiago",
      );
      const conversions = {};

      for (const tz of allZones) {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(epochUTC));
        conversions[tz] = formatted;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          date: currentDate,
          time: chileTime,
          timezone: "America/Santiago",
          conversions: conversions,
        }),
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // Multi-timezone conversion endpoint
  if (req.method === "GET" && pathname === "/convert-multi") {
    const { date, time, source } = parsedUrl.query;
    if (!date || !time) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Missing date or time query parameters" }),
      );
      return;
    }

    const sourceTimezone = source || "America/Santiago";
    try {
      const allZones = [
        "America/Santiago",
        "America/New_York",
        "America/Argentina/Buenos_Aires",
        "America/Bogota",
        "America/Santo_Domingo",
      ];

      const results = {};

      // Calculate time for all zones based on the source
      const epochUTC = calculateEpochFromTimezone(date, time, sourceTimezone);

      for (const tz of allZones) {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(epochUTC));
        results[tz] = formatted;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // Conversion endpoint (legacy - maintained for compatibility)
  if (req.method === "GET" && pathname === "/convert") {
    const { date, time, source } = parsedUrl.query;
    if (!date || !time) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Missing date or time query parameters" }),
      );
      return;
    }
    try {
      const sourceTimezone = source || "America/Santiago";
      const result = convertTime(date, time, sourceTimezone);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  // Attempt to serve other static assets (images, fonts, etc.)
  const filePath = path.join(__dirname, "static", pathname);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    res.end(data);
  });
});

// Configure the port via environment variable or fallback to 3000
/**
 * Helper function to calculate UTC epoch from any timezone
 * @param {string} dateStr Date in 'YYYY-MM-DD' format
 * @param {string} timeStr Time in 'HH:MM' format
 * @param {string} sourceTimezone IANA timezone identifier
 * @returns {number} UTC epoch timestamp in milliseconds
 */
function calculateEpochFromTimezone(dateStr, timeStr, sourceTimezone) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  if (
    !year ||
    !month ||
    !day ||
    hour == null ||
    minute == null ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    throw new Error("Invalid date or time format");
  }

  const anchorUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offsetSource = getOffset(anchorUTC, sourceTimezone);
  return (
    Date.UTC(year, month - 1, day, hour, minute) - offsetSource * 60 * 1000
  );
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Time converter running at http://localhost:${PORT}/`);
});
