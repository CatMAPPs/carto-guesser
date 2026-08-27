import type { Figure } from '@/types/figure'

let cachedFigures: Figure[] | null = null

async function loadFigures(): Promise<Figure[]> {
  if (cachedFigures) return cachedFigures
  const response = await fetch(`${import.meta.env.BASE_URL}figures.json`)
  if (!response.ok) throw new Error('Failed to load figures.json')
  cachedFigures = await response.json()
  return cachedFigures!
}

/**
 * Fetch random figures for Free Play mode.
 */
export async function getRandomFigures(count: number = 10): Promise<Figure[]> {
  const all = await loadFigures()
  if (all.length === 0) throw new Error('No figures available in figures.json')
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Fetch the three figures assigned to a specific September date.
 * The returned order is always level 1, level 2, level 3.
 */
export async function getDailyChallengeFigures(date: string): Promise<Figure[]> {
  const all = await loadFigures()
  if (all.length === 0) throw new Error('No figures available in figures.json')

  const [year, month, day] = date.split('-')
  const challengeDate = `${day}/${month}/${year}`
  const dailyFigures = all
    .filter((figure) => figure.challengeDate === challengeDate)
    .sort((first, second) => first.level - second.level)

  if (dailyFigures.length === 3 && dailyFigures.map((figure) => figure.level).join(',') === '1,2,3') {
    return dailyFigures
  }

  const reservedFigures = all
    .filter((figure) => figure.challengeDate === null)
    .sort((first, second) => Number(first.id) - Number(second.id))
    .slice(0, 3)

  if (reservedFigures.length < 3) {
    throw new Error(`No daily challenge or reserved figures available for ${challengeDate}`)
  }

  return reservedFigures
}
