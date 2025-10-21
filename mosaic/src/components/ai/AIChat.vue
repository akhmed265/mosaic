<template>
  <div class="ai-chat-overlay" v-if="isOpen" @click.self="close">
    <div class="ai-chat-container">
      <!-- Заголовок -->
      <div class="chat-header">
        <div class="ai-avatar">
          <span class="ai-emoji">🤖</span>
          <div class="ai-status"></div>
        </div>
        <div class="chat-info">
          <h3>AI Language Assistant</h3>
          <p>Готов помочь с {{ currentLanguage.name.toLowerCase() }}</p>
        </div>
        <button class="close-btn" @click="close">×</button>
      </div>

      <!-- Сообщения -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.type]"
        >
          <div class="message-content">
            {{ msg.text }}
          </div>
          <div class="message-time">
            {{ formatTime(msg.timestamp) }}
          </div>
        </div>

        <!-- Индикатор печати -->
        <div v-if="isTyping" class="message ai typing">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Быстрые действия -->
      <div class="quick-actions">
        <button
          v-for="action in quickActions"
          :key="action.text"
          class="quick-action"
          @click="sendQuickMessage(action.text)"
        >
          {{ action.text }}
        </button>
      </div>

      <!-- Ввод сообщения -->
      <div class="chat-input-container">
        <div class="input-wrapper">
          <input
            v-model="userInput"
            placeholder="Спросите о языке, грамматике, переведите..."
            @keyup.enter="sendMessage"
            ref="inputField"
          />
          <button
            class="send-btn"
            @click="sendMessage"
            :disabled="!userInput.trim()"
          >
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";

interface Message {
  id: number;
  text: string;
  type: "user" | "ai";
  timestamp: Date;
}

const props = defineProps<{
  isOpen: boolean;
  currentLanguage: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Состояния
const messages = ref<Message[]>([
  {
    id: 1,
    text: `Привет! Я ваш AI-помощник для изучения ${props.currentLanguage.name.toLowerCase()}. Могу помочь с переводом, грамматикой, произношением и практикой языка. С чего начнем?`,
    type: "ai",
    timestamp: new Date(),
  },
]);
const userInput = ref("");
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement>();
const inputField = ref<HTMLInputElement>();

// Быстрые действия
const quickActions = ref([
  { text: 'Переведи "Привет, как дела?"' },
  { text: "Объясни базовую грамматику" },
  { text: "Дай пример диалога" },
  { text: "Популярные фразы" },
]);

// Методы
const close = () => {
  emit("close");
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // Добавляем сообщение пользователя
  const userMessage: Message = {
    id: Date.now(),
    text: userInput.value,
    type: "user",
    timestamp: new Date(),
  };
  messages.value.push(userMessage);

  const userText = userInput.value;
  userInput.value = "";

  // Показываем индикатор печати
  isTyping.value = true;
  scrollToBottom();

  // Имитируем ответ AI (в реальности здесь будет API вызов)
  setTimeout(() => {
    const aiResponse = generateAIResponse(userText);
    const aiMessage: Message = {
      id: Date.now() + 1,
      text: aiResponse,
      type: "ai",
      timestamp: new Date(),
    };
    messages.value.push(aiMessage);
    isTyping.value = false;
    scrollToBottom();
  }, 1500);
};

const sendQuickMessage = (text: string) => {
  userInput.value = text;
  sendMessage();
};

const generateAIResponse = (userText: string): string => {
  // Временная заглушка - в реальности здесь будет вызов к OpenAI API
  const responses = {
    en: [
      "Отличный вопрос! Вот перевод: 'Hello, how are you?' - это стандартное приветствие в английском.",
      "Базовая грамматика английского включает времена: Present Simple (I work), Past Simple (I worked), Future Simple (I will work).",
      "Пример диалога:\n- Hi, how are you?\n- I'm good, thanks! And you?\n- Great! What are you doing today?",
      "Популярные фразы: 'How are you?', 'Thank you', 'You're welcome', 'Excuse me', 'I'm sorry'",
    ],
    es: [
      "¡Hola! La traducción es: 'Hola, ¿cómo estás?' - saludo común en español.",
      "La gramática básica incluye: presente (yo trabajo), pasado (yo trabajé), futuro (yo trabajaré).",
      "Ejemplo de diálogo:\n- Hola, ¿cómo estás?\n- Estoy bien, ¡gracias! ¿Y tú?\n- ¡Genial! ¿Qué haces hoy?",
      "Frases populares: '¿Cómo estás?', 'Gracias', 'De nada', 'Perdón', 'Lo siento'",
    ],
    // Добавь для других языков
  };

  const langResponses =
    responses[props.currentLanguage.id as keyof typeof responses] ||
    responses.en;
  return langResponses[Math.floor(Math.random() * langResponses.length)];
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Автофокус на инпут при открытии
onMounted(() => {
  if (props.isOpen && inputField.value) {
    inputField.value.focus();
  }
});
</script>

<style lang="scss" scoped>
.ai-chat-overlay {
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

.ai-chat-container {
  width: 100%;
  max-width: 500px;
  height: 600px;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  background: rgba(15, 15, 15, 0.8);

  .ai-avatar {
    position: relative;

    .ai-emoji {
      font-size: 2rem;
      filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
    }

    .ai-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      border: 2px solid #1a1a1a;
    }
  }

  .chat-info {
    flex: 1;

    h3 {
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
      font-size: 1.2rem;
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

.chat-messages {
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

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;

  &.user {
    align-self: flex-end;
    align-items: flex-end;

    .message-content {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }
  }

  &.ai {
    align-self: flex-start;
    align-items: flex-start;

    .message-content {
      background: rgba(255, 255, 255, 0.05);
      color: #f8fafc;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }
  }

  .message-content {
    padding: 0.75rem 1rem;
    border-radius: 18px;
    font-size: 0.9rem;
    line-height: 1.4;
    white-space: pre-line;
  }

  .message-time {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }

  &.typing {
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 18px;

      span {
        width: 6px;
        height: 6px;
        background: #94a3b8;
        border-radius: 50%;
        animation: typing 1.4s infinite;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
  flex-wrap: wrap;

  .quick-action {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #f8fafc;
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
      transform: translateY(-1px);
    }
  }
}

.chat-input-container {
  padding: 1rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  background: rgba(15, 15, 15, 0.8);
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    color: #f8fafc;
    font-size: 0.9rem;

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      outline: none;
      border-color: rgba(139, 92, 246, 0.6);
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
    }
  }

  .send-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border: none;
    color: white;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    span {
      font-size: 1rem;
    }
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-chat-container {
  animation: fadeIn 0.3s ease;
}
</style>
