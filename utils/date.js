// File: utils/date.js

const { DateTime } = require('luxon');

// Timezone configuration
const TIMEZONE = 'Etc/GMT+2'; // GMT-2

function getCurrentWeekStart() {
    return DateTime.now().setZone(TIMEZONE).startOf('week').minus({ days: 0 }); // Sunday 00:00
}

function getCurrentWeekEnd() {
    return DateTime.now().setZone(TIMEZONE).endOf('week').minus({ days: 1 }); // Saturday 23:59
}

/**
 * Validates if a donation date is within the current week and not in the future.
 * @param {string} dateStr - Format YYYY-MM-DD
 * @returns {boolean}
 */
function validateDonationDate(dateStr) {
    const donationDate = DateTime.fromISO(dateStr, { zone: TIMEZONE });
    const now = DateTime.now().setZone(TIMEZONE);

    if (!donationDate.isValid) {
        return false;
    }

    if (donationDate > now) {
        return false;
    }

    const weekStart = getCurrentWeekStart();
    const weekEnd = getCurrentWeekEnd();

    return donationDate >= weekStart && donationDate <= weekEnd;
}

/**
 * Formats a date into "Week XX - Month" string
 * @param {string} dateStr - Format YYYY-MM-DD
 * @returns {string}
 */
function formatWeek(dateStr) {
    const date = DateTime.fromISO(dateStr, { zone: TIMEZONE });
    const weekNumber = date.weekNumber;
    const monthName = date.toFormat('LLLL'); // Full month name

    return `Week ${weekNumber} - ${monthName}`;
}

module.exports = {
    validateDonationDate,
    formatWeek
};
