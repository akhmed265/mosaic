<template>
  <div class="progress-wave">
    <div class="wave-container">
      <div class="wave"></div>
    </div>
    <div class="stages">
      <div 
        v-for="stage in stages" 
        :key="stage.stage"
        class="stage"
        :class="{ active: stage.stage === currentStage }"
      >
        <div class="stage-number">{{ stage.stage }}</div>
        <div class="stage-info">
          <h4>{{ stage.title }}</h4>
          <p>{{ stage.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProgressStage } from '@/types/languages'

defineProps<{
  stages: ProgressStage[]
  currentStage: number
}>()
</script>

<style lang="scss" scoped>
.progress-wave {
  margin-top: 3rem;
  
  .wave-container {
    height: 100px;
    background: linear-gradient(90deg, $primary-color, $secondary-color);
    border-radius: 50% 50% 0 0;
    margin-bottom: 2rem;
  }
  
  .stages {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  
  .stage {
    text-align: center;
    padding: 1rem;
    border-radius: $border-radius;
    background: $bg-card;
    transition: all 0.3s ease;
    
    &.active {
      background: $primary-color;
    }
  }
}
</style>