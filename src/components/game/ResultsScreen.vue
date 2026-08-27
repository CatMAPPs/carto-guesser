<template>
  <div class="results-container">
    <div ref="resultCard" class="results-card-wrapper">
      <Card class="results-card">
      <!-- Header -->
      <div class="results-header">
        <div class="game-name">RETORN AL TERRITORI · {{ formattedChallengeDate }}</div>
        <h1 class="results-title">Repte aconseguit!</h1>
        <div class="final-score">
          <span class="score-value">{{ totalScore }}</span>
          <span class="score-max">/ {{ maxScore }}</span>
        </div>
        <div class="score-percentage">
          {{ scorePercentage }}% Precisió
        </div>
   
      </div>

      <!-- Component breakdown -->
      <div class="breakdown-section">
        <h3 class="breakdown-title" style="        place-self: anchor-center;;">Desglossament de la puntuació</h3>
        
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
          <p class="share-description">Es copiarà l’URL del joc. També pots guardar la imatge per compartir el teu resultat.</p>
          <button class="share-button" type="button" aria-label="Compartir resultat" title="Compartir resultat" @click="shareResult">
            <svg class="share-icon-stroke" aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>
            <span>Share</span>
          </button>
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

      <div class="contact-section">
        <p class="contact-disclaimer">Troba’ns a GitHub i Instagram. Per contactar-nos, envia’ns un missatge directe o escriu-nos a GitHub.</p>
        <div class="contact-links">
          <a
            class="contact-link"
            href="https://github.com/orgs/CatMAPPs/repositories"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Obrir GitHub de CatMAPPs"
            title="GitHub"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.63c-2.65.58-3.21-1.12-3.21-1.12-.43-1.1-1.06-1.39-1.06-1.39-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.47 2.25 1.05 2.8.8.09-.62.34-1.05.61-1.29-2.12-.24-4.35-1.06-4.35-4.72 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.53 0 0 .8-.26 2.62.98a9.1 9.1 0 0 1 4.77 0c1.82-1.24 2.62-.98 2.62-.98.52 1.32.19 2.29.09 2.53.61.67.98 1.52.98 2.56 0 3.67-2.23 4.48-4.36 4.72.35.3.65.88.65 1.78v2.64c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z"/></svg>
          </a>
          <a
            class="contact-link"
            href="https://www.instagram.com/catmapps/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Obrir Instagram de CatMAPPs"
            title="Instagram"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.75 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.7a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6Zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>
          </a>
        </div>
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

const shareUrl = computed(() => 'https://catmapps.github.io/retorn-al-territori');

const scorePercentage = computed(() => {
  return Math.round((props.totalScore / maxScore.value) * 100);
});

const handlePlayAgain = () => emit('playAgain');
const handleViewLeaderboard = () => emit('viewLeaderboard');
const handleBackToMenu = () => emit('backToMenu');
const handleSignup = () => emit('signup');

const shareResult = async () => {
  await copyShareText();
  const sharedImage = await shareImage();
  if (sharedImage) {
    return;
  }
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
        url: shareUrl.value,
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
    await navigator.clipboard.writeText(shareUrl.value);
    shareFeedback.value = 'URL copiada al porta-retalls';
  } catch {
    shareFeedback.value = 'No s’ha pogut copiar el text';
  }
};

</script>

<style scoped>
.results-container {
  @apply flex flex-col items-center justify-center min-h-screen bg-noir-bg p-4 gap-4;
}

.results-card {
  @apply w-full max-w-3xl animate-fade-in;
  background-image: linear-gradient(rgba(27, 25, 24, 0.9), rgba(27, 25, 24, 0.9)), url('/images/pl_espanya.jpg');
  background-position: center;
  background-size: cover;
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

.game-name {
  @apply mb-3 text-sm font-bebas tracking-[0.16em] text-noir-text/60;
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

.share-button {
  @apply inline-flex items-center justify-center gap-2 rounded-lg border border-noir-gold/20 bg-noir-surface px-4 py-2 text-sm text-noir-text transition-colors;
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

.share-description {
  @apply mx-auto mb-4 max-w-md text-xs leading-relaxed text-noir-text/60;
}

.contact-section {
  @apply mt-6 border-t border-noir-gold/10 pt-4 text-center;
}

.contact-disclaimer {
  @apply mx-auto max-w-md text-xs leading-relaxed text-noir-text/50;
}

.contact-links {
  @apply mt-3 flex justify-center gap-3;
}

.contact-link {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-lg border border-noir-gold/20 text-noir-gold transition-colors;
}

.contact-link:hover {
  @apply border-noir-gold/50 bg-noir-surface;
}

.contact-link svg {
  @apply h-5 w-5 fill-current;
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

