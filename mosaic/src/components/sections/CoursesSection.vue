<template>
  <section class="courses-section" id="courses">
    <div class="container">
      <!-- Заголовок раздела -->
      <div class="section-header">
        <h2>Популярные курсы</h2>
        <p>Выберите подходящий курс из нашей коллекции или продолжите начатое обучение</p>
      </div>

      <!-- Фильтры и поиск -->
      <div class="courses-controls">
        <div class="filters">
          <div class="filter-group">
            <label>Язык:</label>
            <select v-model="filters.language" @change="applyFilters">
              <option value="">Все языки</option>
              <option v-for="lang in availableLanguages" :key="lang" :value="lang">
                {{ lang }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Уровень:</label>
            <select v-model="filters.level" @change="applyFilters">
              <option value="">Все уровни</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Продолжающий</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Категория:</label>
            <select v-model="filters.category" @change="applyFilters">
              <option value="">Все категории</option>
              <option value="grammar">Грамматика</option>
              <option value="conversation">Разговорный</option>
              <option value="business">Бизнес</option>
              <option value="exam">Подготовка к экзаменам</option>
              <option value="travel">Для путешествий</option>
            </select>
          </div>
        </div>

        <div class="search-sort">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск курсов..." 
              @input="applyFilters"
            >
            <span class="search-icon">🔍</span>
          </div>

          <div class="sort-group">
            <label>Сортировка:</label>
            <select v-model="sortBy" @change="applySorting">
              <option value="popular">По популярности</option>
              <option value="rating">По рейтингу</option>
              <option value="newest">Сначала новые</option>
              <option value="price">По цене</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Статистика фильтров -->
      <div class="filter-stats">
        <span class="courses-count">
          Найдено курсов: {{ filteredCourses.length }}
        </span>
        <button 
          v-if="hasActiveFilters" 
          class="clear-filters" 
          @click="clearFilters"
        >
          ✕ Сбросить фильтры
        </button>
      </div>

      <!-- Сетка курсов -->
      <div class="courses-grid">
        <CourseCard 
          v-for="course in filteredCourses" 
          :key="course.id"
          :course="course"
          @select="handleCourseSelect"
        />
      </div>

      <!-- Кнопка "Показать еще" -->
      <div class="load-more" v-if="showLoadMore">
        <button class="load-more-btn" @click="loadMoreCourses">
          Показать еще курсы
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Course } from '@/types/courses'
import CourseCard from '@/components/courses/CourseCard.vue'

// Состояния
const searchQuery = ref('')
const sortBy = ref('popular')
const filters = ref({
  language: '',
  level: '',
  category: ''
})
const visibleCoursesCount = ref(6)

// Данные курсов
const courses = ref<Course[]>([
  {
    id: 'en-beginner',
    title: 'Английский для начинающих',
    language: 'Английский',
    flag: '🇬🇧',
    level: 'beginner',
    duration: '3 месяца',
    lessons: 48,
    students: 12450,
    rating: 4.8,
    price: 12900,
    originalPrice: 17900,
    image: '/images/courses/english-beginner.jpg',
    description: 'Полный курс для тех, кто только начинает изучать английский. Освойте базовую грамматику и лексику.',
    features: ['Интерактивные упражнения', 'Разговорная практика', 'Поддержка куратора', 'Сертификат'],
    instructor: {
      name: 'Анна Иванова',
      specialization: 'Эксперт по начальному обучению'
    },
    progress: 35,
    isFeatured: true,
    category: 'grammar'
  },
  {
    id: 'en-business',
    title: 'Бизнес-английский',
    language: 'Английский',
    flag: '🇬🇧',
    level: 'intermediate',
    duration: '2 месяца',
    lessons: 32,
    students: 8765,
    rating: 4.9,
    price: 18900,
    image: '/images/courses/business-english.jpg',
    description: 'Специализированный курс для делового общения. Переговоры, презентации, корпоративная лексика.',
    features: ['Деловая переписка', 'Подготовка к собеседованию', 'Кейсы из реальной практики'],
    instructor: {
      name: 'Максим Петров',
      specialization: 'Business English Coach'
    },
    category: 'business'
  },
  {
    id: 'es-beginner',
    title: 'Испанский с нуля',
    language: 'Испанский',
    flag: '🇪🇸',
    level: 'beginner',
    duration: '4 месяца',
    lessons: 56,
    students: 6543,
    rating: 4.7,
    price: 14900,
    image: '/images/courses/spanish-beginner.jpg',
    description: 'Погрузитесь в мир испанского языка и культуры. Идеально для путешествий и общения.',
    features: ['Испанская культура', 'Живые диалоги', 'Произношение', 'Музыка и кино'],
    instructor: {
      name: 'Карлос Родригес',
      specialization: 'Носитель языка'
    },
    progress: 0,
    category: 'conversation'
  },
  {
    id: 'fr-conversation',
    title: 'Французский для общения',
    language: 'Французский',
    flag: '🇫🇷',
    level: 'intermediate',
    duration: '3 месяца',
    lessons: 36,
    students: 4321,
    rating: 4.6,
    price: 16900,
    image: '/images/courses/french-conversation.jpg',
    description: 'Разговорный курс для тех, кто хочет свободно общаться на французском.',
    features: ['Разговорные клубы', 'Французский сленг', 'Культурные особенности', 'Аудирование'],
    instructor: {
      name: 'Софи Мартен',
      specialization: 'Преподаватель с 10-летним опытом'
    },
    category: 'conversation'
  },
  {
    id: 'de-grammar',
    title: 'Немецкая грамматика',
    language: 'Немецкий',
    flag: '🇩🇪',
    level: 'beginner',
    duration: '2 месяца',
    lessons: 24,
    students: 3987,
    rating: 4.5,
    price: 11900,
    image: '/images/courses/german-grammar.jpg',
    description: 'Систематизированный курс по грамматике немецкого языка. От основ к сложным конструкциям.',
    features: ['Структура предложений', 'Падежи и склонения', 'Практические упражнения', 'Тесты'],
    instructor: {
      name: 'Томас Шмидт',
      specialization: 'Лингвист-германист'
    },
    category: 'grammar'
  },
  {
    id: 'ja-writing',
    title: 'Японская письменность',
    language: 'Японский',
    flag: '🇯🇵',
    level: 'beginner',
    duration: '6 месяцев',
    lessons: 72,
    students: 2876,
    rating: 4.9,
    price: 21900,
    image: '/images/courses/japanese-writing.jpg',
    description: 'Освойте три системы японской письменности: хирагану, катакану и базовые кандзи.',
    features: ['Каллиграфия', 'Мнемотехники', 'Практика письма', 'Культурный контекст'],
    instructor: {
      name: 'Юки Танака',
      specialization: 'Преподаватель японского'
    },
    category: 'grammar'
  },
  {
    id: 'en-ielts',
    title: 'Подготовка к IELTS',
    language: 'Английский',
    flag: '🇬🇧',
    level: 'advanced',
    duration: '3 месяца',
    lessons: 40,
    students: 5678,
    rating: 4.9,
    price: 24900,
    image: '/images/courses/ielts-prep.jpg',
    description: 'Интенсивная подготовка к международному экзамену IELTS. Практика всех секций экзамена.',
    features: ['Пробные тесты', 'Стратегии выполнения', 'Writing correction', 'Speaking practice'],
    instructor: {
      name: 'Елена Смирнова',
      specialization: 'Сертифицированный IELTS тренер'
    },
    category: 'exam'
  },
  {
    id: 'zh-travel',
    title: 'Китайский для путешествий',
    language: 'Китайский',
    flag: '🇨🇳',
    level: 'beginner',
    duration: '2 месяца',
    lessons: 20,
    students: 1987,
    rating: 4.4,
    price: 9900,
    image: '/images/courses/chinese-travel.jpg',
    description: 'Основные фразы и выражения для комфортного путешествия по Китаю.',
    features: ['Туристические диалоги', 'Китайская культура', 'Произношение', 'Полезные советы'],
    instructor: {
      name: 'Ли Вэй',
      specialization: 'Носитель языка'
    },
    category: 'travel'
  }
])

// Computed свойства
const availableLanguages = computed(() => {
  return [...new Set(courses.value.map(course => course.language))]
})

const hasActiveFilters = computed(() => {
  return filters.value.language !== '' || 
         filters.value.level !== '' || 
         filters.value.category !== '' ||
         searchQuery.value !== ''
})

const filteredCourses = computed(() => {
  let result = courses.value.filter(course => {
    // Поиск по названию и описанию
    const matchesSearch = searchQuery.value === '' || 
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Фильтры
    const matchesLanguage = filters.value.language === '' || course.language === filters.value.language
    const matchesLevel = filters.value.level === '' || course.level === filters.value.level
    const matchesCategory = filters.value.category === '' || course.category === filters.value.category

    return matchesSearch && matchesLanguage && matchesLevel && matchesCategory
  })

  // Сортировка
  switch (sortBy.value) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      result.sort((a, b) => b.students - a.students) // временная логика
      break
    case 'price':
      result.sort((a, b) => a.price - b.price)
      break
    case 'popular':
    default:
      result.sort((a, b) => b.students - a.students)
  }

  return result.slice(0, visibleCoursesCount.value)
})

const showLoadMore = computed(() => {
  return filteredCourses.value.length < courses.value.filter(course => {
    const matchesLanguage = filters.value.language === '' || course.language === filters.value.language
    const matchesLevel = filters.value.level === '' || course.level === filters.value.level
    const matchesCategory = filters.value.category === '' || course.category === filters.value.category
    return matchesLanguage && matchesLevel && matchesCategory
  }).length
})

// Методы
const applyFilters = () => {
  // Фильтрация происходит автоматически через computed
}

const applySorting = () => {
  // Сортировка происходит автоматически через computed
}

const clearFilters = () => {
  filters.value = {
    language: '',
    level: '',
    category: ''
  }
  searchQuery.value = ''
}

const loadMoreCourses = () => {
  visibleCoursesCount.value += 6
}

const handleCourseSelect = (course: Course) => {
  console.log('Выбран курс:', course)
  // Здесь будет логика перехода к курсу
}

onMounted(() => {
  // Инициализация данных
})
</script>

<style lang="scss" scoped>
.courses-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
    color: #f8fafc;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.courses-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    color: #f8fafc;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  select {
    background: #1a1a1a;
    border: 1px solid #2d2d2d;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #f8fafc;
    min-width: 150px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #8b5cf6;
    }
    
    &:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 2px #8b5cf640;
    }
  }
}

.search-sort {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

.search-box {
  position: relative;
  
  input {
    background: #1a1a1a;
    border: 1px solid #2d2d2d;
    border-radius: 8px;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    color: #f8fafc;
    width: 250px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #8b5cf6;
    }
    
    &:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 2px #8b5cf640;
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
  }
}

.sort-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    color: #f8fafc;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  select {
    background: #1a1a1a;
    border: 1px solid #2d2d2d;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #f8fafc;
    min-width: 180px;
    cursor: pointer;
  }
}

.filter-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  
  .courses-count {
    color: #94a3b8;
    font-weight: 600;
  }
  
  .clear-filters {
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: #ef4444;
      color: white;
    }
  }
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.load-more {
  text-align: center;
  
  .load-more-btn {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
    }
  }
}

// Адаптивность
@media (max-width: 1024px) {
  .courses-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-sort {
    justify-content: space-between;
  }
  
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .search-sort {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>