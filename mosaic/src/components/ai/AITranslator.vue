<template>
  <div class="ai-overlay" v-if="isOpen" @click.self="close">
    <div class="ai-container translator-container">
      <!-- Заголовок -->
      <div class="ai-header">
        <div class="header-content">
          <div class="title-section">
            <h3>🔤 AI Переводчик</h3>
            <p>Умный перевод с контекстом и альтернативными вариантами</p>
          </div>
          <button class="close-btn" @click="close">×</button>
        </div>

        <!-- Языковые настройки -->
        <div class="language-settings">
          <div class="lang-selector">
            <div class="lang-from">
              <label>Исходный язык:</label>
              <div class="custom-select">
                <select v-model="sourceLang" @change="detectLanguage">
                  <option value="auto">Автоопределение</option>
                  <option value="ru">Русский</option>
                  <option value="en">Английский</option>
                  <option value="es">Испанский</option>
                  <option value="fr">Французский</option>
                  <option value="de">Немецкий</option>
                  <option value="it">Итальянский</option>
                  <option value="zh">Китайский</option>
                  <option value="ja">Японский</option>
                  <option value="ko">Корейский</option>
                </select>
                <div
                  class="select-display"
                  :class="{ active: isSourceSelectOpen }"
                  @click="toggleSourceSelect"
                >
                  <span>{{
                    getLanguageName(sourceLang === "auto" ? "auto" : sourceLang)
                  }}</span>
                  <span class="select-arrow">▼</span>
                </div>
                <div class="select-options" v-if="isSourceSelectOpen">
                  <div
                    v-for="option in sourceLangOptions"
                    :key="option.value"
                    :class="[
                      'select-option',
                      {
                        selected: sourceLang === option.value,
                        'auto-detect': option.value === 'auto',
                      },
                    ]"
                    @click="selectSourceLang(option.value)"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>

            <button
              class="swap-btn"
              @click="swapLanguages"
              :disabled="isTranslating"
            >
              <span>⇄</span>
            </button>

            <div class="lang-to">
              <label>Целевой язык:</label>
              <div class="custom-select">
                <select v-model="targetLang">
                  <option value="en">Английский</option>
                  <option value="ru">Русский</option>
                  <option value="es">Испанский</option>
                  <option value="fr">Французский</option>
                  <option value="de">Немецкий</option>
                  <option value="it">Итальянский</option>
                  <option value="zh">Китайский</option>
                  <option value="ja">Японский</option>
                  <option value="ko">Корейский</option>
                </select>
                <div
                  class="select-display"
                  :class="{ active: isTargetSelectOpen }"
                  @click="toggleTargetSelect"
                >
                  <span>{{ getLanguageName(targetLang) }}</span>
                  <span class="select-arrow">▼</span>
                </div>
                <div class="select-options" v-if="isTargetSelectOpen">
                  <div
                    v-for="option in targetLangOptions"
                    :key="option.value"
                    :class="[
                      'select-option',
                      { selected: targetLang === option.value },
                    ]"
                    @click="selectTargetLang(option.value)"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="detected-lang" v-if="detectedLanguage">
            📋 Определен язык:
            <strong>{{ getLanguageName(detectedLanguage) }}</strong>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="translator-content">
        <!-- Область ввода и вывода -->
        <div class="translation-area">
          <!-- Исходный текст -->
          <div class="input-section">
            <div class="text-area-container">
              <textarea
                v-model="sourceText"
                placeholder="Введите текст для перевода..."
                @input="onTextInput"
                ref="sourceTextArea"
                class="translation-textarea"
                :maxlength="maxTextLength"
              ></textarea>

              <div class="text-actions">
                <button
                  class="clear-btn"
                  @click="clearText"
                  :disabled="!sourceText.trim()"
                >
                  🗑️ Очистить
                </button>
                <div class="char-counter">
                  {{ sourceText.length }}/{{ maxTextLength }}
                </div>
              </div>
            </div>

            <!-- Быстрый ввод -->
            <div class="quick-input" v-if="quickExamples.length > 0">
              <span class="quick-label">Быстрый ввод:</span>
              <div class="quick-buttons">
                <button
                  v-for="example in quickExamples"
                  :key="example.text"
                  class="quick-btn"
                  @click="loadExample(example)"
                >
                  {{ example.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Кнопка перевода -->
          <div class="translate-action">
            <button
              class="translate-btn"
              @click="translateText"
              :disabled="!sourceText.trim() || isTranslating"
            >
              <span class="btn-icon" v-if="isTranslating">⏳</span>
              <span class="btn-icon" v-else>🔤</span>
              <span class="btn-text">
                {{ isTranslating ? "Перевожу..." : "Перевести" }}
              </span>
            </button>
          </div>

          <!-- Переведенный текст -->
          <div class="output-section" v-if="translatedText">
            <div class="result-card">
              <div class="result-header">
                <h4>📖 Перевод:</h4>
                <div class="result-actions">
                  <button class="copy-btn" @click="copyTranslation">
                    📋 Копировать
                  </button>
                  <button class="speak-btn" @click="speakTranslation">
                    🔊 Произнести
                  </button>
                  <button
                    class="save-btn"
                    @click="saveToVocabulary"
                    v-if="showSaveButton"
                  >
                    💾 Сохранить
                  </button>
                </div>
              </div>

              <div class="translated-text">
                {{ translatedText }}
              </div>

              <!-- Дополнительная информация -->
              <div class="translation-meta" v-if="translationMeta">
                <div class="confidence" v-if="translationMeta.confidence">
                  <span class="meta-label">Точность:</span>
                  <span class="meta-value"
                    >{{ translationMeta.confidence }}%</span
                  >
                </div>
                <div class="char-count" v-if="translationMeta.characters">
                  <span class="meta-label">Символов:</span>
                  <span class="meta-value">{{
                    translationMeta.characters
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Альтернативные переводы -->
            <div
              class="alternatives-section"
              v-if="alternativeTranslations.length > 0"
            >
              <h4>🔄 Альтернативные варианты:</h4>
              <div class="alternatives-list">
                <div
                  v-for="(alt, index) in alternativeTranslations"
                  :key="index"
                  class="alternative-item"
                  @click="selectAlternative(alt)"
                >
                  <span class="alt-text">{{ alt.text }}</span>
                  <span class="alt-confidence">{{ alt.confidence }}%</span>
                </div>
              </div>
            </div>

            <!-- Примеры использования -->
            <div class="usage-examples" v-if="usageExamples.length > 0">
              <h4>💡 Примеры использования:</h4>
              <div class="examples-list">
                <div
                  v-for="(example, index) in usageExamples"
                  :key="index"
                  class="example-item"
                >
                  <div class="example-source">
                    <strong>Исходный:</strong> {{ example.source }}
                  </div>
                  <div class="example-translation">
                    <strong>Перевод:</strong> {{ example.translation }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Контекст перевода -->
            <div class="translation-context" v-if="translationContext">
              <h4>🎯 Контекст перевода:</h4>
              <div class="context-content">
                <p>{{ translationContext }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- История переводов -->
        <div class="history-section" v-if="translationHistory.length > 0">
          <div class="history-header">
            <h4>📚 История переводов</h4>
            <button class="clear-history" @click="clearHistory">
              Очистить историю
            </button>
          </div>
          <div class="history-list">
            <div
              v-for="item in translationHistory.slice(0, 5)"
              :key="item.id"
              class="history-item"
              @click="loadFromHistory(item)"
            >
              <div class="history-source">
                {{ item.sourceText.substring(0, 50)
                }}{{ item.sourceText.length > 50 ? "..." : "" }}
              </div>
              <div class="history-translation">
                {{ item.translatedText.substring(0, 50)
                }}{{ item.translatedText.length > 50 ? "..." : "" }}
              </div>
              <div class="history-meta">
                {{ formatTime(item.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface Translation {
  id: number;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

interface AlternativeTranslation {
  text: string;
  confidence: number;
}

interface UsageExample {
  source: string;
  translation: string;
}

interface TranslationMeta {
  confidence: number;
  characters: number;
  processingTime: number;
}

const props = defineProps<{
  isOpen: boolean;
  currentLanguage: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Состояния
const sourceText = ref("");
const translatedText = ref("");
const sourceLang = ref("auto");
const targetLang = ref("en");
const detectedLanguage = ref("");
const isTranslating = ref(false);
const sourceTextArea = ref<HTMLTextAreaElement>();
const isSourceSelectOpen = ref(false);
const isTargetSelectOpen = ref(false);

// Данные
const alternativeTranslations = ref<AlternativeTranslation[]>([]);
const usageExamples = ref<UsageExample[]>([]);
const translationContext = ref("");
const translationMeta = ref<TranslationMeta | null>(null);
const translationHistory = ref<Translation[]>([]);

// Настройки
const maxTextLength = 1000;

// Опции для dropdown
const sourceLangOptions = ref([
  { value: "auto", label: "Автоопределение" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "Английский" },
  { value: "es", label: "Испанский" },
  { value: "fr", label: "Французский" },
  { value: "de", label: "Немецкий" },
  { value: "it", label: "Итальянский" },
  { value: "zh", label: "Китайский" },
  { value: "ja", label: "Японский" },
  { value: "ko", label: "Корейский" },
]);

const targetLangOptions = ref([
  { value: "en", label: "Английский" },
  { value: "ru", label: "Русский" },
  { value: "es", label: "Испанский" },
  { value: "fr", label: "Французский" },
  { value: "de", label: "Немецкий" },
  { value: "it", label: "Итальянский" },
  { value: "zh", label: "Китайский" },
  { value: "ja", label: "Японский" },
  { value: "ko", label: "Корейский" },
]);

// Быстрые примеры
const quickExamples = ref([
  {
    label: "Приветствие",
    text: "Здравствуйте, как у вас дела?",
  },
  {
    label: "В ресторане",
    text: "Я бы хотел заказать столик на двоих, пожалуйста.",
  },
  {
    label: "Путешествия",
    text: "Как добраться до ближайшей станции метро?",
  },
  {
    label: "Бизнес",
    text: "Мы хотели бы обсудить условия сотрудничества.",
  },
]);

// Методы
const close = () => {
  emit("close");
};

const onTextInput = () => {
  if (sourceLang.value === "auto" && sourceText.value.trim().length > 2) {
    detectLanguage();
  }
};

// Методы для управления dropdown
const toggleSourceSelect = () => {
  isSourceSelectOpen.value = !isSourceSelectOpen.value;
  isTargetSelectOpen.value = false; // Закрываем другой dropdown
};

const toggleTargetSelect = () => {
  isTargetSelectOpen.value = !isTargetSelectOpen.value;
  isSourceSelectOpen.value = false; // Закрываем другой dropdown
};

const selectSourceLang = (value: string) => {
  sourceLang.value = value;
  isSourceSelectOpen.value = false;
  detectLanguage();
};

const selectTargetLang = (value: string) => {
  targetLang.value = value;
  isTargetSelectOpen.value = false;
};

// Закрытие dropdown при клике вне компонента
const closeDropdowns = () => {
  isSourceSelectOpen.value = false;
  isTargetSelectOpen.value = false;
};

// Компьютед свойства
const showSaveButton = computed(() => {
  return (
    translatedText.value &&
    sourceText.value &&
    sourceLang.value !== "auto" &&
    targetLang.value !== "auto"
  );
});

const detectLanguage = () => {
  if (sourceLang.value !== "auto" || !sourceText.value.trim()) {
    detectedLanguage.value = "";
    return;
  }

  // Простая имитация определения языка
  const text = sourceText.value.toLowerCase();
  if (text.includes("the") || text.includes("and") || text.includes("you")) {
    detectedLanguage.value = "en";
  } else if (
    text.includes("el") ||
    text.includes("la") ||
    text.includes("de")
  ) {
    detectedLanguage.value = "es";
  } else if (
    text.includes("der") ||
    text.includes("die") ||
    text.includes("das")
  ) {
    detectedLanguage.value = "de";
  } else if (/[а-яё]/i.test(text)) {
    detectedLanguage.value = "ru";
  } else {
    detectedLanguage.value = "en"; // По умолчанию
  }
};

const swapLanguages = () => {
  if (sourceLang.value === "auto") {
    sourceLang.value = detectedLanguage.value || "ru";
  }

  const temp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = temp;

  // Меняем текст местами
  const tempText = sourceText.value;
  sourceText.value = translatedText.value;
  translatedText.value = tempText;
};

const translateText = async () => {
  if (!sourceText.value.trim()) return;

  isTranslating.value = true;

  // Имитация AI перевода (в реальности - API вызов)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Генерируем перевод на основе языковой пары
  translatedText.value = generateTranslation(
    sourceText.value,
    sourceLang.value === "auto"
      ? detectedLanguage.value || "ru"
      : sourceLang.value,
    targetLang.value
  );

  // Генерируем дополнительные данные
  generateTranslationData();

  // Сохраняем в историю
  saveToHistory();

  isTranslating.value = false;
};

const generateTranslation = (
  text: string,
  from: string,
  to: string
): string => {
  // Простая имитация перевода для демонстрации
  const translations: any = {
    "ru-en": {
      "Здравствуйте, как у вас дела?": "Hello, how are you?",
      "Я бы хотел заказать столик на двоих, пожалуйста.":
        "I would like to book a table for two, please.",
      "Как добраться до ближайшей станции метро?":
        "How to get to the nearest subway station?",
      "Мы хотели бы обсудить условия сотрудничества.":
        "We would like to discuss the terms of cooperation.",
      "Сколько стоит этот товар?": "How much does this product cost?",
      "Где находится туалет?": "Where is the restroom?",
    },
    "en-ru": {
      "Hello, how are you?": "Привет, как у тебя дела?",
      "I would like to book a table for two, please.":
        "Я бы хотел заказать столик на двоих, пожалуйста.",
      "How to get to the nearest subway station?":
        "Как добраться до ближайшей станции метро?",
      "We would like to discuss the terms of cooperation.":
        "Мы хотели бы обсудить условия сотрудничества.",
      "How much does this product cost?": "Сколько стоит этот товар?",
      "Where is the restroom?": "Где находится туалет?",
    },
    "ru-es": {
      "Здравствуйте, как у вас дела?": "Hola, ¿cómo estás?",
      "Я бы хотел заказать столик на двоих, пожалуйста.":
        "Me gustaría reservar una mesa para dos, por favor.",
    },
    "es-ru": {
      "Hola, ¿cómo estás?": "Привет, как у тебя дела?",
      "Me gustaría reservar una mesa para dos, por favor.":
        "Я бы хотел заказать столик на двоих, пожалуйста.",
    },
  };

  const key = `${from}-${to}`;
  return translations[key]?.[text] || `[Перевод: ${text}]`;
};

const generateTranslationData = () => {
  // Альтернативные переводы
  alternativeTranslations.value = [
    { text: "Альтернативный вариант перевода 1", confidence: 85 },
    { text: "Другой возможный перевод 2", confidence: 78 },
    { text: "Вариант перевода 3", confidence: 72 },
  ];

  // Примеры использования
  usageExamples.value = [
    {
      source: "Пример использования исходной фразы",
      translation: "Example usage of translated phrase",
    },
    {
      source: "Другой пример в контексте",
      translation: "Another example in context",
    },
  ];

  // Контекст
  translationContext.value =
    "Этот перевод подходит для неформального общения. Для деловой переписки рекомендуется использовать более формальные варианты.";

  // Метаданные
  translationMeta.value = {
    confidence: 92,
    characters: translatedText.value.length,
    processingTime: 1.2,
  };
};

const saveToHistory = () => {
  const translation: Translation = {
    id: Date.now(),
    sourceText: sourceText.value,
    translatedText: translatedText.value,
    sourceLang:
      sourceLang.value === "auto"
        ? detectedLanguage.value || "ru"
        : sourceLang.value,
    targetLang: targetLang.value,
    timestamp: new Date(),
  };

  translationHistory.value.unshift(translation);

  // Сохраняем в localStorage (в реальном приложении)
  if (translationHistory.value.length > 10) {
    translationHistory.value = translationHistory.value.slice(0, 10);
  }
};

const loadFromHistory = (item: Translation) => {
  sourceText.value = item.sourceText;
  sourceLang.value = item.sourceLang;
  targetLang.value = item.targetLang;
  translatedText.value = item.translatedText;
};

const clearHistory = () => {
  translationHistory.value = [];
};

const selectAlternative = (alt: AlternativeTranslation) => {
  translatedText.value = alt.text;
};

const copyTranslation = async () => {
  try {
    await navigator.clipboard.writeText(translatedText.value);
    // Можно добавить уведомление
    console.log("Translation copied to clipboard");
  } catch (err) {
    console.error("Failed to copy translation:", err);
  }
};

const speakTranslation = () => {
  if (!translatedText.value) return;

  const utterance = new SpeechSynthesisUtterance(translatedText.value);
  utterance.lang = getLanguageCode(targetLang.value);
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
};

const saveToVocabulary = () => {
  // В реальном приложении здесь будет сохранение в словарь
  console.log("Saving to vocabulary:", {
    source: sourceText.value,
    translation: translatedText.value,
    from: sourceLang.value,
    to: targetLang.value,
  });

  // Можно добавить уведомление об успешном сохранении
  alert("Фраза сохранена в словарь!");
};

const clearText = () => {
  sourceText.value = "";
  translatedText.value = "";
  alternativeTranslations.value = [];
  usageExamples.value = [];
  translationContext.value = "";
  translationMeta.value = null;
};

const loadExample = (example: any) => {
  sourceText.value = example.text;
  nextTick(() => {
    translateText();
  });
};

const getLanguageName = (code: string) => {
  const languages: any = {
    ru: "Русский",
    en: "Английский",
    es: "Испанский",
    fr: "Французский",
    de: "Немецкий",
    it: "Итальянский",
    zh: "Китайский",
    ja: "Японский",
    ko: "Корейский",
  };
  return languages[code] || code;
};

const getLanguageCode = (lang: string) => {
  const codes: any = {
    en: "en-US",
    ru: "ru-RU",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
  };
  return codes[lang] || "en-US";
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Инициализация
onMounted(() => {
  // Загружаем историю из localStorage (в реальном приложении)
  const savedHistory = localStorage.getItem("translationHistory");
  if (savedHistory) {
    translationHistory.value = JSON.parse(savedHistory);
  }
});

// Сохраняем историю при изменении
watch(
  translationHistory,
  (newHistory) => {
    localStorage.setItem("translationHistory", JSON.stringify(newHistory));
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.ai-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.translator-container {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.ai-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  background: rgba(15, 15, 15, 0.8);

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .title-section {
      h3 {
        color: #f8fafc;
        margin: 0 0 0.5rem 0;
        font-size: 1.3rem;
      }

      p {
        color: #94a3b8;
        margin: 0;
        font-size: 0.9rem;
      }
    }

    .close-btn {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #f8fafc;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.2rem;

      &:hover {
        background: rgba(139, 92, 246, 0.2);
      }
    }
  }

  .language-settings {
    .lang-selector {
      display: flex;
      align-items: end;
      gap: 1rem;
      margin-bottom: 0.75rem;

      .custom-select {
        position: relative;

        select {
          /* Скрываем стандартный select но оставляем функциональность */
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 2;
        }
        .select-display {
          background: rgba(26, 26, 26, 0.9);
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: 10px;
          padding: 0.75rem;
          color: #f8fafc;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &:hover {
            border-color: rgba(139, 92, 246, 0.6);
            background: rgba(35, 35, 35, 0.9);
          }

          &.active {
            border-color: rgba(139, 92, 246, 0.8);
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
          }

          .select-arrow {
            transition: transform 0.3s ease;
            color: #8b5cf6;
          }
        }
        /* Кастомный dropdown список */
        .select-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(26, 26, 26, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: 10px;
          margin-top: 0.25rem;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

          .select-option {
            padding: 0.75rem;
            color: #f8fafc;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 1px solid rgba(139, 92, 246, 0.1);

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: rgba(139, 92, 246, 0.2);
            }

            &.selected {
              background: linear-gradient(135deg, #8b5cf6, #7c3aed);
              color: white;
            }

            &.auto-detect {
              color: #f59e0b;
              font-weight: 500;
            }
          }
        }
      }
    }

    .swap-btn {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border: none;
      color: white;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.3rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;

      &:hover:not(:disabled) {
        transform: rotate(180deg) scale(1.1);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      span {
        transition: transform 0.3s ease;
      }
    }
  }

  .detected-lang {
    color: #f59e0b;
    font-size: 0.85rem;
    text-align: center;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 8px;
    padding: 0.5rem;
    margin-top: 0.5rem;

    strong {
      font-weight: 600;
    }
  }
}

select {
  &::-ms-expand {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(26, 26, 26, 0.9);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.6);
    border-radius: 4px;

    &:hover {
      background: rgba(139, 92, 246, 0.8);
    }
  }
}

/* Анимация для смены языков */
.lang-selector {
  transition: all 0.3s ease;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .language-settings {
    .lang-selector {
      flex-direction: column;
      gap: 1rem;

      .lang-from,
      .lang-to {
        width: 100%;
      }

      .swap-btn {
        align-self: center;
        margin: 0.5rem 0;
        transform: rotate(90deg);

        &:hover:not(:disabled) {
          transform: rotate(270deg) scale(1.1);
        }
      }
    }
  }
}

.translator-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 3px;
  }
}

.translation-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section {
  .text-area-container {
    position: relative;
    margin-bottom: 1rem;

    .translation-textarea {
      width: 100%;
      height: 120px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 1rem;
      color: #f8fafc;
      font-size: 1rem;
      line-height: 1.5;
      resize: vertical;
      transition: all 0.3s ease;

      &::placeholder {
        color: #94a3b8;
      }

      &:focus {
        outline: none;
        border-color: rgba(139, 92, 246, 0.6);
        box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
      }
    }

    .text-actions {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .clear-btn {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .char-counter {
        color: #94a3b8;
        font-size: 0.7rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
      }
    }
  }

  .quick-input {
    .quick-label {
      display: block;
      color: #94a3b8;
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .quick-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .quick-btn {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: #f8fafc;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(139, 92, 246, 0.2);
          transform: translateY(-1px);
        }
      }
    }
  }
}

.translate-action {
  display: flex;
  justify-content: center;

  .translate-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border: none;
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.output-section {
  .result-card {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h4 {
        color: #f8fafc;
        margin: 0;
        font-size: 1rem;
      }

      .result-actions {
        display: flex;
        gap: 0.5rem;

        button {
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .copy-btn {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;

          &:hover {
            background: rgba(16, 185, 129, 0.2);
          }
        }

        .speak-btn {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;

          &:hover {
            background: rgba(59, 130, 246, 0.2);
          }
        }

        .save-btn {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #f59e0b;

          &:hover {
            background: rgba(245, 158, 11, 0.2);
          }
        }
      }
    }

    .translated-text {
      color: #f8fafc;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .translation-meta {
      display: flex;
      gap: 1rem;

      .confidence,
      .char-count {
        .meta-label {
          color: #94a3b8;
          font-size: 0.8rem;
          margin-right: 0.25rem;
        }

        .meta-value {
          color: #f8fafc;
          font-size: 0.8rem;
          font-weight: 600;
        }
      }
    }
  }

  .alternatives-section,
  .usage-examples,
  .translation-context {
    margin-bottom: 1.5rem;

    h4 {
      color: #f8fafc;
      margin: 0 0 1rem 0;
      font-size: 1rem;
    }
  }

  .alternatives-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .alternative-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 8px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(139, 92, 246, 0.5);
      }

      .alt-text {
        color: #f8fafc;
        font-size: 0.9rem;
        flex: 1;
      }

      .alt-confidence {
        color: #94a3b8;
        font-size: 0.8rem;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
      }
    }
  }

  .examples-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .example-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 8px;
      padding: 1rem;

      .example-source,
      .example-translation {
        color: #f8fafc;
        font-size: 0.9rem;
        line-height: 1.4;

        strong {
          color: #8b5cf6;
        }
      }

      .example-source {
        margin-bottom: 0.5rem;
      }
    }
  }

  .translation-context {
    .context-content {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 8px;
      padding: 1rem;

      p {
        color: #94a3b8;
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
      }
    }
  }
}

.history-section {
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h4 {
      color: #f8fafc;
      margin: 0;
      font-size: 1rem;
    }

    .clear-history {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.2);
      }
    }
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .history-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 8px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(139, 92, 246, 0.5);
      }

      .history-source,
      .history-translation {
        color: #f8fafc;
        font-size: 0.8rem;
        line-height: 1.3;
      }

      .history-source {
        margin-bottom: 0.25rem;
        opacity: 0.9;
      }

      .history-translation {
        opacity: 0.7;
        margin-bottom: 0.25rem;
      }

      .history-meta {
        color: #94a3b8;
        font-size: 0.7rem;
        text-align: right;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.translator-container {
  animation: fadeIn 0.4s ease;
}
</style>
