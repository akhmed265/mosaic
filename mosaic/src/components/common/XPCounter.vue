<template>
  <div class="xp-counter" :class="counterClasses">
    <!-- Основной дисплей -->
    <div class="xp-display" @click="triggerAnimation">
      <div class="xp-icon">⭐</div>
      <div class="xp-values">
        <div class="xp-current">{{ formattedCurrentXP }}</div>
        <div v-if="showLevel" class="xp-level">Уровень {{ currentLevel }}</div>
      </div>
    </div>

    <!-- Всплывающее уведомление -->
    <transition name="xp-popup">
      <div v-if="showPopup" class="xp-popup" :class="popupType">
        <span class="popup-icon">{{ popupIcon }}</span>
        <span class="popup-text">{{ popupMessage }}</span>
        <span class="popup-value">+{{ popupValue }} XP</span>
      </div>
    </transition>

    <!-- Прогресс уровня -->
    <div v-if="showProgress" class="xp-progress">
      <div class="level-info">
        <span class="level-text">До уровня {{ currentLevel + 1 }}</span>
        <span class="level-xp">{{ xpToNextLevel }} XP</span>
      </div>
      <ProgressBar
        :value="levelProgress"
        :max="100"
        :height="4"
        :show-info="false"
        :type="progressType"
        :animated="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ProgressBar from './ProgressBar.vue'

interface Props {
  xp?: number
  level?: number
  showLevel?: boolean
  showProgress?: boolean
  size?: 'small' | 'medium' | 'large'
  interactive?: boolean
}

interface Emits {
  (e: 'levelUp', data: { newLevel: number; oldLevel: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  xp: 0,
  level: 1,
  showLevel: true,
  showProgress: true,
  size: 'medium',
  interactive: true
})

const emit = defineEmits<Emits>()

// Реактивные состояния
const currentXP = ref(props.xp)
const currentLevel = ref(props.level)
const showPopup = ref(false)
const popupMessage = ref('')
const popupValue = ref(0)
const popupType = ref<'gain' | 'levelup'>('gain')

// Константы уровня
const XP_REQUIREMENTS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000]

// Computed свойства
const xpForCurrentLevel = computed(() => {
  return XP_REQUIREMENTS[Math.min(currentLevel.value - 1, XP_REQUIREMENTS.length - 1)]
})

const xpForNextLevel = computed(() => {
  return XP_REQUIREMENTS[Math.min(currentLevel.value, XP_REQUIREMENTS.length - 1)]
})

const xpToNextLevel = computed(() => {
  return xpForNextLevel.value - currentXP.value
})

const levelProgress = computed(() => {
  const levelRange = xpForNextLevel.value - xpForCurrentLevel.value
  if (levelRange === 0) return 100
  return Math.min(100, ((currentXP.value - xpForCurrentLevel.value) / levelRange) * 100)
})

const formattedCurrentXP = computed(() => {
  return currentXP.value.toLocaleString() + ' XP'
})

const progressType = computed(() => {
  if (levelProgress.value >= 90) return 'success'
  if (levelProgress.value >= 70) return 'warning'
  return 'default'
})

const counterClasses = computed(() => ({
  [`xp-counter--${props.size}`]: true,
  'xp-counter--interactive': props.interactive
}))

const popupIcon = computed(() => {
  return popupType.value === 'levelup' ? '🎉' : '⭐'
})

// Методы
const checkLevelUp = (newXP: number) => {
  const oldLevel = currentLevel.value
  
  // Находим новый уровень на основе XP
  let newLevel = 1
  for (let i = XP_REQUIREMENTS.length - 1; i >= 0; i--) {
    if (newXP >= XP_REQUIREMENTS[i]) {
      newLevel = i + 1
      break
    }
  }

  if (newLevel > oldLevel) {
    currentLevel.value = newLevel
    showLevelUpPopup(newLevel)
    emit('levelUp', { newLevel, oldLevel })
  }
}

const showLevelUpPopup = (level: number) => {
  popupType.value = 'levelup'
  popupMessage.value = `Новый уровень!`
  popupValue.value = level
  showPopup.value = true
  
  setTimeout(() => {
    showPopup.value = false
  }, 3000)
}

const showXPGainPopup = (xpGain: number) => {
  popupType.value = 'gain'
  popupMessage.value = 'Опыт получен!'
  popupValue.value = xpGain
  showPopup.value = true
  
  setTimeout(() => {
    showPopup.value = false
  }, 2000)
}

const triggerAnimation = () => {
  if (!props.interactive) return
  
  // Тестовая анимация получения XP
  const testXPGain = 25
  addXP(testXPGain)
}

const addXP = (amount: number) => {
  const oldXP = currentXP.value
  const newXP = oldXP + amount
  currentXP.value = newXP
  
  showXPGainPopup(amount)
  checkLevelUp(newXP)
}

// Наблюдатели
watch(
  () => props.xp,
  (newXP) => {
    const difference = newXP - currentXP.value
    if (difference > 0) {
      addXP(difference)
    } else {
      currentXP.value = newXP
    }
  }
)

watch(
  () => props.level,
  (newLevel) => {
    currentLevel.value = newLevel
  }
)

// Экспорт методов для внешнего использования
defineExpose({
  addXP,
  currentXP,
  currentLevel
})
</script>

<style lang="scss" scoped>
.xp-counter {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  
  &--interactive {
    cursor: pointer;
    
    .xp-display:hover {
      transform: translateY(-2px);
    }
  }
}

.xp-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #1a1a1a;
  border: 2px solid #2d2d2d;
  border-radius: 16px;
  transition: all 0.3s ease;
  min-width: 140px;
  
  .xp-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .xp-values {
    flex: 1;
    
    .xp-current {
      color: #f8fafc;
      font-size: 1.1rem;
      font-weight: 700;
      line-height: 1.2;
    }
    
    .xp-level {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }
  }
}

// Размеры
.xp-counter--small {
  .xp-display {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    min-width: 120px;
    
    .xp-icon {
      font-size: 1.25rem;
    }
    
    .xp-current {
      font-size: 0.9rem;
    }
    
    .xp-level {
      font-size: 0.7rem;
    }
  }
}

.xp-counter--large {
  .xp-display {
    padding: 1.25rem;
    gap: 1rem;
    min-width: 180px;
    
    .xp-icon {
      font-size: 2rem;
    }
    
    .xp-current {
      font-size: 1.3rem;
    }
    
    .xp-level {
      font-size: 0.9rem;
    }
  }
}

.xp-popup {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  z-index: 1000;
  white-space: nowrap;
  
  &.levelup {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }
  
  .popup-icon {
    font-size: 1.1rem;
  }
  
  .popup-text {
    font-size: 0.9rem;
  }
  
  .popup-value {
    font-size: 0.9rem;
    font-weight: 700;
    margin-left: 0.25rem;
  }
}

.xp-progress {
  width: 100%;
  
  .level-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .level-text {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
      padding-right: 10px;
    }
    
    .level-xp {
      color: #f8fafc;
      font-size: 0.8rem;
      font-weight: 700;
    }
  }
}

// Анимации
.xp-popup-enter-active {
  animation: xpPopupIn 0.3s ease-out;
}

.xp-popup-leave-active {
  animation: xpPopupOut 0.2s ease-in;
}

@keyframes xpPopupIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes xpPopupOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}

// Адаптивность
@media (max-width: 768px) {
  .xp-counter--large {
    .xp-display {
      padding: 1rem;
      min-width: 160px;
    }
  }
  
  .xp-popup {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    
    .popup-icon {
      font-size: 1rem;
    }
  }
}
</style>