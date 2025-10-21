<template>
  <div class="ai-overlay" v-if="isOpen" @click.self="close">
    <div class="ai-container recommendations-container">
      <!-- Заголовок -->
      <div class="ai-header">
        <div class="header-content">
          <div class="title-section">
            <h3>🎯 Персональные рекомендации</h3>
            <p>На основе вашего прогресса в {{ currentLanguage.name }}</p>
          </div>
          <button class="close-btn" @click="close">×</button>
        </div>

        <!-- Прогресс -->
        <div class="progress-section">
          <div class="progress-ring">
            <div class="ring-bg"></div>
            <div class="ring-progress" :style="progressStyle"></div>
            <div class="progress-text">
              <span class="percentage">{{ userProgress.overall }}%</span>
              <span class="label">Общий прогресс</span>
            </div>
          </div>

          <div class="progress-stats">
            <div class="stat">
              <span class="value">{{ userProgress.vocabulary }}</span>
              <span class="label">Слова</span>
            </div>
            <div class="stat">
              <span class="value">{{ userProgress.grammar }}</span>
              <span class="label">Грамматика</span>
            </div>
            <div class="stat">
              <span class="value">{{ userProgress.speaking }}</span>
              <span class="label">Разговор</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Рекомендации -->
      <div class="recommendations-list">
        <div
          v-for="rec in recommendations"
          :key="rec.id"
          :class="['rec-card', rec.priority]"
          @click="startActivity(rec)"
        >
          <div class="rec-icon">{{ rec.icon }}</div>
          <div class="rec-content">
            <div class="rec-header">
              <h4>{{ rec.title }}</h4>
              <span class="priority-badge" :class="rec.priority">
                {{ getPriorityText(rec.priority) }}
              </span>
            </div>
            <p class="rec-description">{{ rec.description }}</p>
            <div class="rec-meta">
              <span class="duration">⏱️ {{ rec.duration }} мин</span>
              <span class="level">📊 {{ rec.level }}</span>
            </div>
            <div class="rec-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: rec.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ rec.progress }}% освоено</span>
            </div>
          </div>
          <div class="rec-action">
            <button class="start-btn">→</button>
          </div>
        </div>
      </div>

      <!-- Быстрый старт -->
      <div class="quick-start">
        <h4>🚀 Быстрый старт</h4>
        <div class="quick-actions">
          <button
            v-for="action in quickActions"
            :key="action.text"
            class="quick-action"
            @click="startQuickAction(action)"
          >
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-text">{{ action.text }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Recommendation {
  id: number;
  icon: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  progress: number;
  priority: "high" | "medium" | "low";
  type: "vocabulary" | "grammar" | "speaking" | "listening";
}

interface UserProgress {
  overall: number;
  vocabulary: number;
  grammar: number;
  speaking: number;
  listening: number;
}

const props = defineProps<{
  isOpen: boolean;
  currentLanguage: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Прогресс пользователя
const userProgress = ref<UserProgress>({
  overall: 45,
  vocabulary: 60,
  grammar: 30,
  speaking: 25,
  listening: 65,
});

// Рекомендации
const recommendations = ref<Recommendation[]>([
  {
    id: 1,
    icon: "📚",
    title: "Базовые фразы для общения",
    description: "Изучите 50 самых важных фраз для повседневного общения",
    duration: 15,
    level: "Начинающий",
    progress: 20,
    priority: "high",
    type: "vocabulary",
  },
  {
    id: 2,
    icon: "⚡",
    title: "Present Simple Tense",
    description: "Освойте основное время для описания привычек и фактов",
    duration: 20,
    level: "Начинающий",
    progress: 45,
    priority: "high",
    type: "grammar",
  },
  {
    id: 3,
    icon: "🎤",
    title: "Практика произношения",
    description: "Потренируйте сложные звуки и интонации",
    duration: 10,
    level: "Начинающий",
    progress: 15,
    priority: "medium",
    type: "speaking",
  },
  {
    id: 4,
    icon: "👂",
    title: "Понимание на слух",
    description: "Прослушайте диалоги и выполните задания",
    duration: 12,
    level: "Начинающий",
    progress: 70,
    priority: "low",
    type: "listening",
  },
  {
    id: 5,
    icon: "💬",
    title: "Диалоги в кафе",
    description: "Разговорные фразы для заказа в кафе и ресторанах",
    duration: 18,
    level: "Начинающий",
    progress: 10,
    priority: "medium",
    type: "speaking",
  },
]);

// Быстрые действия
const quickActions = ref([
  { icon: "🔤", text: "Повторить слова", type: "vocabulary" },
  { icon: "📝", text: "Грамматический тест", type: "grammar" },
  { icon: "🎧", text: "Аудирование", type: "listening" },
  { icon: "🗣️", text: "Разговорная практика", type: "speaking" },
]);

// Компьютед свойства
const progressStyle = computed(() => ({
  background: `conic-gradient(#8b5cf6 ${
    userProgress.value.overall * 3.6
  }deg, transparent 0deg)`,
}));

// Методы
const close = () => {
  emit("close");
};

const startActivity = (rec: Recommendation) => {
  console.log("Starting activity:", rec.title);
  // Здесь будет логика запуска активности
  // Например, открытие соответствующего компонента
};

const startQuickAction = (action: any) => {
  console.log("Quick action:", action.text);
  // Быстрый старт активности
};

const getPriorityText = (priority: string) => {
  const texts = {
    high: "Высокий приоритет",
    medium: "Средний приоритет",
    low: "Низкий приоритет",
  };
  return texts[priority as keyof typeof texts];
};

// Загрузка данных (в реальности - API вызов)
onMounted(() => {
  // Имитация загрузки рекомендаций
  setTimeout(() => {
    // Обновляем прогресс
    userProgress.value = {
      overall: 52,
      vocabulary: 65,
      grammar: 35,
      speaking: 30,
      listening: 75,
    };
  }, 1000);
});
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

.recommendations-container {
  width: 100%;
  max-width: 600px;
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
    margin-bottom: 1.5rem;

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

  .progress-section {
    display: flex;
    align-items: center;
    gap: 2rem;

    .progress-ring {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);

      .ring-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
      }

      .ring-progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transition: all 1s ease;
      }

      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        .percentage {
          display: block;
          color: #f8fafc;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .label {
          display: block;
          color: #94a3b8;
          font-size: 0.7rem;
        }
      }
    }

    .progress-stats {
      display: flex;
      gap: 1.5rem;
      flex: 1;

      .stat {
        text-align: center;
        flex: 1;

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
}

.recommendations-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 2px;
  }
}

.rec-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    border-color: rgba(139, 92, 246, 0.5);
  }

  &.high {
    border-left: 4px solid #ef4444;
  }

  &.medium {
    border-left: 4px solid #f59e0b;
  }

  &.low {
    border-left: 4px solid #10b981;
  }

  .rec-icon {
    font-size: 2rem;
    width: 50px;
    text-align: center;
  }

  .rec-content {
    flex: 1;

    .rec-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;

      h4 {
        color: #f8fafc;
        margin: 0;
        font-size: 1rem;
        flex: 1;
      }

      .priority-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 8px;
        font-size: 0.7rem;
        font-weight: 500;

        &.high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        &.medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        &.low {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
      }
    }

    .rec-description {
      color: #94a3b8;
      font-size: 0.85rem;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }

    .rec-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;

      span {
        color: #64748b;
        font-size: 0.8rem;
      }
    }

    .rec-progress {
      .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.25rem;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #7c3aed);
          border-radius: 2px;
          transition: width 0.5s ease;
        }
      }

      .progress-text {
        color: #94a3b8;
        font-size: 0.75rem;
      }
    }
  }

  .rec-action {
    .start-btn {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      }
    }
  }
}

.quick-start {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  background: rgba(15, 15, 15, 0.8);

  h4 {
    color: #f8fafc;
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;

    .quick-action {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #f8fafc;
      padding: 0.75rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background: rgba(139, 92, 246, 0.2);
        transform: translateY(-1px);
      }

      .action-icon {
        font-size: 1.2rem;
      }

      .action-text {
        font-size: 0.85rem;
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

.recommendations-container {
  animation: fadeIn 0.4s ease;
}
</style>
