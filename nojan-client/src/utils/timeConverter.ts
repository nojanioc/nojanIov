/**
 * Converts a 3-digit time format to standard time string
 * @param timeNumber - 3-digit number where last digit is 5 (30 minutes) or 0 (00 minutes)
 * @returns Time string in HH:MM format
 *
 * Examples:
 * 335 → "33:30"
 * 125 → "12:30"
 * 320 → "32:00"
 */
export const convertNumberToTime = (timeNumber: number | string): string => {
  // Convert to string and ensure it's 3 digits
  const timeStr = timeNumber.toString().padStart(3, "0");

  // Extract hours (first 2 digits) and minutes indicator (last digit)
  const hours = parseInt(timeStr.slice(0, 2));
  const minutesDigit = parseInt(timeStr.slice(2, 3));

  // Convert minutes digit to actual minutes
  const minutes = minutesDigit === 5 ? 30 : 0;

  // Format as HH:MM
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Converts time in hours and minutes to 3-digit format
 * @param hours - Hours (0-99)
 * @param minutes - Minutes (0 or 30)
 * @returns 3-digit number where last digit is 5 for 30 minutes, 0 for 00 minutes
 *
 * Examples:
 * 33, 30 → 335
 * 12, 30 → 125
 * 32, 0 → 320
 */
export const convertTimeToNumber = (hours: number, minutes: number): number => {
  // Validate inputs
  if (hours < 0 || hours > 99) {
    throw new Error("Hours must be between 0 and 99");
  }

  if (minutes !== 0 && minutes !== 30) {
    throw new Error("Minutes must be either 0 or 30");
  }

  // Convert minutes to digit (30 → 5, 0 → 0)
  const minutesDigit = minutes === 30 ? 5 : 0;

  // Combine hours and minutes digit
  return hours * 10 + minutesDigit;
};

/**
 * Converts a time string (HH:MM) to 3-digit format
 * @param timeString - Time string in HH:MM format
 * @returns 3-digit number
 *
 * Examples:
 * "33:30" → 335
 * "12:30" → 125
 * "32:00" → 320
 */
export const convertTimeStringToNumber = (timeString: string): number => {
  // Parse time string
  const [hoursStr, minutesStr] = timeString.split(":");
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  return convertTimeToNumber(hours, minutes);
};
