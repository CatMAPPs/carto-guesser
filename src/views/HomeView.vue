<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MainMenu } from '@/components/ui'

const router = useRouter()

const handleModeSelect = () => router.push({ name: 'daily-challenge' })
</script>

<template>
  <MainMenu @mode-select="handleModeSelect" />
</template>
