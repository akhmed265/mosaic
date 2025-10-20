import { ref, computed } from 'vue'

// Состояние языков
const userLanguages = ref([
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
    studyTime: 25,
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

const currentLanguage = ref('en')

export function useLanguages() {
  const learningLanguages = computed(() => 
    userLanguages.value.filter(lang => lang.isLearning)
  )

  const addLanguage = (languageCode: string) => {
    const allLanguages = getAllLanguages()
    const language = allLanguages.find(l => l.code === languageCode)
    
    if (language && !userLanguages.value.some(l => l.code === languageCode)) {
      userLanguages.value.push({
        ...language,
        isLearning: true,
        level: 0,
        progress: 0,
        lessonsCompleted: 0,
        wordsLearned: 0,
        studyTime: 0,
        streak: 0
      })
    }
  }

  const removeLanguage = (languageCode: string) => {
    const language = userLanguages.value.find(l => l.code === languageCode)
    if (language) {
      language.isLearning = false
    }
  }

  const setCurrentLanguage = (languageCode: string) => {
    currentLanguage.value = languageCode
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

  return {
    userLanguages,
    currentLanguage,
    learningLanguages,
    addLanguage,
    removeLanguage,
    setCurrentLanguage,
    getAllLanguages
  }
}