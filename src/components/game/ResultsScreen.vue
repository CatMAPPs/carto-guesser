<template>
  <div class="results-container">
    <div ref="resultCard" class="results-card-wrapper">
      <Card class="results-card">
      <!-- Header -->
      <div class="results-header">
        <h1 class="results-title">Joc completat!</h1>
        <div class="final-score">
          <span class="score-value">{{ totalScore }}</span>
          <span class="score-max">/ {{ maxScore }}</span>
        </div>
        <div class="score-percentage">
          {{ scorePercentage }}% Precisió
        </div>
        <div class="challenge-date">{{ formattedChallengeDate }}</div>
      </div>

      <!-- Component breakdown -->
      <div class="breakdown-section">
        <h2 class="breakdown-title">Desglossament de la puntuació</h2>
        
        <div class="breakdown-grid">
          <!-- Location -->
          <div class="breakdown-item">
            <div class="breakdown-icon">📍</div>
            <div class="breakdown-content">
              <div class="breakdown-label">Precisió geogràfica</div>
              <div class="breakdown-score">
                {{ componentScores.spatial }} <span class="text-noir-text/60">/ {{ maxComponentScore }}</span>
              </div>
              <div class="breakdown-bar">
                <div 
                  class="breakdown-bar-fill"
                  :style="{ width: `${(componentScores.spatial / maxComponentScore) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
         <!--  <div class="breakdown-item">
            <div class="breakdown-icon">📅</div>
            <div class="breakdown-content">
              <div class="breakdown-label">Timeline Accuracy</div>
              <div class="breakdown-score">
                {{ componentScores.temporal }} <span class="text-noir-text/60">/ {{ maxComponentScore }}</span>
              </div>
              <div class="breakdown-bar">
                <div 
                  class="breakdown-bar-fill"
                  :style="{ width: `${(componentScores.temporal / maxComponentScore) * 100}%` }"
                ></div>
              </div>
            </div>
          </div> -->

          <!-- Name -->
          <!-- <div class="breakdown-item">
            <div class="breakdown-icon">👤</div>
            <div class="breakdown-content">
              <div class="breakdown-label">Name Accuracy</div>
              <div class="breakdown-score">
                {{ componentScores.name }} <span class="text-noir-text/60">/ {{ maxComponentScore }}</span>
              </div>
              <div class="breakdown-bar">
                <div 
                  class="breakdown-bar-fill"
                  :style="{ width: `${(componentScores.name / maxComponentScore) * 100}%` }"
                ></div>
              </div>
            </div>
          </div> -->

          <!-- Speed (if applicable) -->
          <div v-if="componentScores.speed > 0" class="breakdown-item">
            <div class="breakdown-icon">⚡</div>
            <div class="breakdown-content">
              <div class="breakdown-label">Bonus de Velocitat</div>
              <div class="breakdown-score">
                {{ componentScores.speed }} <span class="text-noir-text/60">/ {{ maxSpeedScore }}</span>
              </div>
              <div class="breakdown-bar">
                <div 
                  class="breakdown-bar-fill speed-fill"
                  :style="{ width: `${(componentScores.speed / maxSpeedScore) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional stats (if provided) -->
      <div v-if="showStats" class="stats-section">
        <div v-if="globalRank" class="stat-item">
          <span class="stat-label">Rang Global</span>
          <span class="stat-value">#{{ globalRank }}</span>
        </div>
        <div v-if="streak" class="stat-item">
          <span class="stat-label">Ratxa</span>
          <span class="stat-value">🔥 {{ streak }} dies</span>
        </div>
      </div>

      </Card>
    </div>

      <div class="results-controls">
        <!-- Sharing -->
        <div class="share-section">
        <h2 class="share-title">Comparteix la teva precisió geogràfica</h2>
        <div class="share-options">
          <button class="share-button" type="button" aria-label="Compartir resultat" title="Compartir resultat" @click="shareResult">
            <svg class="share-icon-stroke" aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>
          </button>
          <button class="share-button" type="button" aria-label="Compartir a LinkedIn" title="LinkedIn" @click="shareOn('linkedin')">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.84c0-3.76-2-5.51-4.66-5.51a4.02 4.02 0 0 0-3.64 2.01V8.5H9.2V21h3.5v-6.19c0-1.63.3-3.2 2.32-3.2 1.99 0 2.01 1.86 2.01 3.31V21H21v-7.16Z"/></svg>
          </button>
          <button class="share-button" type="button" aria-label="Compartir a Instagram" title="Instagram" @click="shareOn('instagram')">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.75 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.7a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6Zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>
          </button>
          <button class="share-button" type="button" aria-label="Compartir a WhatsApp" title="WhatsApp" @click="shareOn('whatsapp')">
            <svg class="share-icon-stroke" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2.1.4-.1.6l-.5.6c.7 1.1 1.5 1.7 2.6 2.3l.5-.6c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.2.5-.1.8-.6 1.3-1.3 1.4-1.2.1-2.8-.8-4-1.9-1.2-1.1-2.2-2.6-2.3-3.8-.1-.5.1-.9.5-1.2Z"/></svg>
          </button>
          <button class="share-button" type="button" aria-label="Compartir a Facebook" title="Facebook" @click="shareOn('facebook')">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.75l.42-3h-3.17V8.08c0-.87.24-1.46 1.49-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.45V10H7v3h2.86v8h3.64Z"/></svg>
          </button>
          <button class="share-button" type="button" aria-label="Compartir a X" title="X" @click="shareOn('x')">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18.9 3H22l-6.77 7.74L23.2 21h-6.24l-4.88-6.38L6.5 21H3.4l7.24-8.28L3 3h6.4l4.41 5.83L18.9 3Zm-1.1 16.2h1.73L8.47 4.7H6.61L17.8 19.2Z"/></svg>
          </button>
        </div>
        <p v-if="shareFeedback" class="share-feedback" role="status">{{ shareFeedback }}</p>
      </div>

      <!-- Actions -->
      <div class="results-actions">
        <Button
          v-if="showPlayAgain"
          variant="primary"
          size="lg"
          full-width
          @click="handlePlayAgain"
        >
          Jugar de Nou
        </Button>
        <Button
          v-if="showLeaderboard"
          variant="secondary"
          size="lg"
          full-width
          @click="handleViewLeaderboard"
        >
          View Leaderboard
        </Button>
        <Button
          variant="ghost"
          size="md"
          full-width
          @click="handleBackToMenu"
        >
          Tornar a l'inici
        </Button>
      </div>

      <!-- Guest signup prompt -->
      <div v-if="showSignupPrompt" class="signup-prompt">
        <div class="signup-header">
          <div class="signup-icon">🎭</div>
          <h3 class="signup-title">Join the Investigation</h3>
        </div>
        <p class="signup-text">
          Create a free account to save your scores, compete on daily leaderboards, and unlock multiplayer games with friends.
        </p>
        <Button
          variant="primary"
          size="lg"
          full-width
          @click="handleSignup"
        >
          Sign Up Free
        </Button>
        <p class="signup-disclaimer">
          No email verification required • Quick & secure
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import html2canvas from 'html2canvas';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';

interface ComponentScores {
  spatial: number;
  temporal: number;
  name: number;
  speed: number;
}

interface Props {
  totalScore: number;
  componentScores: ComponentScores;
  totalRounds?: number;
  challengeDate?: string;
  globalRank?: number;
  streak?: number;
  showPlayAgain?: boolean;
  showLeaderboard?: boolean;
  showSignupPrompt?: boolean;
  showStats?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  totalRounds: 10,
  challengeDate: new Date().toISOString().split('T')[0],
  showPlayAgain: true,
  showLeaderboard: false,
  showSignupPrompt: false,
  showStats: false,
});

const emit = defineEmits<{
  playAgain: [];
  viewLeaderboard: [];
  backToMenu: [];
  signup: [];
}>();

const maxScore = computed(() => props.totalRounds * 900);
const maxComponentScore = computed(() => props.totalRounds * 800);
const maxSpeedScore = computed(() => props.totalRounds * 100);
const shareFeedback = ref('');
const resultCard = ref<HTMLElement | null>(null);

const formattedChallengeDate = computed(() => {
  const date = new Date(`${props.challengeDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('ca-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
});

const shareText = computed(() =>
  `He completat el Repte Diari del ${formattedChallengeDate.value} amb un ${scorePercentage.value}% de precisió geogràfica!`,
);

const shareUrl = computed(() => window.location.href);

const scorePercentage = computed(() => {
  return Math.round((props.totalScore / maxScore.value) * 100);
});

const handlePlayAgain = () => emit('playAgain');
const handleViewLeaderboard = () => emit('viewLeaderboard');
const handleBackToMenu = () => emit('backToMenu');
const handleSignup = () => emit('signup');

const shareResult = async () => {
  const sharedImage = await shareImage();
  if (sharedImage) {
    return;
  }

  await copyShareText();
};

const shareImage = async () => {
  if (!resultCard.value) return false;

  try {
    const canvas = await html2canvas(resultCard.value, {
      backgroundColor: '#080808',
      scale: 2,
      useCORS: true,
      onclone: (clonedDocument) => {
        const clonedCard = clonedDocument.querySelector('.results-card-wrapper');
        if (clonedCard instanceof HTMLElement) {
          clonedCard.style.backgroundColor = '#080808';
          clonedCard.style.opacity = '1';
          clonedCard.style.filter = 'none';
        }

        clonedDocument.querySelectorAll<HTMLElement>('*').forEach((element) => {
          element.style.animation = 'none';
          element.style.transition = 'none';
          element.style.opacity = '1';
          element.style.filter = 'none';
        });
      },
    });
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;

    const imageFile = new File([blob], 'repte-diari.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [imageFile] })) {
      await navigator.share({
        title: 'Repte Diari',
        text: shareText.value,
        files: [imageFile],
      });
      return true;
    }

    const downloadLink = document.createElement('a');
    downloadLink.download = 'repte-diari.png';
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
    shareFeedback.value = 'Imatge descarregada; ja la pots pujar a Stories';
    return true;
  } catch (error) {
    if ((error as DOMException).name !== 'AbortError') {
      shareFeedback.value = 'No s’ha pogut crear la imatge';
    }
    return false;
  }
};

const copyShareText = async () => {
  try {
    await navigator.clipboard.writeText(`${shareText.value} ${shareUrl.value}`);
    shareFeedback.value = 'Text copiat al porta-retalls';
  } catch {
    shareFeedback.value = 'No s’ha pogut copiar el text';
  }
};

const shareOn = async (network: 'linkedin' | 'instagram' | 'whatsapp' | 'facebook' | 'x') => {
  void network;
  await shareImage();
};
</script>

<style scoped>
.results-container {
  @apply flex flex-col items-center justify-center min-h-screen bg-noir-bg p-4 gap-4;
}

.results-card {
  @apply w-full max-w-3xl animate-fade-in;
}

.results-card-wrapper {
  @apply w-full max-w-3xl;
  background-color: #080808;
  opacity: 1;
}

.share-section,
.results-actions,
.signup-prompt {
  @apply w-full max-w-3xl;
}

.results-controls {
  @apply w-full max-w-3xl;
}

.results-header {
  @apply text-center pb-6 border-b border-noir-gold/20 mb-6;
}

.results-title {
  @apply text-3xl sm:text-4xl font-playfair text-noir-gold mb-4;
}

.final-score {
  @apply flex items-baseline justify-center gap-2 mb-2;
}

.score-value {
  @apply text-5xl sm:text-6xl font-mono font-bold text-noir-text;
}

.score-max {
  @apply text-xl sm:text-2xl font-mono text-noir-text/60;
}

.score-percentage {
  @apply text-lg sm:text-xl text-noir-gold/80 font-medium;
}

.breakdown-section {
  @apply mb-6;
}

.breakdown-title {
  @apply text-xl sm:text-2xl font-playfair text-noir-text mb-4;
}

.breakdown-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.breakdown-item {
  @apply flex items-start gap-2 p-3 bg-noir-bg rounded-lg border border-noir-gold/10;
}

.breakdown-icon {
  @apply text-2xl;
}

.breakdown-content {
  @apply flex-1;
}

.breakdown-label {
  @apply text-xs text-noir-text/80 mb-1;
}

.breakdown-score {
  @apply text-lg font-mono font-bold text-noir-text mb-2;
}

.breakdown-bar {
  @apply w-full h-1.5 bg-noir-surface rounded-full overflow-hidden;
}

.breakdown-bar-fill {
  @apply h-full bg-gradient-to-r from-noir-gold to-noir-gold/70 transition-all duration-700 ease-out;
}

.speed-fill {
  @apply bg-gradient-to-r from-noir-red to-noir-gold;
}

.stats-section {
  @apply flex flex-wrap justify-center gap-6 py-6 border-y border-noir-gold/10 mb-6;
}

.stat-item {
  @apply flex flex-col items-center gap-1;
}

.stat-label {
  @apply text-sm text-noir-text/60;
}

.stat-value {
  @apply text-2xl font-bold text-noir-gold;
}

.results-actions {
  @apply space-y-3;
}

.share-section {
  @apply mb-6 border-y border-noir-gold/10 py-5 text-center;
}

.share-title {
  @apply text-lg sm:text-xl font-playfair text-noir-gold mb-4;
}

.share-options {
  @apply flex flex-wrap justify-center gap-2;
}

.share-button {
  @apply inline-flex h-10 w-10 items-center justify-center rounded-lg border border-noir-gold/20 bg-noir-surface text-noir-text transition-colors;
}

.share-button:hover {
  @apply border-noir-gold/50 text-noir-gold;
}

.share-button svg {
  @apply h-5 w-5 fill-current text-noir-gold;
}

.share-button .share-icon-stroke {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.share-feedback {
  @apply mt-3 text-xs text-noir-text/60;
}

.signup-prompt {
  @apply mt-6 pt-6 border-t border-noir-gold/20 text-center space-y-4 bg-noir-surface/50 p-6 rounded-lg;
}

.signup-header {
  @apply flex items-center justify-center gap-3 mb-2;
}

.signup-icon {
  @apply text-2xl;
}

.signup-title {
  @apply text-xl font-playfair text-noir-gold;
}

.signup-text {
  @apply text-noir-text/90 text-sm leading-relaxed max-w-sm mx-auto;
}

.signup-disclaimer {
  @apply text-noir-text/50 text-xs mt-3;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>

