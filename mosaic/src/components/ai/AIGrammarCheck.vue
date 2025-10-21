<template>
  <div class="ai-overlay" v-if="isOpen" @click.self="close">
    <div class="ai-container grammar-container">
      <!-- Заголовок -->
      <div class="ai-header">
        <div class="header-content">
          <div class="title-section">
            <h3>📝 Проверка грамматики</h3>
            <p>
              AI поможет найти и исправить ошибки в {{ currentLanguage.name }}
            </p>
          </div>
          <button class="close-btn" @click="close">×</button>
        </div>

        <!-- Статистика -->
        <div class="stats-section">
          <div class="stat">
            <span class="value">{{ errorsCount }}</span>
            <span class="label">Ошибок найдено</span>
          </div>
          <div class="stat">
            <span class="value">{{ correctionsCount }}</span>
            <span class="label">Исправлений</span>
          </div>
          <div class="stat">
            <span class="value">{{ accuracy }}%</span>
            <span class="label">Точность</span>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="grammar-content">
        <!-- Область ввода текста -->
        <div class="input-section">
          <div class="text-area-container">
            <textarea
              v-model="userText"
              placeholder="Введите текст для проверки грамматики..."
              @input="onTextInput"
              ref="textArea"
              class="grammar-textarea"
              :class="{ 'has-errors': errorsCount > 0 }"
            ></textarea>

            <!-- Счетчик символов -->
            <div class="char-counter">{{ userText.length }}/1000</div>
          </div>

          <!-- Быстрые примеры -->
          <div class="quick-examples">
            <button
              v-for="example in quickExamples"
              :key="example.text"
              class="example-btn"
              @click="loadExample(example)"
            >
              {{ example.label }}
            </button>
          </div>
        </div>

        <!-- Результаты проверки -->
        <div class="results-section" v-if="checkedText.length > 0">
          <!-- Подсветка текста с ошибками -->
          <div class="analyzed-text">
            <h4>📊 Проверенный текст:</h4>
            <div class="text-display">
              <span
                v-for="(segment, index) in analyzedSegments"
                :key="index"
                :class="['text-segment', segment.type]"
                @click="showCorrection(segment)"
              >
                {{ segment.text }}
              </span>
            </div>
          </div>

          <!-- Список исправлений -->
          <div class="corrections-list">
            <h4>🎯 Найденные ошибки:</h4>
            <div
              v-for="correction in corrections"
              :key="correction.id"
              class="correction-item"
            >
              <div class="correction-header">
                <span class="error-type" :class="correction.type">
                  {{ getErrorTypeText(correction.type) }}
                </span>
                <span class="confidence">
                  Точность: {{ correction.confidence }}%
                </span>
              </div>

              <div class="correction-content">
                <div class="comparison">
                  <span class="original">
                    <strong>Было:</strong>
                    <span class="highlight-error">{{
                      correction.original
                    }}</span>
                  </span>
                  <span class="arrow">→</span>
                  <span class="corrected">
                    <strong>Стало:</strong>
                    <span class="highlight-correct">{{
                      correction.corrected
                    }}</span>
                  </span>
                </div>

                <div class="explanation">
                  <span class="explanation-icon">💡</span>
                  {{ correction.explanation }}
                </div>

                <div class="correction-actions">
                  <button
                    class="apply-btn"
                    @click="applyCorrection(correction)"
                  >
                    Применить
                  </button>
                  <button
                    class="ignore-btn"
                    @click="ignoreCorrection(correction)"
                  >
                    Игнорировать
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Статистика улучшений -->
          <div class="improvement-stats">
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-info">
                <span class="stat-value">{{ improvementScore }}%</span>
                <span class="stat-label">Улучшение текста</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-info">
                <span class="stat-value">{{ readabilityScore }}/10</span>
                <span class="stat-label">Читаемость</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="actions-section">
          <button
            class="check-btn"
            @click="checkGrammar"
            :disabled="!userText.trim() || isChecking"
          >
            <span class="btn-icon" v-if="isChecking">🔍</span>
            <span class="btn-icon" v-else>📝</span>
            <span class="btn-text">
              {{ isChecking ? "Проверка..." : "Проверить грамматику" }}
            </span>
          </button>

          <button
            class="clear-btn"
            @click="clearText"
            :disabled="!userText.trim()"
          >
            <span class="btn-icon">🗑️</span>
            <span class="btn-text">Очистить</span>
          </button>

          <button
            class="copy-btn"
            @click="copyCorrectedText"
            :disabled="!checkedText.trim()"
          >
            <span class="btn-icon">📋</span>
            <span class="btn-text">Копировать</span>
          </button>
        </div>

        <!-- Советы по грамматике -->
        <div class="grammar-tips" v-if="grammarTips.length > 0">
          <h4>🎓 Советы по грамматике:</h4>
          <div class="tips-grid">
            <div v-for="tip in grammarTips" :key="tip.id" class="tip-card">
              <div class="tip-icon">{{ tip.icon }}</div>
              <div class="tip-content">
                <h5>{{ tip.title }}</h5>
                <p>{{ tip.description }}</p>
                <div class="tip-example">
                  <code>{{ tip.example }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";

interface GrammarCorrection {
  id: number;
  original: string;
  corrected: string;
  explanation: string;
  type: "spelling" | "grammar" | "punctuation" | "word_order" | "style";
  confidence: number;
  position: {
    start: number;
    end: number;
  };
  applied: boolean;
}

interface TextSegment {
  text: string;
  type: "normal" | "error" | "correction";
  correction?: GrammarCorrection;
}

interface GrammarTip {
  id: number;
  icon: string;
  title: string;
  description: string;
  example: string;
}

const props = defineProps<{
  isOpen: boolean;
  currentLanguage: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Состояния
const userText = ref("");
const checkedText = ref("");
const isChecking = ref(false);
const textArea = ref<HTMLTextAreaElement>();

// Данные
const corrections = ref<GrammarCorrection[]>([]);
const grammarTips = ref<GrammarTip[]>([]);

// Быстрые примеры
const quickExamples = ref([
  {
    label: "Пример с ошибками",
    text: "I goes to school every day. She don't like apples. We was happy to see they.",
  },
  {
    label: "Деловое письмо",
    text: "Dear sir, i am writing to inform you about our meeting on monday. Please to confirm you attendance.",
  },
  {
    label: "Повседневная речь",
    text: "He play football good. They was here yesterday. She have many friend.",
  },
]);

// Компьютед свойства
const errorsCount = computed(() => {
  return corrections.value.filter((c) => !c.applied).length;
});

const correctionsCount = computed(() => {
  return corrections.value.filter((c) => c.applied).length;
});

const accuracy = computed(() => {
  if (!userText.value.trim()) return 0;
  const totalWords = userText.value.split(/\s+/).length;
  const errorRate = errorsCount.value / totalWords;
  return Math.max(0, Math.round((1 - errorRate) * 100));
});

const improvementScore = computed(() => {
  if (!userText.value.trim()) return 0;
  const baseScore = 70; // Базовый балл
  const improvement =
    (correctionsCount.value / Math.max(1, errorsCount.value)) * 30;
  return Math.min(100, Math.round(baseScore + improvement));
});

const readabilityScore = computed(() => {
  if (!userText.value.trim()) return 0;
  const baseScore = 6;
  const improvement =
    (correctionsCount.value / Math.max(1, errorsCount.value)) * 4;
  return Math.min(10, Math.round(baseScore + improvement));
});

const analyzedSegments = computed(() => {
  if (!checkedText.value) return [];

  const segments: TextSegment[] = [];
  let lastIndex = 0;

  // Сортируем исправления по позиции
  const sortedCorrections = [...corrections.value]
    .filter((c) => !c.applied)
    .sort((a, b) => a.position.start - b.position.start);

  sortedCorrections.forEach((correction) => {
    // Добавляем текст до ошибки
    if (correction.position.start > lastIndex) {
      segments.push({
        text: checkedText.value.slice(lastIndex, correction.position.start),
        type: "normal",
      });
    }

    // Добавляем текст с ошибкой
    segments.push({
      text: checkedText.value.slice(
        correction.position.start,
        correction.position.end
      ),
      type: "error",
      correction: correction,
    });

    lastIndex = correction.position.end;
  });

  // Добавляем оставшийся текст
  if (lastIndex < checkedText.value.length) {
    segments.push({
      text: checkedText.value.slice(lastIndex),
      type: "normal",
    });
  }

  return segments;
});

// Методы
const close = () => {
  emit("close");
};

const onTextInput = () => {
  // Автопроверка при вводе (можно сделать дебаунс)
  if (userText.value.length > 10) {
    // checkGrammar()
  }
};

const loadExample = (example: any) => {
  userText.value = example.text;
  nextTick(() => {
    checkGrammar();
  });
};

const checkGrammar = async () => {
  if (!userText.value.trim()) return;

  isChecking.value = true;
  checkedText.value = userText.value;

  // Имитация AI проверки (в реальности - API вызов)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Генерируем тестовые исправления
  generateTestCorrections();

  // Генерируем советы
  generateGrammarTips();

  isChecking.value = false;
};

const generateTestCorrections = () => {
  const testCorrections: GrammarCorrection[] = [];
  const text = userText.value.toLowerCase();

  // Простые правила для демонстрации
  if (text.includes(" i ")) {
    testCorrections.push({
      id: 1,
      original: "i",
      corrected: "I",
      explanation:
        'Местоимение "я" всегда пишется с заглавной буквы в английском языке',
      type: "spelling",
      confidence: 95,
      position: { start: text.indexOf(" i "), end: text.indexOf(" i ") + 1 },
      applied: false,
    });
  }

  if (text.includes("goes") && text.includes("i")) {
    testCorrections.push({
      id: 2,
      original: "goes",
      corrected: "go",
      explanation:
        'С местоимением "I" используется форма глагола "go", а не "goes"',
      type: "grammar",
      confidence: 90,
      position: { start: text.indexOf("goes"), end: text.indexOf("goes") + 4 },
      applied: false,
    });
  }

  if (text.includes("don't") && text.includes("she")) {
    testCorrections.push({
      id: 3,
      original: "don't",
      corrected: "doesn't",
      explanation:
        'С местоимением "she" используется "doesn\'t", а не "don\'t"',
      type: "grammar",
      confidence: 92,
      position: {
        start: text.indexOf("don't"),
        end: text.indexOf("don't") + 5,
      },
      applied: false,
    });
  }

  if (text.includes("was") && text.includes("we")) {
    testCorrections.push({
      id: 4,
      original: "was",
      corrected: "were",
      explanation: 'С местоимением "we" используется "were", а не "was"',
      type: "grammar",
      confidence: 88,
      position: { start: text.indexOf("was"), end: text.indexOf("was") + 3 },
      applied: false,
    });
  }

  corrections.value = testCorrections;
};

const generateGrammarTips = () => {
  grammarTips.value = [
    {
      id: 1,
      icon: "🔤",
      title: "Порядок слов",
      description:
        "В английском строгий порядок: Подлежащее - Сказуемое - Дополнение",
      example: "She reads books. (Она читает книги)",
    },
    {
      id: 2,
      icon: "⏰",
      title: "Времена глаголов",
      description: "Согласуйте время глагола с подлежащим и контекстом",
      example: "He works every day. (Present Simple)",
    },
    {
      id: 3,
      icon: "📏",
      title: "Артикли",
      description:
        'Используйте "a/an" для неопределенных, "the" для определенных существительных',
      example: "a book, an apple, the sun",
    },
  ];
};

const showCorrection = (segment: TextSegment) => {
  if (segment.type === "error" && segment.correction) {
    // Можно показать подробности исправления
    console.log("Correction details:", segment.correction);
  }
};

const applyCorrection = (correction: GrammarCorrection) => {
  correction.applied = true;

  // Обновляем текст с примененным исправлением
  const start = correction.position.start;
  const end = correction.position.end;
  checkedText.value =
    checkedText.value.slice(0, start) +
    correction.corrected +
    checkedText.value.slice(end);

  userText.value = checkedText.value;
};

const ignoreCorrection = (correction: GrammarCorrection) => {
  correction.applied = true;
};

const clearText = () => {
  userText.value = "";
  checkedText.value = "";
  corrections.value = [];
  grammarTips.value = [];
};

const copyCorrectedText = async () => {
  try {
    await navigator.clipboard.writeText(checkedText.value);
    // Можно добавить уведомление об успешном копировании
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
};

const getErrorTypeText = (type: string) => {
  const types = {
    spelling: "Орфография",
    grammar: "Грамматика",
    punctuation: "Пунктуация",
    word_order: "Порядок слов",
    style: "Стиль",
  };
  return types[type as keyof typeof types] || type;
};
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

.grammar-container {
  width: 100%;
  max-width: 800px;
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

  .stats-section {
    display: flex;
    gap: 2rem;

    .stat {
      text-align: center;

      .value {
        display: block;
        color: #8b5cf6;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      .label {
        color: #94a3b8;
        font-size: 0.8rem;
      }
    }
  }
}

.grammar-content {
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

.input-section {
  .text-area-container {
    position: relative;
    margin-bottom: 1rem;

    .grammar-textarea {
      width: 100%;
      height: 150px;
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

      &.has-errors {
        border-color: rgba(239, 68, 68, 0.5);
      }
    }

    .char-counter {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      color: #94a3b8;
      font-size: 0.8rem;
      background: rgba(0, 0, 0, 0.5);
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
    }
  }

  .quick-examples {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .example-btn {
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

.results-section {
  .analyzed-text {
    margin-bottom: 1.5rem;

    h4 {
      color: #f8fafc;
      margin: 0 0 1rem 0;
      font-size: 1rem;
    }

    .text-display {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 12px;
      padding: 1rem;
      line-height: 1.6;
      font-size: 1rem;

      .text-segment {
        transition: all 0.3s ease;

        &.normal {
          color: #f8fafc;
        }

        &.error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-bottom: 2px wavy #ef4444;
          cursor: pointer;
          padding: 0 2px;
          border-radius: 2px;

          &:hover {
            background: rgba(239, 68, 68, 0.3);
          }
        }

        &.correction {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border-bottom: 2px solid #10b981;
          padding: 0 2px;
          border-radius: 2px;
        }
      }
    }
  }

  .corrections-list {
    h4 {
      color: #f8fafc;
      margin: 0 0 1rem 0;
      font-size: 1rem;
    }

    .correction-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;

      .correction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;

        .error-type {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;

          &.spelling {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }

          &.grammar {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
          }

          &.punctuation {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
          }

          &.word_order {
            background: rgba(139, 92, 246, 0.2);
            color: #8b5cf6;
          }

          &.style {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
          }
        }

        .confidence {
          color: #94a3b8;
          font-size: 0.8rem;
        }
      }

      .correction-content {
        .comparison {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;

          .original,
          .corrected {
            color: #f8fafc;
            font-size: 0.9rem;
          }

          .highlight-error {
            color: #ef4444;
            font-weight: 500;
          }

          .highlight-correct {
            color: #10b981;
            font-weight: 500;
          }

          .arrow {
            color: #8b5cf6;
            font-weight: bold;
          }
        }

        .explanation {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.4;

          .explanation-icon {
            flex-shrink: 0;
          }
        }

        .correction-actions {
          display: flex;
          gap: 0.5rem;

          .apply-btn,
          .ignore-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .apply-btn {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);

            &:hover {
              background: rgba(16, 185, 129, 0.3);
            }
          }

          .ignore-btn {
            background: rgba(100, 116, 139, 0.2);
            color: #64748b;
            border: 1px solid rgba(100, 116, 139, 0.3);

            &:hover {
              background: rgba(100, 116, 139, 0.3);
            }
          }
        }
      }
    }
  }

  .improvement-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 1rem;

      .stat-icon {
        font-size: 1.5rem;
      }

      .stat-info {
        .stat-value {
          display: block;
          color: #f8fafc;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 0.8rem;
        }
      }
    }
  }
}

.actions-section {
  display: flex;
  gap: 0.75rem;

  .check-btn,
  .clear-btn,
  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .check-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    flex: 2;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    }
  }

  .clear-btn {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    flex: 1;

    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
    }
  }

  .copy-btn {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10b981;
    flex: 1;

    &:hover:not(:disabled) {
      background: rgba(16, 185, 129, 0.2);
    }
  }
}

.grammar-tips {
  h4 {
    color: #f8fafc;
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;

    .tip-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      gap: 1rem;

      .tip-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .tip-content {
        flex: 1;

        h5 {
          color: #f8fafc;
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        p {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .tip-example {
          code {
            background: rgba(0, 0, 0, 0.3);
            color: #f8fafc;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-size: 0.8rem;
            font-family: "Courier New", monospace;
          }
        }
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

.grammar-container {
  animation: fadeIn 0.4s ease;
}
</style>
