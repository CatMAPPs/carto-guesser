<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import GameplayView from '@/components/game/GameplayView.vue'
import ResultsScreen from '@/components/game/ResultsScreen.vue'
import { getDailyChallengeFigures } from '@/lib/data/figures'
import { calculateRoundScore } from '@/lib/scoring'
import type { Figure } from '@/types/figure'
import type { RoundScore } from '@/types/score'

const router = useRouter()
const DAILY_ROUNDS = 3

const gameplayRef = ref<InstanceType<typeof GameplayView> | null>(null)

const gameState = ref<'loading' | 'info' | 'playing' | 'completed'>('loading')
const figures = ref<Figure[]>([])
const currentFigure = ref<Figure | null>(null)
const currentRoundNumber = ref(1)
const scores = ref<RoundScore[]>([])
const isPracticeMode = ref(false)
const showPracticeComplete = ref(false)
const finalResults = ref<{ totalScore: number; componentScores: { spatial: number; temporal: number; name: number; speed: number } } | null>(null)

const today = computed(() => new Date().toISOString().split('T')[0])
const dailyKey = computed(() => `carto_daily_${today.value}`)

const isLastRound = computed(() => currentRoundNumber.value >= DAILY_ROUNDS)

const isValidSavedResult = (value: unknown): value is NonNullable<typeof finalResults.value> => {
  if (!value || typeof value !== 'object') return false

  const result = value as Record<string, unknown>
  const components = result.componentScores
  if (!components || typeof components !== 'object') return false

  return (
    typeof result.totalScore === 'number' &&
    ['spatial', 'temporal', 'name', 'speed'].every(
      (key) => typeof (components as Record<string, unknown>)[key] === 'number',
    )
  )
}

const loadChallenge = async () => {
  try {
    // Check if already completed today
    const saved = localStorage.getItem(dailyKey.value)
    if (saved) {
      const savedResult: unknown = JSON.parse(saved)
      if (isValidSavedResult(savedResult)) {
        finalResults.value = savedResult
        gameState.value = 'completed'
        return
      }

      localStorage.removeItem(dailyKey.value)
    }

    figures.value = await getDailyChallengeFigures(today.value)
    gameState.value = 'info'
  } catch (error) {
    console.error('Failed to load daily challenge:', error)
    gameState.value = 'info'
  }
}

const startChallenge = () => {
  if (figures.value.length === 0) return
  currentFigure.value = figures.value[0]
  currentRoundNumber.value = 1
  scores.value = []
  gameState.value = 'playing'
}

const replayChallenge = async () => {
  if (figures.value.length === 0) {
    figures.value = await getDailyChallengeFigures(today.value)
  }

  isPracticeMode.value = true
  showPracticeComplete.value = false
  startChallenge()
}

const handleSubmit = (
  guess: { name: string; coordinates: { lat: number; lon: number } | null; year: number },
  submissionTime: number,
  spatialMax: number,
) => {
  if (!currentFigure.value || !gameplayRef.value || !guess.coordinates) return

  const calculatedScore = calculateRoundScore(
    guess.name,
    guess.coordinates.lat,
    guess.coordinates.lon,
    guess.year,
    currentFigure.value.nom,
    currentFigure.value.lat,
    currentFigure.value.lon,
    currentFigure.value.any_foto,
    [],
    submissionTime,
    'daily_challenge',
    spatialMax,
  )

  const roundScore: RoundScore = {
    spatial: calculatedScore.spatial_score,
    temporal: calculatedScore.temporal_score,
    name: calculatedScore.name_score,
    speed: calculatedScore.speed_bonus,
    total: calculatedScore.total,
    distanceKm: calculatedScore.distance_km,
    yearDiff: calculatedScore.year_diff,
    spatialMax: calculatedScore.spatial_max,
  }

  scores.value.push(roundScore)
  gameplayRef.value.showRevealPhase(roundScore)
}

const handleNextRound = () => {
  if (isLastRound.value) {
    const totalScore = scores.value.reduce((sum, s) => sum + s.total, 0)
    const result = {
      totalScore,
      componentScores: {
        spatial: scores.value.reduce((sum, s) => sum + s.spatial, 0),
        temporal: scores.value.reduce((sum, s) => sum + s.temporal, 0),
        name: scores.value.reduce((sum, s) => sum + s.name, 0),
        speed: scores.value.reduce((sum, s) => sum + s.speed, 0),
      },
    }

    if (!isPracticeMode.value) {
      // The first completed attempt is the official daily score.
      localStorage.setItem(dailyKey.value, JSON.stringify(result))
      finalResults.value = result
    } else {
      showPracticeComplete.value = true
    }
    gameState.value = 'completed'
  } else {
    currentRoundNumber.value++
    currentFigure.value = figures.value[currentRoundNumber.value - 1]
  }
}

const goToMenu = () => router.push('/')

onMounted(() => {
  loadChallenge()
})
</script>

<template>
  <div class="min-h-screen p-4">
    <!-- Loading -->
    <div v-if="gameState === 'loading'" class="flex items-center justify-center min-h-screen">
      <Card class="text-center">
        <div class="text-noir-text">Carregant Repte Diari...</div>
      </Card>
    </div>

    <!-- Info screen -->
    <div v-else-if="gameState === 'info'" class="flex items-center justify-center min-h-screen">
      <Card class="max-w-2xl w-full">
        <div class="text-center space-y-6">
          <div>
            <h1 class="text-4xl font-bebas text-noir-gold mb-2">REPTE DIARI</h1>
            <p class="text-noir-text/80">{{ today }}</p>
          </div>

          <div class="space-y-4">
            <Button
              v-if="figures.length > 0"
              size="lg"
              class="w-full"
              @click="startChallenge"
            >
              Comença el Repte
            </Button>
            <p v-else class="text-noir-red text-sm">No hi ha figures disponibles.</p>

            <Button variant="ghost" class="w-full" @click="goToMenu">
              Tornar al Menú
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Gameplay -->
    <GameplayView
      v-else-if="gameState === 'playing' && currentFigure"
      ref="gameplayRef"
      :current-figure="currentFigure"
      :current-round="currentRoundNumber"
      :total-rounds="DAILY_ROUNDS"
      :show-timer="true"
      :timer-duration="45"
      :auto-advance="false"
      @submit="handleSubmit"
      @next-round="handleNextRound"
      @back-to-home="goToMenu"
    />

    <!-- Results -->
    <div v-else-if="gameState === 'completed' && finalResults" class="flex items-center justify-center min-h-screen">
      <ResultsScreen
        v-if="!showPracticeComplete"
        :total-score="finalResults.totalScore"
        :component-scores="finalResults.componentScores"
        :total-rounds="DAILY_ROUNDS"
        :challenge-date="today"
        :show-play-again="true"
        play-again-label="Practicar de nou"
        :show-leaderboard="false"
        @play-again="replayChallenge"
        @back-to-menu="goToMenu"
      />
      <Card v-else class="max-w-2xl w-full text-center">
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bebas text-noir-gold mb-3">REPTE D’AVUI COMPLETAT!</h1>
            <p class="text-noir-text/80">Torna demà per descobrir-ne un de nou.</p>
          </div>
          <div class="space-y-3">
            <Button size="lg" class="w-full" @click="replayChallenge">
              Practicar de nou
            </Button>
            <Button variant="ghost" size="lg" class="w-full" @click="goToMenu">
              Tornar al menú
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
