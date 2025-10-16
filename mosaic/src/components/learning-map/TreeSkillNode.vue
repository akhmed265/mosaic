<template>
  <div 
    class="tree-skill-node"
    :class="`skill--${skill.status}`"
    @click="handleClick"
  >
    <div class="skill-icon">
      {{ categoryIcon }}
    </div>
    
    <div class="skill-content">
      <h4 class="skill-title">{{ skill.title }}</h4>
      <p class="skill-description">{{ skill.description }}</p>
      
      <div class="skill-meta">
        <span>⏱️ {{ skill.estimatedTime }}</span>
        <span>📝 {{ skill.exercises }} упр.</span>
      </div>
      
      <div v-if="skill.status !== 'locked'" class="skill-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="progressStyle"></div>
        </div>
        <span>{{ skill.progress }}%</span>
      </div>
    </div>
    
    <div class="skill-reward">
      +{{ skill.rewards.xp }} XP
    </div>
    
    <div v-if="skill.status === 'locked'" class="skill-locked">
      🔒
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TreeSkill } from '@/types/learning-tree'

const props = defineProps<{
  skill: TreeSkill
  language: string
}>()

const emit = defineEmits<{
  select: [skill: TreeSkill]
}>()

const categoryIcon = {
  vocabulary: '📝',
  grammar: '📚', 
  listening: '🎧',
  speaking: '💬',
  writing: '✍️',
  reading: '📖'
}[props.skill.category]

const progressStyle = computed(() => ({
  width: `${props.skill.progress}%`
}))

const handleClick = () => {
  if (props.skill.status !== 'locked') {
    emit('select', props.skill)
  }
}
</script>

<style lang="scss" scoped>
.tree-skill-node {
  background: #1a1a1a;
  border: 2px solid;
  border-radius: 12px;
  padding: 1rem;
  width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &.skill--completed {
    border-color: #10b981;
    background: linear-gradient(135deg, #1a1a1a, #10b98120);
  }
  
  &.skill--unlocked {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #1a1a1a, #8b5cf620);
  }
  
  &.skill--locked {
    border-color: #64748b;
    background: #2d2d2d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(.skill--locked) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
}

.skill-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.skill-content {
  .skill-title {
    color: #f8fafc;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    text-align: center;
  }
  
  .skill-description {
    color: #94a3b8;
    font-size: 0.8rem;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    text-align: center;
  }
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  span {
    color: #64748b;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.skill-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .progress-bar {
    flex: 1;
    height: 4px;
    background: #2d2d2d;
    border-radius: 2px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #10b981);
      border-radius: 2px;
    }
  }
  
  span {
    color: #94a3b8;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 30px;
  }
}

.skill-reward {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #f59e0b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
}

.skill-locked {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 1rem;
}
</style>