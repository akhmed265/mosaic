<template>
  <section class="hero">
    <!-- Анимированный фон -->
    <div class="hero-background">
      <div class="gradient-orbit"></div>
      <div class="gradient-orbit"></div>
      <div class="gradient-orbit"></div>
    </div>

    <div class="container">
      <div class="hero__content">
        <!-- Текстовый блок -->
        <div class="hero__text">
          <div class="hero-badge" @click="toggleAIMenu">
            <span class="badge-dot"></span>
            {{ t("hero.badge") }}

            <span class="ai-sparkle">✨</span>

            <!-- AI Меню -->
            <transition name="ai-menu">
              <div v-if="isAIMenuOpen" class="ai-menu">
                <div class="ai-menu-header">
                  <h4>AI Помощник</h4>
                  <p>Выберите действие</p>
                </div>

                <div class="ai-actions">
                  <button class="ai-action" @click="openAIChat">
                    <span class="ai-icon">💬</span>
                    <span class="ai-text">Чат-помощник</span>
                  </button>

                  <button @click="openAITranslator" class="ai-action">
                    <span class="ai-icon">🔤</span>
                    <span>AI Переводчик</span>
                  </button>

                  <button class="ai-action" @click="openAIRecommendations">
                    <span class="ai-icon">🎯</span>
                    <span class="ai-text">Рекомендации</span>
                  </button>

                  <button class="ai-action" @click="openAIPronunciation">
                    <span class="ai-icon">🎤</span>
                    <span class="ai-text">Практика речи</span>
                  </button>

                  <button class="ai-action" @click="openAIGrammarCheck">
                    <span class="ai-icon">📝</span>
                    <span class="ai-text">Проверка текста</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <h1 class="hero__title">
            <span class="title-gradient">{{ t("hero.title") }}</span>
            <br />
            <span class="title-dynamic" :style="titleStyle">
              {{ t("hero.subtitle") }} {{ currentLanguage.name.toLowerCase() }}
            </span>
          </h1>

          <p class="hero__description">
            {{ currentLanguage.description }}
          </p>

          <!-- CTA блок -->
          <div class="hero-actions">
            <button
              class="cta-btn primary"
              @click="startQuickTest"
              :style="buttonStyle"
            >
              <span class="btn-content">
                <span class="btn-text">{{ t("hero.cta.primary") }}</span>
                <span class="btn-arrow">→</span>
              </span>
              <div class="btn-shine"></div>
            </button>

            <button class="cta-btn secondary">
              <span class="btn-icon">🎯</span>
              <span class="btn-text">{{ t("hero.cta.secondary") }}</span>
            </button>
          </div>

          <!-- Статистика -->
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">10k+</div>
              <div class="stat-label">{{ t("hero.stats.students") }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">95%</div>
              <div class="stat-label">{{ t("hero.stats.success") }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">{{ t("hero.stats.support") }}</div>
            </div>
          </div>
        </div>

        <!-- Интерактивный блок языков -->
        <div class="hero__visual">
          <div class="language-sphere">
            <div
              v-for="(language, index) in languages"
              :key="language.id"
              class="language-orb"
              :class="{
                'orb-active': currentLanguage.id === language.id,
                'orb-hover': hoveredLanguage === language.id,
              }"
              :style="getOrbStyle(index)"
              @mouseenter="hoveredLanguage = language.id"
              @mouseleave="hoveredLanguage = null"
              @click="handleLanguageSelect(language)"
            >
              <div class="orb-content">
                <span class="orb-flag">{{ language.flag }}</span>
                <span class="orb-name">{{ language.name }}</span>
              </div>
              <div
                class="orb-glow"
                :style="{ background: language.color }"
              ></div>
            </div>

            <!-- Центральный элемент -->
            <div class="sphere-center">
              <div class="center-glow" :style="centerGlowStyle"></div>
              <div class="center-content">
                <span class="center-flag">{{ currentLanguage.flag }}</span>
                <span class="center-text">{{ t("hero.sphere.choose") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Прогресс бар навыков -->
      <div class="skills-progress">
        <div class="progress-header">
          <h3>{{ t("hero.progress.title") }}</h3>
          <div class="progress-level">
            {{ t("hero.progress.level") }}:
            <span :style="{ color: currentLanguage.color }">{{
              t("hero.progress.beginner")
            }}</span>
          </div>
        </div>

        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{
              width: '35%',
              background: `linear-gradient(90deg, ${
                currentLanguage.color
              }, ${getLighterColor(currentLanguage.color, 30)})`,
            }"
          >
            <div class="progress-pulse"></div>
          </div>
        </div>

        <div class="progress-milestones">
          <div
            v-for="stage in progressStages"
            :key="stage.stage"
            class="milestone"
            :class="{ 'milestone-active': currentProgressStage >= stage.stage }"
          >
            <div
              class="milestone-marker"
              :style="{
                background:
                  currentProgressStage >= stage.stage
                    ? currentLanguage.color
                    : '#374151',
              }"
            ></div>
            <div class="milestone-info">
              <div class="milestone-title">{{ stage.title }}</div>
              <div class="milestone-duration">{{ stage.duration }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <AIChat
    :is-open="isAIChatOpen"
    :current-language="currentLanguage"
    @close="isAIChatOpen = false"
  />

  <AIRecommendations
    :is-open="isAIRecommendationsOpen"
    :current-language="currentLanguage"
    @close="isAIRecommendationsOpen = false"
  />
  <AIPronunciation
    :is-open="isAIPronunciationOpen"
    :current-language="currentLanguage"
    @close="isAIPronunciationOpen = false"
  />
  <AIGrammarCheck
    :is-open="isAIGrammarCheckOpen"
    :current-language="currentLanguage"
    @close="isAIGrammarCheckOpen = false"
  />
  <AITranslator
    :is-open="isAITranslatorOpen"
    :current-language="currentLanguage"
    @close="isAITranslatorOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import PuzzleFlag from "@/components/hero/PuzzleFlag.vue";
import QuickTestWizard from "@/components/hero/QuickTestWizard.vue";
import { useI18n } from "vue-i18n";
import AIChat from "../ai/AIChat.vue";
import AIRecommendations from "@/components/ai/AIRecommendations.vue";
import AIPronunciation from "@/components/ai/AIPronunciation.vue";
import AIGrammarCheck from "@/components/ai/AIGrammarCheck.vue";
import AITranslator from "@/components/ai/AITranslator.vue";

const hoveredLanguage = ref<string | null>(null);
const { t } = useI18n();
// Состояния для AI компонентов
const isAIChatOpen = ref(false);
const isAIRecommendationsOpen = ref(false);
const isAIPronunciationOpen = ref(false);
const isAIGrammarCheckOpen = ref(false);
const isAITranslatorOpen = ref(false);

const openAIChat = () => {
  isAIChatOpen.value = true;
  isAIMenuOpen.value = false;
};

const openAIRecommendations = () => {
  isAIRecommendationsOpen.value = true;
  isAIMenuOpen.value = false;
};

const openAIPronunciation = () => {
  isAIPronunciationOpen.value = true;
  isAIMenuOpen.value = false;
};

const openAIGrammarCheck = () => {
  isAIGrammarCheckOpen.value = true;
  isAIMenuOpen.value = false;
};

const openAITranslator = () => {
  isAITranslatorOpen.value = true;
  isAIMenuOpen.value = false;
};

const handleTestComplete = (result: any) => {
  console.log("Результат теста:", result);
  // Здесь можно добавить логику обработки результата
  showTest.value = false;
};

// Состояния
const showTest = ref(false);
const currentProgressStage = ref(2);

// Данные языков
const languages = ref([
  {
    id: "en",
    name: "Английский",
    flag: "🇬🇧",
    color: "#8b5cf6",
    description:
      "Международный язык бизнеса и путешествий. Откройте мир новых возможностей.",
    culturalFact:
      "В английском больше слов, чем в любом другом языке - около 750,000",
    students: 12543,
  },
  {
    id: "es",
    name: "Испанский",
    flag: "🇪🇸",
    color: "#10b981",
    description:
      "Язык страсти и культуры. Говорите с 500 миллионами людей по всему миру.",
    culturalFact: "Испанский - второй по распространенности родной язык в мире",
    students: 8432,
  },
  {
    id: "fr",
    name: "Французский",
    flag: "🇫🇷",
    color: "#f59e0b",
    description:
      "Язык любви и дипломатии. Погрузитесь в богатую культуру Франции.",
    culturalFact: "Французский - официальный язык 29 стран",
    students: 5678,
  },
  {
    id: "de",
    name: "Немецкий",
    flag: "🇩🇪",
    color: "#ef4444",
    description:
      "Язык инноваций и технологий. Откройте двери в европейский бизнес.",
    culturalFact: "Немецкий - самый распространенный родной язык в Европе",
    students: 4321,
  },
  {
    id: "ja",
    name: "Японский",
    flag: "🇯🇵",
    color: "#06b6d4",
    description:
      "Язык древней культуры и современных технологий. Откройте мир аниме и манги.",
    culturalFact: "В японском три системы письма: хирагана, катакана и кандзи",
    students: 3987,
  },
  {
    id: "zh",
    name: "Китайский",
    flag: "🇨🇳",
    color: "#f97316",
    description:
      "Язык самой быстрорастущей экономики. Начните говорить с 1.3 миллиардами людей.",
    culturalFact:
      "Китайский - самый распространенный язык в мире по числу носителей",
    students: 2876,
  },
]);

const currentLanguage = ref(languages.value[0]);

// AI Меню
const isAIMenuOpen = ref(false);

const toggleAIMenu = () => {
  isAIMenuOpen.value = !isAIMenuOpen.value;
};

const getRecommendations = () => {
  console.log("Get AI Recommendations");
  isAIMenuOpen.value = false;
  // Здесь можно показать рекомендации
};

const startPronunciation = () => {
  console.log("Start Pronunciation Practice");
  isAIMenuOpen.value = false;
  // Практика произношения
};

const checkGrammar = () => {
  console.log("Check Grammar");
  isAIMenuOpen.value = false;
  // Проверка грамматики
};

// Этапы прогресса
const progressStages = ref([
  {
    stage: 1,
    title: "Основы",
    description: "Базовые фразы и грамматика",
    duration: "2-4 недели",
    skills: ["Приветствия", "Числа", "Основные глаголы"],
  },
  {
    stage: 2,
    title: "Повседневное общение",
    description: "Разговор на бытовые темы",
    duration: "1-2 месяца",
    skills: ["Еда", "Покупки", "Путешествия"],
  },
  {
    stage: 3,
    title: "Свободное общение",
    description: "Обсуждение сложных тем",
    duration: "3-6 месяцев",
    skills: ["Работа", "Культура", "Новости"],
  },
  {
    stage: 4,
    title: "Профессиональный уровень",
    description: "Владение как носитель",
    duration: "6-12 месяцев",
    skills: ["Переговоры", "Презентации", "Специализированная лексика"],
  },
]);

// Динамические стили через computed properties
const titleStyle = computed(() => ({
  background: `linear-gradient(135deg, ${
    currentLanguage.value.color
  }, ${getLighterColor(currentLanguage.value.color, 30)})`,
  "-webkit-background-clip": "text",
  "-webkit-text-fill-color": "transparent",
}));

const buttonStyle = computed(() => ({
  background: `linear-gradient(135deg, ${
    currentLanguage.value.color
  }, ${getLighterColor(currentLanguage.value.color, 20)})`,
  "box-shadow": `0 8px 32px ${currentLanguage.value.color}40`,
}));

const centerGlowStyle = computed(() => ({
  background: `radial-gradient(circle, ${currentLanguage.value.color}20 0%, transparent 70%)`,
}));

// Стили для орбит
const getOrbStyle = (index: number) => {
  const total = languages.value.length;
  const angle = (index / total) * Math.PI * 2;
  const radius = 120;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return {
    transform: `translate(${x}px, ${y}px)`,
    "--orb-color": languages.value[index].color,
    "--orb-x": `${x}px`, // добавляем переменные для анимации
    "--orb-y": `${y}px`,
  };
};

// Вспомогательные функции
const getLighterColor = (color: string, percent: number) => {
  return color + "CC";
};

const getStageStyle = (stage: any) => ({
  borderLeft:
    stage.stage === currentProgressStage.value
      ? `4px solid ${currentLanguage.value.color}`
      : "4px solid transparent",
});

// Обработчики
const handleLanguageSelect = (language: any) => {
  // Анимация перехода
  const oldLanguage = currentLanguage.value;
  currentLanguage.value = language;
  // Микро-задержка для плавности
  setTimeout(() => {
    // Можно добавить звук или вибрацию
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, 50);
};

const startQuickTest = () => {
  showTest.value = true;
};
</script>

<style lang="scss" scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.gradient-orbit {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.1;
  animation: orbitFloat 20s ease-in-out infinite,
    parallaxMove 30s ease-in-out infinite;

  &:nth-child(1) {
    width: 400px;
    height: 400px;
    background: linear-gradient(45deg, #8b5cf6, #10b981);
    top: -200px;
    right: -100px;
    animation-delay: 0s, -5s;
  }

  &:nth-child(2) {
    width: 300px;
    height: 300px;
    background: linear-gradient(45deg, #f59e0b, #ef4444);
    bottom: -150px;
    left: 20%;
    animation-delay: -7s, -12s;
  }

  &:nth-child(3) {
    width: 250px;
    height: 250px;
    background: linear-gradient(45deg, #06b6d4, #8b5cf6);
    top: 30%;
    left: -100px;
    animation-delay: -14s, -19s;
  }
}

@keyframes orbitFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes parallaxMove {
  0%,
  100% {
    transform: translateX(0px) translateY(0px);
  }
  25% {
    transform: translateX(20px) translateY(-15px);
  }
  50% {
    transform: translateX(-15px) translateY(10px);
  }
  75% {
    transform: translateX(10px) translateY(20px);
  }
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.hero__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
}

/* Текстовый блок */
.hero__text {
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 2rem;
    border: 1px solid rgba(139, 92, 246, 0.2);
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;

    .ai-sparkle {
      margin-left: 0.5rem;
      animation: sparkle 2s infinite;
    }

    /* AI Меню */
    .ai-menu {
      position: absolute;
      top: 100%;
      left: 0;
      width: 280px;
      background: rgba(26, 26, 26, 0.95);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 16px;
      padding: 1rem;
      margin-top: 0.5rem;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      z-index: 1000;

      &::before {
        content: "";
        position: absolute;
        top: -5px;
        left: 20px;
        width: 10px;
        height: 10px;
        background: rgba(26, 26, 26, 0.95);
        border-left: 1px solid rgba(139, 92, 246, 0.3);
        border-top: 1px solid rgba(139, 92, 246, 0.3);
        transform: rotate(45deg);
      }
    }

    .ai-menu-header {
      text-align: center;
      margin-bottom: 1rem;

      h4 {
        color: #f8fafc;
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
      }

      p {
        color: #94a3b8;
        margin: 0;
        font-size: 0.9rem;
      }
    }

    .ai-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ai-action {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      background: transparent;
      border: 1px solid rgba(139, 92, 246, 0.2);
      color: #f8fafc;
      padding: 0.75rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(139, 92, 246, 0.1);
        border-color: rgba(139, 92, 246, 0.5);
        transform: translateX(5px);

        .ai-icon {
          transform: scale(1.2);
        }
      }

      .ai-icon {
        font-size: 1.2rem;
        transition: all 0.3s ease;
      }

      .ai-text {
        font-weight: 500;
        font-size: 0.9rem;
      }
    }

    /* Анимации */
    @keyframes sparkle {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.1);
      }
    }

    .ai-menu-enter-active {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .ai-menu-leave-active {
      transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .ai-menu-enter-from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }

    .ai-menu-leave-to {
      opacity: 0;
      transform: translateY(-5px) scale(0.98);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      background: #8b5cf6;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    &:hover {
      transform: translateY(-2px);
      background: rgba(139, 92, 246, 0.15);
      border-color: rgba(139, 92, 246, 0.4);
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);

      .badge-dot {
        animation: pulse 1s infinite;
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3);
      }
    }
  }
}

.hero__title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;

  .title-gradient {
    background: linear-gradient(135deg, #f8fafc, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .title-dynamic {
    transition: all 0.5s ease;
  }
}

.hero__description {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 500px;
}

/* CTA кнопки */
.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.cta-btn {
  position: relative;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &.primary {
    color: white;

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(139, 92, 246, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.1);

      .btn-text {
        letter-spacing: 0.5px;
      }

      .btn-arrow {
        transform: translateX(4px) scale(1.2);
      }
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
      z-index: 2;
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-2px);

      .btn-shine {
        left: 100%;
      }

      .btn-arrow {
        transform: translateX(3px);
      }
    }
  }

  &.secondary {
    background: transparent;
    color: #f8fafc;
    border: 2px solid #374151;

    &:hover {
      border-color: #8b5cf6;
      transform: translateY(-2px);
    }
  }

  .btn-text {
    transition: all 0.3s ease;
  }

  .btn-arrow {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

/* Статистика */
.hero-stats {
  display: flex;
  gap: 2rem;

  .stat-item {
    text-align: center;
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 12px;

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-3px);

      .stat-number {
        background: linear-gradient(135deg, #f8fafc, #cbd5e1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .stat-label {
      font-size: 0.9rem;
      color: #94a3b8;
    }
  }
}

/* Сфера языков */
.hero__visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.language-sphere {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.language-orb {
  position: absolute;
  width: 80px;
  height: 80px;
  background: #1a1a1a;
  border: 2px solid #374151;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    transform: scale(1.15) translateZ(10px);
    border-color: var(--orb-color);
    box-shadow: 0 0 0 1px var(--orb-color), 0 8px 32px var(--orb-color) 40,
      0 0 40px var(--orb-color) 20;

    .orb-glow {
      opacity: 0.3;
      filter: blur(8px);
    }

    .orb-flag {
      transform: scale(1.2) rotate(5deg);
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }
  }

  .orb-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 2;
  }

  .orb-flag {
    font-size: 1.5rem;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .orb-name {
    font-size: 0.7rem;
    font-weight: 600;
    color: #f8fafc;
    white-space: nowrap;
  }

  .orb-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  &.orb-active {
    border-color: var(--orb-color);
    box-shadow: 0 0 20px var(--orb-color);

    .orb-glow {
      opacity: 0.2;
    }
  }
}

.sphere-center {
  width: 120px;
  height: 120px;
  background: #1a1a1a;
  border: 2px solid #374151;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .center-glow {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    z-index: 1;
  }

  .center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;

    .center-flag {
      font-size: 2rem;
    }

    .center-text {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
    }
  }
}

/* Прогресс навыков */
.skills-progress {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid #374151;
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    color: #f8fafc;
    font-size: 1.3rem;
    margin: 0;
  }

  .progress-level {
    color: #94a3b8;
    font-size: 0.9rem;
  }
}

.progress-track {
  height: 8px;
  background: #374151;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  position: relative;
  transition: width 0.3s ease;
}

.progress-pulse {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: rgba(255, 255, 255, 0.6);
  animation: pulse 2s infinite;
}

.progress-milestones {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.milestone {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;

  .milestone-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .milestone-info {
    .milestone-title {
      color: #f8fafc;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .milestone-duration {
      color: #94a3b8;
      font-size: 0.8rem;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.03);

    .milestone-marker {
      transform: scale(1.3);
      box-shadow: 0 0 15px currentColor;
    }

    .milestone-title {
      color: #f8fafc;
    }
  }

  &.milestone-active {
    .milestone-marker {
      box-shadow: 0 0 10px currentColor;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Адаптивность */
@media (max-width: 1024px) {
  .hero__content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .language-sphere {
    transform: scale(0.8);
  }
}

@media (max-width: 768px) {
  .hero__title {
    font-size: 2.5rem;
  }

  .progress-milestones {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-btn {
    width: 100%;
    max-width: 300px;
  }
}

// Добавить в конец стилей
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: translate(var(--orb-x, 0), var(--orb-y, 0)) scale(0.8); // учитываем позицию
  }
  to {
    opacity: 1;
    transform: translate(var(--orb-x, 0), var(--orb-y, 0)) scale(1); // учитываем позицию
  }
}

// Применить анимации к элементам
.hero__text {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.language-sphere {
  animation: scaleIn 0.8s ease-out 0.4s both;
}

.skills-progress {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

// Анимация для каждого языкового орба
.language-orb {
  @for $i from 1 through 6 {
    &:nth-child(#{$i}) {
      animation: scaleIn 0.5s ease-out #{$i * 0.1 + 0.4}s both;
    }
  }
}
</style>
