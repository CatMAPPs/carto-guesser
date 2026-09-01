/**
 * Calculate speed bonus based on submission time
 * Formula: max(0, 100 - floor(max(0, time_seconds - 15) / 2) * 10)
 * 
 * Time brackets:
 * - 0-15s: 100 points
 * - 15-17s: 90 points
 * - 17-19s: 80 points
 * - 19-21s: 70 points
 * - 21-23s: 60 points
 * - 23-25s: 50 points
 * - 25-27s: 40 points
 * - 27-29s: 30 points
 * - 29-31s: 20 points
 * - 31-33s: 10 points
 * - 33+s: 0 points
 * 
 * @param timeSeconds - Time taken to submit (in seconds)
 * @returns Speed bonus (0-100)
 */
export function calculateSpeedBonus(timeSeconds: number): number {
  if (timeSeconds < 0) return 0

  const bonus = 100 - Math.floor(Math.max(0, timeSeconds - 15) / 2) * 10

  return Math.max(0, bonus)
}

/**
 * Get speed bonus tier description
 */
export function getSpeedBonusTier(timeSeconds: number): string {
  const bonus = calculateSpeedBonus(timeSeconds)

  if (bonus === 100) return 'Lightning Fast!'
  if (bonus >= 80) return 'Very Quick'
  if (bonus >= 60) return 'Quick'
  if (bonus >= 40) return 'Decent'
  if (bonus >= 20) return 'Slow'
  return 'No Bonus'
}

