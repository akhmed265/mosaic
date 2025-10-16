<template>
  <div class="achievement-badge" :class="[
    `achievement--${achievement.type}`,
    { 'achievement--earned': achievement.earned }
  ]">
    <div class="achievement-icon">
      {{ achievement.icon }}
    </div>
    
    <div class="achievement-content">
      <h4 class="achievement-title">{{ achievement.title }}</h4>
      <p class="achievement-description">{{ achievement.description }}</p>
      
      <div v-if="!achievement.earned" class="achievement-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="progressStyle"></div>
        </div>
        <span class="progress-text">{{ achievement.progress }}%</span>
      </div>
    </div>
    
    <div v-if="achievement.earned" class="achievement-earned">
      ✅
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '@/types/learning-map'

const props = defineProps<{
  achievement: Achievement
}>()

const progressStyle = {
  width: `${props.achievement.progress}%`
}
</script>

<style lang="scss" scoped>
.achievement-badge {
  background: #1a1a1a;
  border: 2px solid;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;

  // Типы достижений
  &.achievement--streak {
    border-color: #ef4444;
  }
  
  &.achievement--mastery {
    border-color: #8b5cf6;
  }
  
  &.achievement--completion {
    border-color: #10b981;
  }
  
  &.achievement--speed {
    border-color: #f59e0b;
  }

  // Полученные достижения
  &.achievement--earned {
    background: linear-gradient(135deg, #1a1a1a, var(--achievement-color));
    
    &.achievement--streak { --achievement-color: #ef444420; }
    &.achievement--mastery { --achievement-color: #8b5cf620; }
    &.achievement--completion { --achievement-color: #10b98120; }
    &.achievement--speed { --achievement-color: #f59e0b20; }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
}

.achievement-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
  
  .achievement-title {
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .achievement-description {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: #2d2d2d;
    border-radius: 3px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #10b981);
      border-radius: 3px;
      transition: width 0.5s ease;
    }
  }
  
  .progress-text {
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 40px;
  }
}

.achievement-earned {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 1.2rem;
}
</style>