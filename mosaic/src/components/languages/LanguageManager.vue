<template>
  <div class="language-manager">
    <!-- Заголовок -->
    <div class="section-header">
      <h2>Мои языки</h2>
      <button class="add-language-btn" @click="showLanguageSelector = true">
        <span>+ Добавить язык</span>
      </button>
    </div>

    <!-- Список изучаемых языков -->
    <div class="languages-list">
      <div 
        v-for="language in learningLanguages" 
        :key="language.code"
        class="language-card"
        :class="{ active: currentLanguage === language.code }"
      >
        <div class="language-header">
          <div class="language-info">
            <span class="language-flag">{{ language.flag }}</span>
            <div class="language-details">
              <h3 class="language-name">{{ language.name }}</h3>
              <div class="language-meta">
                <span class="language-level">Уровень {{ language.level }}</span>
                <span class="language-progress">{{ language.progress }}%</span>
              </div>
            </div>
          </div>
          
          <div class="language-actions">
            <button 
              class="action-btn primary"
              @click="setAsCurrent(language.code)"
              :disabled="currentLanguage === language.code"
            >
              {{ currentLanguage === language.code ? 'Текущий' : 'Сделать текущим' }}
            </button>
            <button 
              class="action-btn secondary"
              @click="removeLanguage(language.code)"
            >
              Удалить
            </button>
          </div>
        </div>

        <!-- Прогресс языка -->
        <div class="language-progress-bar">
          <ProgressBar
            :value="language.progress"
            :color="language.color"
            :height="8"
            :animated="true"
          />
        </div>

        <!-- Детальная статистика -->
        <div class="language-stats">
          <div class="stat-item">
            <div class="stat-value">{{ language.lessonsCompleted || 0 }}</div>
            <div class="stat-label">Уроков</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ language.wordsLearned || 0 }}</div>
            <div class="stat-label">Слов</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ language.studyTime || 0 }}ч</div>
            <div class="stat-label">Время</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ language.streak || 0 }}</div>
            <div class="stat-label">Дней</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Селектор языков (модалка) -->
    <LanguageSelector 
      v-if="showLanguageSelector"
      :existing-languages="learningLanguages.map(l => l.code)"
      @add-language="handleAddLanguage"
      @close="showLanguageSelector = false"
    />

    <!-- Сообщение если нет языков -->
    <div v-if="learningLanguages.length === 0" class="empty-state">
      <div class="empty-icon">🌍</div>
      <h3>Нет изучаемых языков</h3>
      <p>Добавьте языки, которые хотите изучать</p>
      <button class="add-first-btn" @click="showLanguageSelector = true">
        Добавить первый язык
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import LanguageSelector from './LanguageSelector.vue'

// Props и emits
interface Props {
  userLanguages?: any[]
}

interface Emits {
  (e: 'languageChange', data: { action: string; language: any }): void
}

const props = withDefaults(defineProps<Props>(), {
  userLanguages: () => []
})

const emit = defineEmits<Emits>()

// Состояния
const showLanguageSelector = ref(false)
const currentLanguage = ref('en')

// Данные языков (в реальном приложении из хранилища)
const languagesData = ref([
  {
    code: 'en',
    name: 'Английский',
    flag: '🇬🇧',
    level: 5,
    progress: 65,
    color: '#8b5cf6',
    isLearning: true,
    lessonsCompleted: 42,
    wordsLearned: 1250,
    studyTime: 45,
    streak: 7
  },
  {
    code: 'es',
    name: 'Испанский',
    flag: '🇪🇸',
    level: 2,
    progress: 30,
    color: '#10b981',
    isLearning: true,
    lessonsCompleted: 15,
    wordsLearned: 450,
    studyTime: 12,
    streak: 3
  }
])

// Computed
const learningLanguages = computed(() => {
  return languagesData.value.filter(lang => lang.isLearning)
})

// Методы
const setAsCurrent = (languageCode: string) => {
  currentLanguage.value = languageCode
  emit('languageChange', { 
    action: 'setCurrent', 
    language: languagesData.value.find(l => l.code === languageCode) 
  })
}

const removeLanguage = (languageCode: string) => {
  const language = languagesData.value.find(l => l.code === languageCode)
  if (language) {
    language.isLearning = false
    emit('languageChange', { 
      action: 'remove', 
      language 
    })
  }
}

const handleAddLanguage = (languageCode: string) => {
  const language = getAllLanguages().find(l => l.code === languageCode)
  if (language) {
    languagesData.value.push({
      ...language,
      isLearning: true,
      level: 0,
      progress: 0,
      lessonsCompleted: 0,
      wordsLearned: 0,
      studyTime: 0,
      streak: 0
    })
    emit('languageChange', { 
      action: 'add', 
      language 
    })
    showLanguageSelector.value = false
  }
}

const getAllLanguages = () => {
  return [
    { code: 'en', name: 'Английский', flag: '🇬🇧', color: '#8b5cf6' },
    { code: 'es', name: 'Испанский', flag: '🇪🇸', color: '#10b981' },
    { code: 'fr', name: 'Французский', flag: '🇫🇷', color: '#f59e0b' },
    { code: 'de', name: 'Немецкий', flag: '🇩🇪', color: '#ef4444' },
    { code: 'it', name: 'Итальянский', flag: '🇮🇹', color: '#06b6d4' },
    { code: 'pt', name: 'Португальский', flag: '🇵🇹', color: '#8b5cf6' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', color: '#10b981' },
    { code: 'ja', name: 'Японский', flag: '🇯🇵', color: '#f59e0b' },
    { code: 'ko', name: 'Корейский', flag: '🇰🇷', color: '#ef4444' },
    { code: 'zh', name: 'Китайский', flag: '🇨🇳', color: '#06b6d4' },
    { code: 'ar', name: 'Арабский', flag: '🇸🇦', color: '#8b5cf6' },
    { code: 'hi', name: 'Хинди', flag: '🇮🇳', color: '#10b981' }
  ]
}
</script>

<style lang="scss" scoped>
.language-manager {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .add-language-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }
  }
}

.languages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.language-card {
  background: #2d2d2d;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3d3d3d;
  }
  
  &.active {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #2d2d2d, #8b5cf620);
  }
}

.language-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.language-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  
  .language-flag {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .language-details {
    flex: 1;
    
    .language-name {
      color: #f8fafc;
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .language-meta {
      display: flex;
      gap: 1rem;
      
      .language-level {
        color: #94a3b8;
        font-weight: 600;
      }
      
      .language-progress {
        color: #8b5cf6;
        font-weight: 700;
      }
    }
  }
}

.language-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
  
  .action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    
    &.primary {
      background: #8b5cf6;
      color: white;
      
      &:hover:not(:disabled) {
        background: #7c3aed;
      }
      
      &:disabled {
        background: #64748b;
        cursor: not-allowed;
      }
    }
    
    &.secondary {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      
      &:hover {
        background: #ef4444;
        color: white;
      }
    }
  }
}

.language-progress-bar {
  margin-bottom: 1rem;
}

.language-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #3d3d3d;
}

.stat-item {
  text-align: center;
  
  .stat-value {
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }
  
  h3 {
    color: #f8fafc;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 2rem;
  }
  
  .add-first-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #7c3aed;
      transform: translateY(-2px);
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .language-header {
    flex-direction: column;
  }
  
  .language-actions {
    width: 100%;
    justify-content: stretch;
    
    .action-btn {
      flex: 1;
    }
  }
  
  .language-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>