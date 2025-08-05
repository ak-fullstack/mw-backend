export class DateUtil {
  /**
   * Converts a UTC timestamp (string or Date) to IST and returns only the date in YYYY-MM-DD format.
   * @param utcTimestamp - UTC string or Date (e.g., "2025-08-10T11:11:00.000Z" or new Date())
   * @returns string - Date in IST as YYYY-MM-DD
   */
  static convertUTCToISTDateOnly(utcTimestamp: string | Date): string {
    const utcDate = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;
    const istOffset = 5.5 * 60 * 60 * 1000; // +5:30 offset
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toISOString().split('T')[0];
  }
}