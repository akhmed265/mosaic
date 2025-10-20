<template>
  <div class="language-selector-overlay" @click.self="$emit('close')">
    <div class="language-selector-modal">
      <!-- Заголовок модалки -->
      <div class="modal-header">
        <h2>Добавить язык</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Поиск -->
      <div class="search-section">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск языков..." 
          >
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Список доступных языков -->
      <div class="languages-grid">
        <div 
          v-for="language in filteredLanguages" 
          :key="language.code"
          class="language-option"
          :class="{ 
            disabled: existingLanguages.includes(language.code),
            selected: selectedLanguage === language.code
          }"
          @click="selectLanguage(language)"
        >
          <div class="language-flag">{{ language.flag }}</div>
          <div class="language-name">{{ language.name }}</div>
          <div class="language-native">{{ language.nativeName }}</div>
          
          <div v-if="existingLanguages.includes(language.code)" class="already-added">
            ✓ Уже добавлен
          </div>
          
          <div v-else class="select-hint">
            Выбрать
          </div>
        </div>
      </div>

      <!-- Выбранный язык -->
      <div v-if="selectedLanguage" class="selected-language">
        <div class="selected-info">
          <span class="selected-flag">{{ getSelectedLanguage()?.flag }}</span>
          <div class="selected-details">
            <h3>{{ getSelectedLanguage()?.name }}</h3>
            <p>{{ getSelectedLanguage()?.nativeName }}</p>
          </div>
        </div>
        <button class="confirm-btn" @click="confirmSelection">
          Добавить язык
        </button>
      </div>

      <!-- Пустое состояние -->
      <div v-if="filteredLanguages.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Языки не найдены</h3>
        <p>Попробуйте изменить поисковый запрос</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  existingLanguages: string[]
}

interface Emits {
  (e: 'add-language', languageCode: string): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Состояния
const searchQuery = ref('')
const selectedLanguage = ref('')

// Все доступные языки
const allLanguages = [
  { code: 'en', name: 'Английский', nativeName: 'English', flag: '🇬🇧', difficulty: 'medium' },
  { code: 'es', name: 'Испанский', nativeName: 'Español', flag: '🇪🇸', difficulty: 'easy' },
  { code: 'fr', name: 'Французский', nativeName: 'Français', flag: '🇫🇷', difficulty: 'medium' },
  { code: 'de', name: 'Немецкий', nativeName: 'Deutsch', flag: '🇩🇪', difficulty: 'hard' },
  { code: 'it', name: 'Итальянский', nativeName: 'Italiano', flag: '🇮🇹', difficulty: 'easy' },
  { code: 'pt', name: 'Португальский', nativeName: 'Português', flag: '🇵🇹', difficulty: 'medium' },
  { code: 'ru', name: 'Русский', nativeName: 'Русский', flag: '🇷🇺', difficulty: 'hard' },
  { code: 'ja', name: 'Японский', nativeName: '日本語', flag: '🇯🇵', difficulty: 'very hard' },
  { code: 'ko', name: 'Корейский', nativeName: '한국어', flag: '🇰🇷', difficulty: 'very hard' },
  { code: 'zh', name: 'Китайский', nativeName: '中文', flag: '🇨🇳', difficulty: 'very hard' },
  { code: 'ar', name: 'Арабский', nativeName: 'العربية', flag: '🇸🇦', difficulty: 'hard' },
  { code: 'hi', name: 'Хинди', nativeName: 'हिन्दी', flag: '🇮🇳', difficulty: 'medium' },
  { code: 'tr', name: 'Турецкий', nativeName: 'Türkçe', flag: '🇹🇷', difficulty: 'medium' },
  { code: 'nl', name: 'Нидерландский', nativeName: 'Nederlands', flag: '🇳🇱', difficulty: 'easy' },
  { code: 'sv', name: 'Шведский', nativeName: 'Svenska', flag: '🇸🇪', difficulty: 'easy' },
  { code: 'pl', name: 'Польский', nativeName: 'Polski', flag: '🇵🇱', difficulty: 'hard' },
  { code: 'vi', name: 'Вьетнамский', nativeName: 'Tiếng Việt', flag: '🇻🇳', difficulty: 'hard' },
  { code: 'th', name: 'Тайский', nativeName: 'ไทย', flag: '🇹🇭', difficulty: 'very hard' }
]

// Computed
const filteredLanguages = computed(() => {
  if (!searchQuery.value) {
    return allLanguages
  }
  
  const query = searchQuery.value.toLowerCase()
  return allLanguages.filter(language => 
    language.name.toLowerCase().includes(query) ||
    language.nativeName.toLowerCase().includes(query) ||
    language.code.toLowerCase().includes(query)
  )
})

// Методы
const selectLanguage = (language: any) => {
  if (!props.existingLanguages.includes(language.code)) {
    selectedLanguage.value = language.code
  }
}

const getSelectedLanguage = () => {
  return allLanguages.find(lang => lang.code === selectedLanguage.value)
}

const confirmSelection = () => {
  if (selectedLanguage.value) {
    emit('add-language', selectedLanguage.value)
    selectedLanguage.value = ''
    searchQuery.value = ''
  }
}

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    'easy': '#10b981',
    'medium': '#f59e0b',
    'hard': '#ef4444',
    'very hard': '#dc2626'
  }
  return colors[difficulty as keyof typeof colors] || '#64748b'
}
</script>

<style lang="scss" scoped>
.language-selector-overlay {
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

.language-selector-modal {
  background: #1a1a1a;
  border-radius: 20px;
  border: 1px solid #2d2d2d;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #2d2d2d;
  
  h2 {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
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
}

.search-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #2d2d2d;
}

.search-box {
  position: relative;
  
  input {
    width: 100%;
    background: #2d2d2d;
    border: 1px solid #3d3d3d;
    border-radius: 12px;
    padding: 1rem 1rem 1rem 3rem;
    color: #f8fafc;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }
    
    &::placeholder {
      color: #64748b;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 1.1rem;
  }
}

.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.language-option {
  background: #2d2d2d;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover:not(.disabled) {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }
  
  &.selected {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #2d2d2d, #8b5cf620);
  }
  
  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .language-flag {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }
  
  .language-name {
    color: #f8fafc;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .language-native {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
}

.already-added {
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: #10b98120;
  border-radius: 12px;
  display: inline-block;
}

.select-hint {
  color: #8b5cf6;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.language-option:not(.disabled):hover .select-hint {
  opacity: 1;
}

.selected-language {
  background: #2d2d2d;
  border-top: 1px solid #2d2d2d;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .selected-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .selected-flag {
      font-size: 2rem;
    }
    
    .selected-details {
      h3 {
        color: #f8fafc;
        margin: 0 0 0.25rem 0;
        font-weight: 700;
      }
      
      p {
        color: #94a3b8;
        margin: 0;
        font-size: 0.9rem;
      }
    }
  }
  
  .confirm-btn {
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

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  
  .no-results-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    color: #f8fafc;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #94a3b8;
    margin: 0;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .languages-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 1rem;
  }
  
  .selected-language {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>