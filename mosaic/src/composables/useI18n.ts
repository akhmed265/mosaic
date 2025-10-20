import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useAppI18n() {
  const { locale, t } = useI18n()
  
  const availableLocales = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const currentLocale = computed({
    get: () => locale.value,
    set: (value) => {
      locale.value = value
      localStorage.setItem('preferred-language', value)
    }
  })

  // Восстанавливаем язык из localStorage при загрузке
  const savedLocale = localStorage.getItem('preferred-language')
  if (savedLocale && availableLocales.some(l => l.code === savedLocale)) {
    currentLocale.value = savedLocale
  }

  const switchLocale = (newLocale: string) => {
    currentLocale.value = newLocale
  }

  return {
    currentLocale,
    availableLocales,
    switchLocale,
    t
  }
}