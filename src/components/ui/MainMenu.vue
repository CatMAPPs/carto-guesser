<template>
  <div class="main-menu">
    <!-- Background radial glow -->
    <div class="menu-glow" aria-hidden="true"></div>

    <div class="menu-content">
      <!-- Title -->
      <div class="menu-header animate-fade-in">
        <h1 class="menu-logo" style ="user-select: none">RETORN AL TERRITORI</h1>
        <div class="menu-divider"></div>
        <p class="menu-tagline">Endevina on va ser feta la foto</p>
      </div>

      <!-- Daily challenge -->
      <nav class="menu-modes">
        <button class="mode-button group animate-slide-up stagger-2" @click="emit('modeSelect')">
          <div class="mode-icon">🏆</div>
          <div class="mode-body">
            <div class="mode-title">Repte Diari</div>
            <div class="mode-desc">3 fotografies cada dia </div>
          </div>
          <span class="mode-arrow" aria-hidden="true">→</span>
        </button>

        <button
          class="mode-button mode-button-disabled group animate-slide-up stagger-3"
          type="button"
          disabled
          aria-label="Joc Lliure, properament disponible"
        >
          <div class="mode-icon">🎯</div>
          <div class="mode-body">
            <div class="mode-title">Joc Lliure</div>
            <div class="mode-desc">Properament disponible</div>
          </div>
          <span class="mode-status">Properament</span>
        </button>
      </nav>

      <!-- Project logo -->
      <div class="menu-footer animate-fade-in stagger-4">
      <a href="https://github.com/orgs/CatMAPPs/repositories" target="_blank" rel="noopener noreferrer"> <img
          src="/logos/catmaps.jpg"
          alt="CatMapps"
          title="CatMapps"
          class="catmaps-logo"
          
        />
       </a> 
        <p class="developed-by">Desenvolupat per CatMAPPs</p>
        <button class="legal-link" type="button" @click="showLegalInfo = true">
          Informació i llicències
        </button>
      </div>
    </div>
  </div>

  <Modal v-model="showLegalInfo" title="Informació i llicències" size="sm">
    <div class="legal-content">
      <p>
        <strong>Retorn al Territori</strong> és un projecte amb finalitat educativa, cultural i divulgativa, sense ànim de lucre ni finalitat comercial.
      </p>
      <p>
        El codi propi es distribueix sota la llicència
        <a href="https://github.com/CatMAPPs/carto-guesser/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a>.
      </p>
      <p>
        Les fotografies i les seves metadades poden tenir drets i condicions d'ús diferents segons la font original. Consulta l'enllaç de procedència abans de reutilitzar-les.
      </p>
      <p>
        Per contactar amb l'equip, visita el nostre
        <a href="https://github.com/orgs/CatMAPPs/repositories" target="_blank" rel="noopener noreferrer">GitHub</a>
        o envia'ns un missatge directe a
        <a href="https://www.instagram.com/catmapps/" target="_blank" rel="noopener noreferrer">Instagram</a>.
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'

const showLegalInfo = ref(false)

const emit = defineEmits<{
  modeSelect: []
}>()
</script>

<style scoped>
/* ── Page ── */
.main-menu {
  @apply relative min-h-screen bg-noir-bg flex items-center justify-center p-6 overflow-hidden;
}

.menu-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 55% at 50% 38%, rgba(203,161,53,0.08) 0%, transparent 68%);
  pointer-events: none;
}

/* ── Content ── */
.menu-content {
  @apply relative z-10 w-full;
  max-width: 480px;
}

/* ── Header ── */
.menu-header {
  @apply text-center mb-14;
}

.menu-logo {
  @apply font-bebas text-noir-gold tracking-[0.1em];
  font-size: clamp(3.5rem, 13vw, 5.5rem);
  text-shadow: 0 0 48px rgba(203,161,53,0.22), 0 2px 0 rgba(0,0,0,0.5);
}

.menu-divider {
  @apply mx-auto my-5;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(203,161,53,0.55), transparent);
}

.menu-tagline {
  @apply text-sm text-noir-text/45 font-playfair italic tracking-wide;
}

/* ── Mode buttons ── */
.menu-modes {
  @apply flex flex-col gap-3;
}

.mode-button {
  @apply flex items-center gap-4 w-full text-left;
  @apply rounded-2xl border border-noir-gold/10 bg-noir-surface/50;
  @apply px-5 py-4;
  @apply transition-all duration-300;
  backdrop-filter: blur(4px);
}

.mode-button:hover {
  @apply border-noir-gold/35 bg-noir-surface -translate-y-0.5;
  box-shadow: 0 10px 40px rgba(0,0,0,0.55), 0 0 24px rgba(203,161,53,0.1);
}

.mode-button:active {
  @apply translate-y-0;
}

.mode-button-disabled {
  @apply cursor-not-allowed opacity-45;
}

.mode-button-disabled:hover {
  @apply border-noir-gold/10 bg-noir-surface/50 translate-y-0;
  box-shadow: none;
}

.mode-icon {
  @apply text-2xl w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0;
  background: rgba(203,161,53,0.07);
  border: 1px solid rgba(203,161,53,0.10);
}

.mode-body {
  @apply flex-1 min-w-0;
}

.mode-title {
  @apply text-base font-playfair text-noir-text mb-0.5;
}

.mode-desc {
  @apply text-xs text-noir-text/45 leading-relaxed;
}

.mode-arrow {
  @apply text-noir-gold/30 text-base flex-shrink-0 transition-all duration-300;
}

.mode-status {
  @apply text-[0.65rem] uppercase tracking-wider text-noir-gold/50 flex-shrink-0;
}

.group:hover .mode-arrow {
  @apply text-noir-gold/65 translate-x-1;
}

/* ── Footer (logo) ── */
.menu-footer {
  @apply flex flex-col items-center justify-center mt-12;
}

.catmaps-logo {
  height: 56px;
  opacity: 0.8;
  border-radius: 40px;
  filter: brightness(1.1);
  transition: opacity 0.3s;
}

.catmaps-logo:hover {
  opacity: 1;
}

.developed-by {
  @apply mt-3 text-xs text-noir-text/50;
}

.legal-link {
  @apply mt-4 block text-xs text-noir-text/40 underline-offset-4 transition-colors hover:text-noir-gold hover:underline;
}

.legal-content {
  @apply space-y-4 text-sm leading-relaxed text-noir-text/75;
}

.legal-content a {
  @apply text-noir-gold underline underline-offset-2;
}
</style>
