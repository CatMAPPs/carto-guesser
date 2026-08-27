<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MainMenu } from '@/components/ui'

const router = useRouter()

const handleModeSelect = () => router.push({ name: 'daily-challenge' })
const handleFreePlaySelect = () => router.push({ name: 'free-play' })
</script>

<template>
  <MainMenu @mode-select="handleModeSelect" @free-play-select="handleFreePlaySelect" />
</template>
