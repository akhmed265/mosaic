<template>
  <div class="progress-container">
    <!-- Заголовок и значение -->
    <div v-if="showInfo" class="progress-info">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-value">{{ displayValue }}</span>
    </div>

    <!-- Полоса прогресса -->
    <div class="progress-bar" :class="barClasses">
      <div 
        class="progress-fill" 
        :style="fillStyle"
        :class="fillClasses"
      >
        <!-- Анимация полосы -->
        <div v-if="animated" class="progress-shine"></div>
      </div>
      
      <!-- Точки этапов -->
      <div 
        v-if="milestones.length > 0" 
        class="progress-milestones"
      >
        <div
          v-for="(milestone, index) in milestones"
          :key="index"
          class="milestone"
          :class="{
            'milestone--completed': currentValue >= milestone.value,
            'milestone--current': currentValue === milestone.value
          }"
          :style="{ left: `${(milestone.value / max) * 100}%` }"
        >
          <div class="milestone-dot"></div>
          <span class="milestone-label">{{ milestone.label }}</span>
        </div>
      </div>
    </div>

    <!-- Дополнительная информация -->
    <div v-if="showAdditionalInfo" class="progress-additional">
      <slot name="additional">
        <span class="progress-min">{{ min }}</span>
        <span class="progress-max">{{ max }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Milestone {
  value: number
  label: string
}

interface Props {
  // Основные параметры
  value?: number
  min?: number
  max?: number
  label?: string
  
  // Внешний вид
  color?: string
  height?: number
  borderRadius?: number
  animated?: boolean
  showAnimation?: boolean
  
  // Функциональность
  showInfo?: boolean
  showAdditionalInfo?: boolean
  formatValue?: (value: number) => string
  
  // Этапы
  milestones?: Milestone[]
  
  // Типы прогресса
  type?: 'default' | 'success' | 'warning' | 'error' | 'gradient'
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  min: 0,
  max: 100,
  label: 'Прогресс',
  color: '#8b5cf6',
  height: 8,
  borderRadius: 4,
  animated: true,
  showAnimation: true,
  showInfo: true,
  showAdditionalInfo: false,
  milestones: () => [],
  type: 'default'
})

// Локальное значение для анимации
const currentValue = ref(props.min)

// Computed свойства
const percentage = computed(() => {
  const range = props.max - props.min
  return range > 0 ? Math.min(100, Math.max(0, ((currentValue.value - props.min) / range) * 100)) : 0
})

const displayValue = computed(() => {
  if (props.formatValue) {
    return props.formatValue(currentValue.value)
  }
  return `${Math.round(percentage.value)}%`
})

const fillStyle = computed(() => {
  const styles: Record<string, string> = {
    width: `${percentage.value}%`,
    height: `${props.height}px`,
    'border-radius': `${props.borderRadius}px`
  }

  // Цвет в зависимости от типа
  const colors = {
    default: props.color,
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: `linear-gradient(90deg, ${props.color}, #7c3aed)`
  }

  if (props.type === 'gradient') {
    styles.background = colors.gradient
  } else {
    styles.background = colors[props.type]
  }

  return styles
})

const barClasses = computed(() => ({
  'progress-bar--animated': props.animated,
  'progress-bar--with-milestones': props.milestones.length > 0
}))

const fillClasses = computed(() => ({
  'progress-fill--animated': props.showAnimation && props.animated
}))

// Анимация прогресса
watch(
  () => props.value,
  (newValue) => {
    if (props.showAnimation) {
      // Плавная анимация к новому значению
      const duration = 800 // ms
      const startValue = currentValue.value
      const change = newValue - startValue
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        currentValue.value = startValue + change * easeOutQuart

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    } else {
      currentValue.value = newValue
    }
  },
  { immediate: true }
)

// Инициализация
onMounted(() => {
  if (!props.showAnimation) {
    currentValue.value = props.value
  }
})
</script>

<style lang="scss" scoped>
.progress-container {
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  .progress-label {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .progress-value {
    color: #f8fafc;
    font-size: 0.875rem;
    font-weight: 700;
  }
}

.progress-bar {
  position: relative;
  background: #2d2d2d;
  border-radius: 4px; /* ← ФИКС */
  overflow: hidden;
  
  &--animated {
    transition: all 0.3s ease;
  }
}

.progress-fill {
  position: relative;
  transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%; /* ← ДОБАВЬ ЭТУ СТРОКУ */
  border-radius: 4px; /* ← ДОБАВЬ ЭТУ СТРОКУ */
  
  &--animated {
    .progress-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shine 2s infinite;
    }
  }
}

.progress-milestones {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.milestone {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .milestone-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #64748b;
    border: 2px solid #2d2d2d;
    transition: all 0.3s ease;
    z-index: 2;
  }
  
  .milestone-label {
    position: absolute;
    top: -20px;
    color: #64748b;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &.milestone--completed {
    .milestone-dot {
      background: #10b981;
      border-color: #10b981;
      transform: scale(1.2);
    }
    
    .milestone-label {
      color: #10b981;
      opacity: 1;
    }
  }
  
  &.milestone--current {
    .milestone-dot {
      background: #8b5cf6;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
    }
    
    .milestone-label {
      color: #8b5cf6;
      opacity: 1;
      font-weight: 700;
    }
  }
  
  &:hover .milestone-label {
    opacity: 1;
    transform: translateY(-2px);
  }
}

.progress-additional {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  
  .progress-min,
  .progress-max {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .milestone .milestone-label {
    font-size: 0.65rem;
  }
}
</style>