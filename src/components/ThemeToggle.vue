<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'vibe-coding-runoob-theme'

const isDark = ref(false)

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  isDark.value = dark
}

function toggle() {
  applyTheme(!isDark.value)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(!isDark.value))
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    applyTheme(saved === 'true')
  } else {
    // 首次访问，跟随系统设置
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
  }
})
</script>

<template>
  <button
    @click="toggle"
    class="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
    :title="isDark ? '切换亮色模式' : '切换深色模式'"
  >
    <!-- 太阳图标（亮色模式） -->
    <svg
      v-if="!isDark"
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    <!-- 月亮图标（深色模式） -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>