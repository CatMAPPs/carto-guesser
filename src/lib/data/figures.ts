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
 * Fetch the daily figures by ID block: day 1 gets IDs 1-3, day 2 gets 4-6,
 * and so on. The sequence restarts after all available figures are shown.
 */
export async function getDailyChallengeFigures(date: string): Promise<Figure[]> {
  const all = await loadFigures()
  if (all.length === 0) throw new Error('No figures available in figures.json')
  const ordered = [...all].sort((first, second) => Number(first.id) - Number(second.id))
  const photosPerDay = 3
  const daysPerCycle = Math.ceil(ordered.length / photosPerDay)
  const dayOfMonth = Number(date.slice(8, 10))
  const cycleDay = (dayOfMonth - 1) % daysPerCycle
  const startIndex = cycleDay * photosPerDay

  return ordered.slice(startIndex, startIndex + photosPerDay)
}
