<template>
  <section class="hero">
    <div class="container">
      <div class="hero__content">
        
        <!-- Текстовый блок -->
        <div class="hero__text">
          <h1 class="hero__title">
            <span class="title__static">Изучайте </span>
            <span class="title__dynamic" :style="titleStyle">{{ currentLanguage.name }}</span>
            <br>
            <span class="title__sub">с персональным подходом</span>
          </h1>
          
          <p class="hero__description">
            {{ currentLanguage.description }}
          </p>

          <!-- Быстрый тест -->
          <div class="quick-test">
            <h3>Подберем идеальный курс за 2 минуты</h3>
            <button class="test-btn" @click="startQuickTest" :style="buttonStyle">
              Начать тест
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Визуальный блок с пазлами - ФИКСИРОВАННАЯ ШИРИНА -->
        <div class="hero__visual">
          <div class="puzzle-grid" :style="gridStyle">
            <PuzzleFlag
              v-for="(language, index) in languages"
              :key="language.id"
              :language="language"
              :is-selected="currentLanguage.id === language.id"
              :shape="getPuzzleShape(language.id, index)"
              :position="index + 1"
              @select="handleLanguageSelect"
            />
          </div>
        </div>
      </div>

      <!-- Волна прогресса -->
      <div class="progress-section">
        <h3 :style="{ color: currentLanguage.color }">Ваш путь к свободному владению языком</h3>
        <div class="progress-wave" :style="waveStyle"></div>
        <div class="stages">
          <div 
            v-for="stage in progressStages" 
            :key="stage.stage"
            class="stage"
            :style="getStageStyle(stage)"
          >
            <div class="stage-number" :style="stageNumberStyle">{{ stage.stage }}</div>
            <div class="stage-info">
              <h4>{{ stage.title }}</h4>
              <p>{{ stage.description }}</p>
              <div class="stage-duration">{{ stage.duration }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <QuickTestWizard 
      :is-open="showTest"
      @close="showTest = false"
      @complete="handleTestComplete"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PuzzleFlag from '@/components/hero/PuzzleFlag.vue'
import QuickTestWizard from '@/components/hero/QuickTestWizard.vue'


const handleTestComplete = (result: any) => {
  console.log('Результат теста:', result)
  // Здесь можно добавить логику обработки результата
  showTest.value = false
}

// Состояния
const showTest = ref(false)
const currentProgressStage = ref(1)

// Данные языков
const languages = ref([
  {
    id: 'en',
    name: 'Английский',
    flag: '🇬🇧',
    color: '#8b5cf6',
    description: 'Международный язык бизнеса и путешествий. Откройте мир новых возможностей.',
    culturalFact: 'В английском больше слов, чем в любом другом языке - около 750,000',
    students: 12543
  },
  {
    id: 'es',
    name: 'Испанский',
    flag: '🇪🇸', 
    color: '#10b981',
    description: 'Язык страсти и культуры. Говорите с 500 миллионами людей по всему миру.',
    culturalFact: 'Испанский - второй по распространенности родной язык в мире',
    students: 8432
  },
  {
    id: 'fr',
    name: 'Французский',
    flag: '🇫🇷',
    color: '#f59e0b',
    description: 'Язык любви и дипломатии. Погрузитесь в богатую культуру Франции.',
    culturalFact: 'Французский - официальный язык 29 стран',
    students: 5678
  },
  {
    id: 'de',
    name: 'Немецкий',
    flag: '🇩🇪',
    color: '#ef4444',
    description: 'Язык инноваций и технологий. Откройте двери в европейский бизнес.',
    culturalFact: 'Немецкий - самый распространенный родной язык в Европе',
    students: 4321
  },
  {
    id: 'ja',
    name: 'Японский',
    flag: '🇯🇵',
    color: '#06b6d4',
    description: 'Язык древней культуры и современных технологий. Откройте мир аниме и манги.',
    culturalFact: 'В японском три системы письма: хирагана, катакана и кандзи',
    students: 3987
  },
  {
    id: 'zh',
    name: 'Китайский',
    flag: '🇨🇳',
    color: '#f97316',
    description: 'Язык самой быстрорастущей экономики. Начните говорить с 1.3 миллиардами людей.',
    culturalFact: 'Китайский - самый распространенный язык в мире по числу носителей',
    students: 2876
  }
])

const currentLanguage = ref(languages.value[0])

// Этапы прогресса
const progressStages = ref([
  {
    stage: 1,
    title: 'Основы',
    description: 'Базовые фразы и грамматика',
    duration: '2-4 недели',
    skills: ['Приветствия', 'Числа', 'Основные глаголы']
  },
  {
    stage: 2, 
    title: 'Повседневное общение',
    description: 'Разговор на бытовые темы',
    duration: '1-2 месяца',
    skills: ['Еда', 'Покупки', 'Путешествия']
  },
  {
    stage: 3,
    title: 'Свободное общение',
    description: 'Обсуждение сложных тем',
    duration: '3-6 месяцев', 
    skills: ['Работа', 'Культура', 'Новости']
  },
  {
    stage: 4,
    title: 'Профессиональный уровень',
    description: 'Владение как носитель',
    duration: '6-12 месяцев',
    skills: ['Переговоры', 'Презентации', 'Специализированная лексика']
  }
])

// Динамические стили через computed properties
const titleStyle = computed(() => ({
  background: `linear-gradient(135deg, ${currentLanguage.value.color}, ${getLighterColor(currentLanguage.value.color, 30)})`,
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  'background-clip': 'text'
}))

const buttonStyle = computed(() => ({
  background: `linear-gradient(135deg, ${currentLanguage.value.color}, ${getLighterColor(currentLanguage.value.color, 20)})`
}))

const waveStyle = computed(() => ({
  background: `linear-gradient(90deg, ${currentLanguage.value.color}, ${getLighterColor(currentLanguage.value.color, 40)})`
}))

const stageNumberStyle = computed(() => ({
  background: currentLanguage.value.color
}))

// ФИКСИРОВАННАЯ ШИРИНА ДЛЯ СЕТКИ - чтобы не скакала
const gridStyle = computed(() => ({
  minWidth: '400px', // Фиксированная ширина
  width: '400px'
}))

// Функция для определения формы пазла с учетом длинных названий
const getPuzzleShape = (languageId: string, index: number) => {
  // Для французского используем более компактную форму
  if (languageId === 'fr') return 'circle' // Круг лучше для длинных названий
  
  const shapes = ['square', 'circle', 'diamond', 'hexagon']
  return shapes[index % shapes.length]
}

// Вспомогательные функции
const getLighterColor = (color: string, percent: number) => {
  return color + 'CC'
}

const getStageStyle = (stage: any) => ({
  borderLeft: stage.stage === currentProgressStage.value ? `4px solid ${currentLanguage.value.color}` : '4px solid transparent'
})

// Обработчики
const handleLanguageSelect = (language: any) => {
  currentLanguage.value = language
}

const startQuickTest = () => {
  showTest.value = true
}
</script>

<style lang="scss" scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.hero__content {
  display: grid;
  grid-template-columns: 1fr auto; /* Изменено на auto для фиксированной ширины */
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
}

.hero__text {
  min-width: 0; /* Предотвращает сжатие текста */

  .hero__title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    
    .title__static {
      color: #f8fafc;
    }
    
    .title__dynamic {
      transition: all 0.5s ease;
      display: inline-block;
      min-width: 200px; /* Фиксированная минимальная ширина */
    }
    
    .title__sub {
      color: #94a3b8;
      font-size: 2.5rem;
    }
  }

  .hero__description {
    font-size: 1.2rem;
    color: #94a3b8;
    margin-bottom: 2.5rem;
    line-height: 1.6;
    max-width: 500px;
  }
}

.quick-test {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2d2d2d;
  max-width: 400px;
  
  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.test-btn {
  color: #f8fafc;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
}

.btn-arrow {
  transition: transform 0.3s ease;
}

/* ФИКСИРОВАННАЯ СЕТКА ПАЗЛОВ */
.hero__visual {
  flex-shrink: 0; /* Запрещаем сжатие */
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  justify-items: center;
  align-items: center;
  width: 400px; /* Фиксированная ширина */
  height: 280px; /* Фиксированная высота */
  position: relative;
}

.progress-section {
  margin-top: 3rem;
  
  h3 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    font-weight: 600;
    min-height: 2rem; /* Фиксированная высота для заголовка */
  }
}

.progress-wave {
  height: 100px;
  border-radius: 50% 50% 0 0;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.stages {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stage {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
}

.stage-number {
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.stage-info {
  h4 {
    color: #f8fafc;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  p {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .stage-duration {
    color: #8b5cf6;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

/* Адаптивность */
@media (max-width: 1024px) {
  .hero__content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .hero__visual {
    order: -1;
  }
  
  .puzzle-grid {
    margin: 0 auto;
  }
  
  .hero__description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .quick-test {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>