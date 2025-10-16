<template>
  <div class="language-puzzles">
    <div class="puzzle-grid">
      <div 
        v-for="language in languages" 
        :key="language.id"
        class="puzzle-item"
        :style="{ borderColor: language.color }"
        @click="$emit('languageSelect', language)"
      >
        <span class="puzzle-flag">{{ language.flag }}</span>
        <span class="puzzle-name">{{ language.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '@/types/languages'

defineProps<{
  languages: Language[]
  selectedLanguage: Language
}>()

defineEmits<{
  languageSelect: [language: Language]
}>()
</script>

<style lang="scss" scoped>
.language-puzzles {
  .puzzle-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .puzzle-item {
    background: $bg-card;
    border: 2px solid;
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
  }
  
  .puzzle-flag {
    font-size: 2rem;
  }
  
  .puzzle-name {
    color: $text-light;
    font-weight: 600;
  }
}
</style>