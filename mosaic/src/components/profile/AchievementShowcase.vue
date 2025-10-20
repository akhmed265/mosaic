<template>
  <div class="achievement-showcase">
    <div class="section-header">
      <h2 class="section-title">🏆 Достижения</h2>
      <div class="achievement-count">
        {{ unlockedAchievements }}/{{ totalAchievements }}
      </div>
    </div>

    <div class="achievements-grid">
      <div 
        v-for="achievement in displayedAchievements" 
        :key="achievement.id"
        class="achievement-card"
        :class="{
          'achievement--unlocked': achievement.unlocked,
          'achievement--locked': !achievement.unlocked,
          'achievement--rare': achievement.rarity === 'rare',
          'achievement--epic': achievement.rarity === 'epic'
        }"
        @click="showAchievementDetails(achievement)"
      >
        <div class="achievement-icon">
          <div class="icon-wrapper" :style="getIconStyle(achievement)">
            {{ achievement.icon }}
          </div>
          <div v-if="achievement.unlocked" class="unlocked-badge">✓</div>
        </div>

        <div class="achievement-info">
          <h3 class="achievement-title">{{ achievement.title }}</h3>
          <p class="achievement-description">{{ achievement.description }}</p>
          
          <div v-if="achievement.unlocked" class="achievement-unlocked">
            <span class="unlocked-date">Получено {{ formatDate(achievement.unlockedAt) }}</span>
            <span class="achievement-xp">+{{ achievement.xp }} XP</span>
          </div>
          
          <div v-else class="achievement-progress">
            <div class="progress-text">
              {{ achievement.progress.current }}/{{ achievement.progress.total }}
            </div>
            <ProgressBar
              :value="(achievement.progress.current / achievement.progress.total) * 100"
              :height="4"
              :show-info="false"
              :animated="false"
            />
          </div>
        </div>

        <!-- Редкость достижения -->
        <div v-if="achievement.rarity !== 'common'" class="rarity-badge">
          {{ getRarityText(achievement.rarity) }}
        </div>
      </div>
    </div>

    <button 
      v-if="hasMoreAchievements" 
      class="show-more-btn"
      @click="showAllAchievements = !showAllAchievements"
    >
      {{ showAllAchievements ? 'Скрыть' : `Показать все (${totalAchievements})` }}
    </button>

    <!-- Детали достижения (модалка) -->
    <div v-if="selectedAchievement" class="achievement-modal-overlay" @click.self="closeModal">
      <div class="achievement-modal">
        <div class="modal-header">
          <div class="achievement-icon-large">
            <div class="icon-wrapper" :style="getIconStyle(selectedAchievement)">
              {{ selectedAchievement.icon }}
            </div>
          </div>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <div class="modal-content">
          <h2 class="achievement-title-large">{{ selectedAchievement.title }}</h2>
          <p class="achievement-description-large">{{ selectedAchievement.description }}</p>
          
          <div class="achievement-details">
            <div class="detail-item">
              <span class="detail-label">Редкость:</span>
              <span class="detail-value" :class="`rarity--${selectedAchievement.rarity}`">
                {{ getRarityText(selectedAchievement.rarity) }}
              </span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Награда:</span>
              <span class="detail-value xp-reward">+{{ selectedAchievement.xp }} XP</span>
            </div>
            
            <div v-if="selectedAchievement.unlocked" class="detail-item">
              <span class="detail-label">Получено:</span>
              <span class="detail-value">{{ formatDate(selectedAchievement.unlockedAt) }}</span>
            </div>
          </div>

          <div v-if="!selectedAchievement.unlocked" class="progress-section">
            <h4>Прогресс</h4>
            <div class="progress-stats">
              <span>{{ selectedAchievement.progress.current }}/{{ selectedAchievement.progress.total }}</span>
              <span>{{ Math.round((selectedAchievement.progress.current / selectedAchievement.progress.total) * 100) }}%</span>
            </div>
            <ProgressBar
              :value="(selectedAchievement.progress.current / selectedAchievement.progress.total) * 100"
              :height="8"
              :animated="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'

// Данные достижений (заглушка)
const achievementsData = [
  {
    id: 1,
    title: 'Первый шаг',
    description: 'Завершите первый урок',
    icon: '🎯',
    xp: 50,
    rarity: 'common',
    unlocked: true,
    unlockedAt: '2024-10-15',
    progress: { current: 1, total: 1 }
  },
  {
    id: 2,
    title: 'Неделя усердия',
    description: 'Занимайтесь 7 дней подряд',
    icon: '🔥',
    xp: 100,
    rarity: 'common',
    unlocked: true,
    unlockedAt: '2024-10-20',
    progress: { current: 7, total: 7 }
  },
  {
    id: 3,
    title: 'Грамматический гений',
    description: 'Завершите все уроки по грамматике',
    icon: '📚',
    xp: 200,
    rarity: 'rare',
    unlocked: false,
    progress: { current: 9, total: 20 }
  },
  {
    id: 4,
    title: 'Словарный запас',
    description: 'Выучите 500 новых слов',
    icon: '💎',
    xp: 300,
    rarity: 'epic',
    unlocked: false,
    progress: { current: 250, total: 500 }
  },
  {
    id: 5,
    title: 'Скоростное обучение',
    description: 'Завершите 5 уроков за один день',
    icon: '⚡',
    xp: 150,
    rarity: 'rare',
    unlocked: true,
    unlockedAt: '2024-10-18',
    progress: { current: 5, total: 5 }
  },
  {
    id: 6,
    title: 'Перфекционист',
    description: 'Получите 100% точность в 10 уроках подряд',
    icon: '⭐',
    xp: 250,
    rarity: 'epic',
    unlocked: false,
    progress: { current: 3, total: 10 }
  }
]

// Реактивные состояния
const showAllAchievements = ref(false)
const selectedAchievement = ref<any>(null)

// Computed свойства
const unlockedAchievements = computed(() => 
  achievementsData.filter(a => a.unlocked).length
)

const totalAchievements = computed(() => achievementsData.length)

const displayedAchievements = computed(() => {
  if (showAllAchievements.value) {
    return achievementsData
  }
  return achievementsData.slice(0, 4) // Показываем первые 4
})

const hasMoreAchievements = computed(() => achievementsData.length > 4)

// Методы
const getIconStyle = (achievement: any) => {
  const styles: any = {}
  
  if (achievement.unlocked) {
    const colors: Record<string, string> = {
      common: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      rare: 'linear-gradient(135deg, #10b981, #059669)',
      epic: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
    styles.background = colors[achievement.rarity] || colors.common
  } else {
    styles.background = '#2d2d2d'
    styles.filter = 'grayscale(1)'
  }
  
  return styles
}

const getRarityText = (rarity: string) => {
  const texts: Record<string, string> = {
    common: 'Обычное',
    rare: 'Редкое',
    epic: 'Эпическое'
  }
  return texts[rarity] || 'Обычное'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const showAchievementDetails = (achievement: any) => {
  selectedAchievement.value = achievement
}

const closeModal = () => {
  selectedAchievement.value = null
}
</script>

<style lang="scss" scoped>
.achievement-showcase {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.achievement-count {
  background: #8b5cf6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.achievement-card {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }

  &.achievement--unlocked {
    border-left: 4px solid #8b5cf6;
  }

  &.achievement--locked {
    opacity: 0.7;
  }

  &.achievement--rare {
    .rarity-badge {
      background: #10b981;
    }
  }

  &.achievement--epic {
    .rarity-badge {
      background: #f59e0b;
    }
  }
}

.achievement-icon {
  position: relative;
  margin-bottom: 1rem;

  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }

  .unlocked-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #10b981;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    border: 2px solid #2d2d2d;
  }
}

.achievement-info {
  .achievement-title {
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .achievement-description {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
}

.achievement-unlocked {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .unlocked-date {
    color: #94a3b8;
    font-size: 0.8rem;
  }

  .achievement-xp {
    color: #f59e0b;
    font-size: 0.9rem;
    font-weight: 700;
  }
}

.achievement-progress {
  .progress-text {
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
}

.rarity-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #8b5cf6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.show-more-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #64748b;
  color: #94a3b8;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
  }
}

/* Модальное окно */
.achievement-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.achievement-modal {
  background: #1a1a1a;
  border-radius: 20px;
  border: 1px solid #2d2d2d;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #2d2d2d;
}

.achievement-icon-large {
  .icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;

  &:hover {
    background: #2d2d2d;
    color: #f8fafc;
  }
}

.modal-content {
  padding: 2rem;

  .achievement-title-large {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .achievement-description-large {
    color: #94a3b8;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
}

.achievement-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .detail-label {
    color: #94a3b8;
    font-weight: 600;
  }

  .detail-value {
    color: #f8fafc;
    font-weight: 700;

    &.rarity--rare {
      color: #10b981;
    }

    &.rarity--epic {
      color: #f59e0b;
    }

    &.xp-reward {
      color: #f59e0b;
    }
  }
}

.progress-section {
  h4 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .progress-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    span {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .achievement-unlocked {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>