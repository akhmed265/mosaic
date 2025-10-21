<template>
  <div class="ai-overlay" v-if="isOpen" @click.self="close">
    <div class="ai-container pronunciation-container">
      <!-- Заголовок -->
      <div class="ai-header">
        <div class="header-content">
          <div class="title-section">
            <h3>🎤 Проверка произношения</h3>
            <p>
              Практикуйте речь и улучшайте акцент в {{ currentLanguage.name }}
            </p>
          </div>
          <button class="close-btn" @click="close">×</button>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="pronunciation-content">
        <!-- Фраза для произношения -->
        <div class="phrase-section">
          <div class="phrase-card">
            <div class="phrase-text">
              {{ currentPhrase.text }}
            </div>
            <div class="phrase-translation">
              {{ currentPhrase.translation }}
            </div>
            <div class="phrase-hint">
              <span class="hint-icon">💡</span>
              {{ currentPhrase.hint }}
            </div>
          </div>
        </div>

        <!-- Визуализатор голоса -->
        <div class="visualizer-section">
          <div class="visualizer" ref="visualizer">
            <div
              v-for="(bar, index) in voiceBars"
              :key="index"
              class="voice-bar"
              :style="{ height: bar.height + 'px', background: bar.color }"
            ></div>
          </div>

          <!-- Индикатор записи -->
          <div class="recording-indicator" :class="{ active: isRecording }">
            <div class="pulse"></div>
            <span>{{ isRecording ? "Запись..." : "Готов к записи" }}</span>
          </div>
        </div>

        <!-- Оценка произношения -->
        <div class="score-section">
          <div class="score-card">
            <div class="score-circle">
              <div class="score-value">{{ overallScore }}%</div>
              <div class="score-label">Общая оценка</div>
            </div>

            <div class="score-details">
              <div class="score-item">
                <span class="label">Точность:</span>
                <span class="value">{{ accuracyScore }}%</span>
              </div>
              <div class="score-item">
                <span class="label">Плавность:</span>
                <span class="value">{{ fluencyScore }}%</span>
              </div>
              <div class="score-item">
                <span class="label">Интонация:</span>
                <span class="value">{{ intonationScore }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Управление записью -->
        <div class="controls-section">
          <button
            class="record-btn"
            :class="{ recording: isRecording, analyzing: isAnalyzing }"
            @click="toggleRecording"
            :disabled="isAnalyzing"
          >
            <span class="btn-icon">
              <span v-if="isRecording">⏹️</span>
              <span v-else-if="isAnalyzing">🔍</span>
              <span v-else>🎤</span>
            </span>
            <span class="btn-text">
              {{
                isRecording
                  ? "Остановить запись"
                  : isAnalyzing
                  ? "Анализ..."
                  : "Начать запись"
              }}
            </span>
          </button>

          <button
            class="play-btn"
            @click="playSample"
            :disabled="isRecording || isAnalyzing"
          >
            <span class="btn-icon">🔊</span>
            <span class="btn-text">Образец</span>
          </button>
        </div>

        <!-- Советы по улучшению -->
        <div class="tips-section" v-if="improvementTips.length > 0">
          <h4>🎯 Советы по улучшению:</h4>
          <div class="tips-list">
            <div
              v-for="(tip, index) in improvementTips"
              :key="index"
              class="tip-item"
            >
              <span class="tip-icon">💡</span>
              <span class="tip-text">{{ tip }}</span>
            </div>
          </div>
        </div>

        <!-- Следующая фраза -->
        <div class="next-section">
          <button
            class="next-btn"
            @click="nextPhrase"
            :disabled="isRecording || isAnalyzing"
          >
            <span class="btn-icon">➡️</span>
            <span class="btn-text">Следующая фраза</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Phrase {
  id: number;
  text: string;
  translation: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

interface PronunciationScore {
  overall: number;
  accuracy: number;
  fluency: number;
  intonation: number;
}

const props = defineProps<{
  isOpen: boolean;
  currentLanguage: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Состояния
const isRecording = ref(false);
const isAnalyzing = ref(false);
const audioContext = ref<AudioContext | null>(null);
const analyser = ref<AnalyserNode | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const visualizer = ref<HTMLElement>();

// Данные
const currentPhrase = ref<Phrase>({
  id: 1,
  text: "Hello, how are you today?",
  translation: "Привет, как у тебя дела сегодня?",
  hint: "Обратите внимание на интонацию в вопросе",
  difficulty: "easy",
});

const voiceBars = ref<Array<{ height: number; color: string }>>([]);
const improvementTips = ref<string[]>([]);

// Оценки
const overallScore = ref(0);
const accuracyScore = ref(0);
const fluencyScore = ref(0);
const intonationScore = ref(0);

// Фразы для практики
const practicePhrases = ref<Phrase[]>([
  {
    id: 1,
    text: "Hello, how are you today?",
    translation: "Привет, как у тебя дела сегодня?",
    hint: "Обратите внимание на интонацию в вопросе",
    difficulty: "easy",
  },
  {
    id: 2,
    text: "I would like to order a coffee, please",
    translation: "Я бы хотел заказать кофе, пожалуйста",
    hint: "Произнесите вежливо, с правильным ударением",
    difficulty: "medium",
  },
  {
    id: 3,
    text: "Could you tell me where the nearest station is?",
    translation: "Не могли бы вы сказать, где ближайшая станция?",
    hint: "Следите за плавностью произношения",
    difficulty: "hard",
  },
  {
    id: 4,
    text: "The weather is beautiful today, isn't it?",
    translation: "Погода сегодня прекрасная, не так ли?",
    hint: "Используйте восходящую интонацию в конце",
    difficulty: "medium",
  },
]);

// Компьютед свойства
const currentDifficulty = computed(() => {
  const difficulties = {
    easy: "Легкий",
    medium: "Средний",
    hard: "Сложный",
  };
  return difficulties[currentPhrase.value.difficulty];
});

// Методы
const close = () => {
  stopRecording();
  emit("close");
};

const initAudio = async () => {
  try {
    audioContext.value = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    analyser.value = audioContext.value.createAnalyser();
    analyser.value.fftSize = 256;

    // Инициализируем визуализатор
    initVisualizer();
  } catch (error) {
    console.error("Error initializing audio:", error);
  }
};

const initVisualizer = () => {
  // Создаем 32 бара для визуализации
  voiceBars.value = Array.from({ length: 32 }, () => ({
    height: 2,
    color: "#8b5cf6",
  }));
};

const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording();
    await analyzePronunciation();
  } else {
    await startRecording();
  }
};

const startRecording = async () => {
  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    if (audioContext.value && analyser.value) {
      const source = audioContext.value.createMediaStreamSource(
        mediaStream.value
      );
      source.connect(analyser.value);

      isRecording.value = true;
      startVisualization();
    }
  } catch (error) {
    console.error("Error starting recording:", error);
    alert("Не удалось получить доступ к микрофону. Проверьте разрешения.");
  }
};

const stopRecording = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
  isRecording.value = false;
  stopVisualization();
};

const startVisualization = () => {
  if (!analyser.value) return;

  const bufferLength = analyser.value.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const updateVisualizer = () => {
    if (!isRecording.value || !analyser.value) return;

    analyser.value.getByteFrequencyData(dataArray);

    // Обновляем высоту баров
    const barCount = voiceBars.value.length;
    for (let i = 0; i < barCount; i++) {
      const value = dataArray[Math.floor((i * bufferLength) / barCount)];
      voiceBars.value[i].height = Math.max(2, value / 2);

      // Меняем цвет в зависимости от интенсивности
      const intensity = value / 255;
      if (intensity > 0.7) {
        voiceBars.value[i].color = "#ef4444";
      } else if (intensity > 0.4) {
        voiceBars.value[i].color = "#f59e0b";
      } else {
        voiceBars.value[i].color = "#8b5cf6";
      }
    }

    requestAnimationFrame(updateVisualizer);
  };

  updateVisualizer();
};

const stopVisualization = () => {
  // Сбрасываем бары к минимальной высоте
  voiceBars.value.forEach((bar) => {
    bar.height = 2;
    bar.color = "#8b5cf6";
  });
};

const analyzePronunciation = async () => {
  isAnalyzing.value = true;

  // Имитация анализа AI (в реальности здесь будет вызов API)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Генерируем случайные оценки
  accuracyScore.value = Math.floor(Math.random() * 30) + 70;
  fluencyScore.value = Math.floor(Math.random() * 25) + 65;
  intonationScore.value = Math.floor(Math.random() * 20) + 70;
  overallScore.value = Math.round(
    (accuracyScore.value + fluencyScore.value + intonationScore.value) / 3
  );

  // Генерируем советы
  generateImprovementTips();

  isAnalyzing.value = false;
};

const generateImprovementTips = () => {
  const tips = [
    "Попробуйте говорить медленнее и четче",
    "Обратите внимание на ударение в словах",
    "Практикуйте восходящую интонацию в вопросах",
    "Следите за плавностью речи между словами",
    "Попробуйте записать себя и послушать",
  ];

  improvementTips.value = tips.sort(() => Math.random() - 0.5).slice(0, 3);
};

const playSample = () => {
  // В реальности здесь будет воспроизведение образца произношения
  const utterance = new SpeechSynthesisUtterance(currentPhrase.value.text);
  utterance.lang = props.currentLanguage.code === "en" ? "en-US" : "es-ES";
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
};

const nextPhrase = () => {
  const currentIndex = practicePhrases.value.findIndex(
    (p) => p.id === currentPhrase.value.id
  );
  const nextIndex = (currentIndex + 1) % practicePhrases.value.length;
  currentPhrase.value = practicePhrases.value[nextIndex];

  // Сбрасываем оценки и советы
  resetScores();
};

const resetScores = () => {
  overallScore.value = 0;
  accuracyScore.value = 0;
  fluencyScore.value = 0;
  intonationScore.value = 0;
  improvementTips.value = [];
};

// Жизненный цикл
onMounted(() => {
  initAudio();
});

onUnmounted(() => {
  stopRecording();
  if (audioContext.value) {
    audioContext.value.close();
  }
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

.pronunciation-container {
  width: 100%;
  max-width: 500px;
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
}

.pronunciation-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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

.phrase-section {
  .phrase-card {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;

    .phrase-text {
      color: #f8fafc;
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .phrase-translation {
      color: #94a3b8;
      font-size: 1rem;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .phrase-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #f59e0b;
      font-size: 0.9rem;

      .hint-icon {
        font-size: 1rem;
      }
    }
  }
}

.visualizer-section {
  .visualizer {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 2px;
    height: 80px;
    margin-bottom: 1rem;

    .voice-bar {
      width: 6px;
      border-radius: 3px 3px 0 0;
      transition: height 0.1s ease, background 0.3s ease;
    }
  }

  .recording-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #94a3b8;
    font-size: 0.9rem;

    &.active {
      color: #ef4444;

      .pulse {
        width: 12px;
        height: 12px;
        background: #ef4444;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }
    }
  }
}

.score-section {
  .score-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 1.5rem;

    .score-circle {
      text-align: center;
      min-width: 80px;

      .score-value {
        color: #f8fafc;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      .score-label {
        color: #94a3b8;
        font-size: 0.8rem;
      }
    }

    .score-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .score-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .value {
          color: #f8fafc;
          font-weight: 600;
        }
      }
    }
  }
}

.controls-section {
  display: flex;
  gap: 1rem;
  justify-content: center;

  .record-btn,
  .play-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .record-btn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    flex: 2;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }

    &.recording {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    &.analyzing {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }
  }

  .play-btn {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #f8fafc;
    flex: 1;

    &:hover:not(:disabled) {
      background: rgba(139, 92, 246, 0.2);
      transform: translateY(-1px);
    }
  }
}

.tips-section {
  h4 {
    color: #f8fafc;
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;

      .tip-icon {
        font-size: 1rem;
        flex-shrink: 0;
      }

      .tip-text {
        color: #f8fafc;
        font-size: 0.9rem;
        line-height: 1.4;
      }
    }
  }
}

.next-section {
  display: flex;
  justify-content: center;

  .next-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #f8fafc;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background: rgba(139, 92, 246, 0.2);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
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

.pronunciation-container {
  animation: fadeIn 0.4s ease;
}
</style>
