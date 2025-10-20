<template>
  <section class="courses-section" id="courses">
    <div class="container">
      <!-- Заголовок раздела -->
      <div class="section-header">
        <div class="mosaic-decoration">
          <div class="mosaic-composition">
            <div class="mosaic-cluster">
              <div class="mosaic-piece piece-1"></div>
              <div class="mosaic-piece piece-2"></div>
              <div class="mosaic-piece piece-3"></div>
              <div class="mosaic-piece piece-4"></div>
            </div>
            <div class="mosaic-text">MOSAIC</div>
            <div class="mosaic-cluster">
              <div class="mosaic-piece piece-5"></div>
              <div class="mosaic-piece piece-6"></div>
              <div class="mosaic-piece piece-7"></div>
              <div class="mosaic-piece piece-8"></div>
            </div>
          </div>
        </div>

        <h2>Популярные курсы</h2>
        <p>
          Выберите подходящий курс из нашей коллекции или продолжите начатое
          обучение
        </p>
      </div>

      <!-- Фильтры и поиск -->
      <div class="courses-controls">
        <div class="controls-main">
          <!-- Быстрые фильтры -->
          <div class="quick-filters">
            <button
              v-for="filter in quickFilters"
              :key="filter.value"
              class="quick-filter"
              :class="{ active: quickFilterActive === filter.value }"
              @click="toggleQuickFilter(filter.value)"
            >
              <span class="filter-icon">{{ filter.icon }}</span>
              {{ filter.label }}
            </button>
          </div>

          <!-- Поиск -->
          <div class="search-container">
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск курсов..."
                @input="applyFilters"
              />
              <span class="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <!-- Расширенные фильтры -->
        <div class="advanced-filters">
          <div class="filter-group modern-select">
            <select v-model="filters.language" @change="applyFilters">
              <option value="">Все языки</option>
              <option
                v-for="lang in availableLanguages"
                :key="lang"
                :value="lang"
              >
                {{ lang }}
              </option>
            </select>
            <span class="select-arrow">▼</span>
          </div>

          <div class="filter-group modern-select">
            <select v-model="filters.level" @change="applyFilters">
              <option value="">Все уровни</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Продолжающий</option>
              <option value="advanced">Продвинутый</option>
            </select>
            <span class="select-arrow">▼</span>
          </div>

          <div class="filter-group modern-select">
            <select v-model="filters.category" @change="applyFilters">
              <option value="">Все категории</option>
              <option value="grammar">Грамматика</option>
              <option value="conversation">Разговорный</option>
              <option value="business">Бизнес</option>
              <option value="exam">Экзамены</option>
              <option value="travel">Путешествия</option>
            </select>
            <span class="select-arrow">▼</span>
          </div>

          <div class="filter-group modern-select">
            <select v-model="sortBy" @change="applySorting">
              <option value="popular">По популярности</option>
              <option value="rating">По рейтингу</option>
              <option value="newest">Сначала новые</option>
              <option value="price">По цене</option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
        </div>
      </div>

      <!-- Статистика фильтров -->
      <div class="filter-stats" v-if="hasActiveFilters">
        <div class="stats-content">
          <span class="courses-count">
            Найдено: <strong>{{ filteredCourses.length }}</strong> курсов
          </span>
          <div class="active-filters">
            <span
              v-for="filter in activeFilterLabels"
              :key="filter.key"
              class="active-filter"
            >
              {{ filter.label }}
              <button @click="removeFilter(filter.key)">×</button>
            </span>
          </div>
          <button class="clear-filters" @click="clearFilters">
            <span>Очистить всё</span>
          </button>
        </div>
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

      <!-- Пустое состояние -->
      <div v-if="filteredCourses.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Курсы не найдены</h3>
        <p>Попробуйте изменить параметры поиска или сбросить фильтры</p>
        <button class="reset-btn" @click="clearFilters">
          Сбросить фильтры
        </button>
      </div>

      <!-- Кнопка "Показать еще" -->
      <div class="load-more" v-if="showLoadMore">
        <button class="load-more-btn" @click="loadMoreCourses">
          <span>Показать еще</span>
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Course } from "@/types/courses";
import CourseCard from "@/components/courses/CourseCard.vue";

// Состояния
const searchQuery = ref("");
const sortBy = ref("popular");
const quickFilterActive = ref("");
const filters = ref({
  language: "",
  level: "",
  category: "",
});
const visibleCoursesCount = ref(8);

// Быстрые фильтры
const quickFilters = [
  { label: "Для начинающих", value: "beginner", icon: "🆕" },
  { label: "Бестселлеры", value: "popular", icon: "🔥" },
  { label: "Со скидкой", value: "discount", icon: "💸" },
  { label: "Новые", value: "new", icon: "🆓" },
];

// Данные курсов
const courses = ref<Course[]>([
  {
    id: "en-beginner",
    title: "Английский для начинающих",
    language: "Английский",
    flag: "🇬🇧",
    level: "beginner",
    duration: "3 месяца",
    lessons: 48,
    students: 12450,
    rating: 4.8,
    price: 12900,
    originalPrice: 17900,
    image: "/images/courses/english-beginner.jpg",
    description:
      "Полный курс для тех, кто только начинает изучать английский. Освойте базовую грамматику и лексику.",
    features: [
      "Интерактивные упражнения",
      "Разговорная практика",
      "Поддержка куратора",
      "Сертификат",
    ],
    instructor: {
      name: "Анна Иванова",
      specialization: "Эксперт по начальному обучению",
    },
    progress: 35,
    isFeatured: true,
    category: "grammar",
  },
  {
    id: "en-business",
    title: "Бизнес-английский",
    language: "Английский",
    flag: "🇬🇧",
    level: "intermediate",
    duration: "2 месяца",
    lessons: 32,
    students: 8765,
    rating: 4.9,
    price: 18900,
    image: "/images/courses/business-english.jpg",
    description:
      "Специализированный курс для делового общения. Переговоры, презентации, корпоративная лексика.",
    features: [
      "Деловая переписка",
      "Подготовка к собеседованию",
      "Кейсы из реальной практики",
    ],
    instructor: {
      name: "Максим Петров",
      specialization: "Business English Coach",
    },
    category: "business",
  },
  {
    id: "es-beginner",
    title: "Испанский с нуля",
    language: "Испанский",
    flag: "🇪🇸",
    level: "beginner",
    duration: "4 месяца",
    lessons: 56,
    students: 6543,
    rating: 4.7,
    price: 14900,
    image: "/images/courses/spanish-beginner.jpg",
    description:
      "Погрузитесь в мир испанского языка и культуры. Идеально для путешествий и общения.",
    features: [
      "Испанская культура",
      "Живые диалоги",
      "Произношение",
      "Музыка и кино",
    ],
    instructor: {
      name: "Карлос Родригес",
      specialization: "Носитель языка",
    },
    progress: 0,
    category: "conversation",
  },
  {
    id: "fr-conversation",
    title: "Французский для общения",
    language: "Французский",
    flag: "🇫🇷",
    level: "intermediate",
    duration: "3 месяца",
    lessons: 36,
    students: 4321,
    rating: 4.6,
    price: 16900,
    image: "/images/courses/french-conversation.jpg",
    description:
      "Разговорный курс для тех, кто хочет свободно общаться на французском.",
    features: [
      "Разговорные клубы",
      "Французский сленг",
      "Культурные особенности",
      "Аудирование",
    ],
    instructor: {
      name: "Софи Мартен",
      specialization: "Преподаватель с 10-летним опытом",
    },
    category: "conversation",
  },
  {
    id: "de-grammar",
    title: "Немецкая грамматика",
    language: "Немецкий",
    flag: "🇩🇪",
    level: "beginner",
    duration: "2 месяца",
    lessons: 24,
    students: 3987,
    rating: 4.5,
    price: 11900,
    image: "/images/courses/german-grammar.jpg",
    description:
      "Систематизированный курс по грамматике немецкого языка. От основ к сложным конструкциям.",
    features: [
      "Структура предложений",
      "Падежи и склонения",
      "Практические упражнения",
      "Тесты",
    ],
    instructor: {
      name: "Томас Шмидт",
      specialization: "Лингвист-германист",
    },
    category: "grammar",
  },
  {
    id: "ja-writing",
    title: "Японская письменность",
    language: "Японский",
    flag: "🇯🇵",
    level: "beginner",
    duration: "6 месяцев",
    lessons: 72,
    students: 2876,
    rating: 4.9,
    price: 21900,
    image: "/images/courses/japanese-writing.jpg",
    description:
      "Освойте три системы японской письменности: хирагану, катакану и базовые кандзи.",
    features: [
      "Каллиграфия",
      "Мнемотехники",
      "Практика письма",
      "Культурный контекст",
    ],
    instructor: {
      name: "Юки Танака",
      specialization: "Преподаватель японского",
    },
    category: "grammar",
  },
  {
    id: "en-ielts",
    title: "Подготовка к IELTS",
    language: "Английский",
    flag: "🇬🇧",
    level: "advanced",
    duration: "3 месяца",
    lessons: 40,
    students: 5678,
    rating: 4.9,
    price: 24900,
    image: "/images/courses/ielts-prep.jpg",
    description:
      "Интенсивная подготовка к международному экзамену IELTS. Практика всех секций экзамена.",
    features: [
      "Пробные тесты",
      "Стратегии выполнения",
      "Writing correction",
      "Speaking practice",
    ],
    instructor: {
      name: "Елена Смирнова",
      specialization: "Сертифицированный IELTS тренер",
    },
    category: "exam",
  },
  {
    id: "zh-travel",
    title: "Китайский для путешествий",
    language: "Китайский",
    flag: "🇨🇳",
    level: "beginner",
    duration: "2 месяца",
    lessons: 20,
    students: 1987,
    rating: 4.4,
    price: 9900,
    image: "/images/courses/chinese-travel.jpg",
    description:
      "Основные фразы и выражения для комфортного путешествия по Китаю.",
    features: [
      "Туристические диалоги",
      "Китайская культура",
      "Произношение",
      "Полезные советы",
    ],
    instructor: {
      name: "Ли Вэй",
      specialization: "Носитель языка",
    },
    category: "travel",
  },
  // НОВЫЕ КУРСЫ ДЛЯ ДЕМОНСТРАЦИИ ФИЛЬТРОВ
  {
    id: "en-conversation",
    title: "Английский для повседневного общения",
    language: "Английский",
    flag: "🇬🇧",
    level: "intermediate",
    duration: "2 месяца",
    lessons: 28,
    students: 3210,
    rating: 4.7,
    price: 13900,
    originalPrice: 17900,
    image: "/images/courses/english-conversation.jpg",
    description:
      "Научитесь свободно общаться на английском в повседневных ситуациях.",
    features: [
      "Реальные диалоги",
      "Идиомы и сленг",
      "Аудирование",
      "Разговорные клубы",
    ],
    instructor: {
      name: "Джон Смит",
      specialization: "Носитель языка",
    },
    category: "conversation",
  },
  {
    id: "it-beginner",
    title: "Итальянский с нуля",
    language: "Итальянский",
    flag: "🇮🇹",
    level: "beginner",
    duration: "3 месяца",
    lessons: 36,
    students: 2156,
    rating: 4.6,
    price: 12900,
    image: "/images/courses/italian-beginner.jpg",
    description: "Освойте красивый итальянский язык для путешествий и общения.",
    features: [
      "Итальянская культура",
      "Музыка и искусство",
      "Произношение",
      "Кулинарный словарь",
    ],
    instructor: {
      name: "Мария Росси",
      specialization: "Преподаватель итальянского",
    },
    category: "conversation",
  },
  {
    id: "en-toefl",
    title: "Подготовка к TOEFL",
    language: "Английский",
    flag: "🇬🇧",
    level: "advanced",
    duration: "3 месяца",
    lessons: 38,
    students: 2987,
    rating: 4.8,
    price: 22900,
    image: "/images/courses/toefl-prep.jpg",
    description:
      "Комплексная подготовка к экзамену TOEFL с фокусом на академический английский.",
    features: [
      "Академическое письмо",
      "Научное чтение",
      "Лекции и конспекты",
      "Пробные тесты",
    ],
    instructor: {
      name: "Роберт Джонсон",
      specialization: "TOEFL эксперт",
    },
    category: "exam",
  },
  {
    id: "kr-business",
    title: "Корейский для бизнеса",
    language: "Корейский",
    flag: "🇰🇷",
    level: "intermediate",
    duration: "4 месяца",
    lessons: 44,
    students: 1876,
    rating: 4.9,
    price: 19900,
    image: "/images/courses/korean-business.jpg",
    description:
      "Деловой корейский для работы в международных компаниях и ведения переговоров.",
    features: [
      "Бизнес-этикет",
      "Корпоративная культура",
      "Переговоры",
      "Презентации",
    ],
    instructor: {
      name: "Ким Соён",
      specialization: "Бизнес-консультант",
    },
    category: "business",
  },
  {
    id: "pt-travel",
    title: "Португальский для путешествий",
    language: "Португальский",
    flag: "🇵🇹",
    level: "beginner",
    duration: "2 месяца",
    lessons: 22,
    students: 1654,
    rating: 4.5,
    price: 10900,
    originalPrice: 14900,
    image: "/images/courses/portuguese-travel.jpg",
    description: "Основные фразы для путешествий по Португалии и Бразилии.",
    features: [
      "Туристические ситуации",
      "Культурные особенности",
      "Произношение",
      "Полезные советы",
    ],
    instructor: {
      name: "Пауло Силва",
      specialization: "Носитель языка",
    },
    category: "travel",
  },
  {
    id: "en-grammar-pro",
    title: "Продвинутая грамматика английского",
    language: "Английский",
    flag: "🇬🇧",
    level: "advanced",
    duration: "3 месяца",
    lessons: 42,
    students: 3456,
    rating: 4.9,
    price: 17900,
    image: "/images/courses/english-grammar-pro.jpg",
    description:
      "Углубленное изучение сложных грамматических конструкций английского языка.",
    features: [
      "Сложные времена",
      "Условные предложения",
      "Стилистика",
      "Пунктуация",
    ],
    instructor: {
      name: "Профессор Дэвис",
      specialization: "Лингвист",
    },
    category: "grammar",
  },
]);

// Computed свойства
const availableLanguages = computed(() => {
  return [...new Set(courses.value.map((course) => course.language))];
});

const hasActiveFilters = computed(() => {
  return (
    filters.value.language !== "" ||
    filters.value.level !== "" ||
    filters.value.category !== "" ||
    searchQuery.value !== "" ||
    quickFilterActive.value !== ""
  );
});

const activeFilterLabels = computed(() => {
  const labels = [];
  if (filters.value.language) {
    labels.push({ key: "language", label: `Язык: ${filters.value.language}` });
  }
  if (filters.value.level) {
    const levelNames = {
      beginner: "Начинающий",
      intermediate: "Продолжающий",
      advanced: "Продвинутый",
    };
    labels.push({
      key: "level",
      label: `Уровень: ${
        levelNames[filters.value.level as keyof typeof levelNames]
      }`,
    });
  }
  if (filters.value.category) {
    const categoryNames = {
      grammar: "Грамматика",
      conversation: "Разговорный",
      business: "Бизнес",
      exam: "Экзамены",
      travel: "Путешествия",
    };
    labels.push({
      key: "category",
      label: `Категория: ${
        categoryNames[filters.value.category as keyof typeof categoryNames]
      }`,
    });
  }
  if (searchQuery.value) {
    labels.push({ key: "search", label: `Поиск: "${searchQuery.value}"` });
  }
  if (quickFilterActive.value) {
    const quickFilter = quickFilters.find(
      (f) => f.value === quickFilterActive.value
    );
    if (quickFilter) {
      labels.push({ key: "quick", label: quickFilter.label });
    }
  }
  return labels;
});

const filteredCourses = computed(() => {
  let result = courses.value.filter((course) => {
    // Поиск по названию и описанию
    const matchesSearch =
      searchQuery.value === "" ||
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    // Основные фильтры
    const matchesLanguage =
      filters.value.language === "" ||
      course.language === filters.value.language;
    const matchesLevel =
      filters.value.level === "" || course.level === filters.value.level;
    const matchesCategory =
      filters.value.category === "" ||
      course.category === filters.value.category;

    // Быстрые фильтры
    let matchesQuickFilter = true;
    if (quickFilterActive.value === "beginner") {
      matchesQuickFilter = course.level === "beginner";
    } else if (quickFilterActive.value === "popular") {
      matchesQuickFilter = course.students > 5000;
    } else if (quickFilterActive.value === "discount") {
      matchesQuickFilter = course.originalPrice !== undefined;
    } else if (quickFilterActive.value === "new") {
      matchesQuickFilter = course.students < 1000;
    }

    return (
      matchesSearch &&
      matchesLanguage &&
      matchesLevel &&
      matchesCategory &&
      matchesQuickFilter
    );
  });

  // Сортировка
  switch (sortBy.value) {
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort((a, b) => b.students - a.students);
      break;
    case "price":
      result.sort((a, b) => a.price - b.price);
      break;
    case "popular":
    default:
      result.sort((a, b) => b.students - a.students);
  }

  return result.slice(0, visibleCoursesCount.value);
});

const showLoadMore = computed(() => {
  const totalFiltered = courses.value.filter((course) => {
    const matchesLanguage =
      filters.value.language === "" ||
      course.language === filters.value.language;
    const matchesLevel =
      filters.value.level === "" || course.level === filters.value.level;
    const matchesCategory =
      filters.value.category === "" ||
      course.category === filters.value.category;
    return matchesLanguage && matchesLevel && matchesCategory;
  }).length;
  return filteredCourses.value.length < totalFiltered;
});

// Методы
const applyFilters = () => {
  // Фильтрация происходит автоматически через computed
};

const applySorting = () => {
  // Сортировка происходит автоматически через computed
};

const toggleQuickFilter = (filterValue: string) => {
  quickFilterActive.value =
    quickFilterActive.value === filterValue ? "" : filterValue;
};

const removeFilter = (filterKey: string) => {
  switch (filterKey) {
    case "language":
      filters.value.language = "";
      break;
    case "level":
      filters.value.level = "";
      break;
    case "category":
      filters.value.category = "";
      break;
    case "search":
      searchQuery.value = "";
      break;
    case "quick":
      quickFilterActive.value = "";
      break;
  }
};

const clearFilters = () => {
  filters.value = {
    language: "",
    level: "",
    category: "",
  };
  searchQuery.value = "";
  quickFilterActive.value = "";
};

const loadMoreCourses = () => {
  visibleCoursesCount.value += 8;
};

const handleCourseSelect = (course: Course) => {
  console.log("Выбран курс:", course);
  // Здесь будет логика перехода к курсу
};

onMounted(() => {
  // Инициализация данных
});
</script>

<style lang="scss" scoped>
.courses-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  }
}

.container {
  padding-left: 50px;
  padding-right: 50px;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;

  .mosaic-decoration {
    display: flex;
    justify-content: center;
    margin-bottom: 2.5rem;
  }

  .mosaic-composition {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .mosaic-cluster {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
    width: 40px;
    height: 40px;
  }

  .mosaic-piece {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    animation: pieceFloat 4s ease-in-out infinite;

    &.piece-1 {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      animation-delay: 0s;
    }
    &.piece-2 {
      background: linear-gradient(135deg, #10b981, #059669);
      animation-delay: 0.5s;
    }
    &.piece-3 {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      animation-delay: 1s;
    }
    &.piece-4 {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      animation-delay: 1.5s;
    }
    &.piece-5 {
      background: linear-gradient(135deg, #06b6d4, #0ea5e9);
      animation-delay: 2s;
    }
    &.piece-6 {
      background: linear-gradient(135deg, #8b5cf6, #a78bfa);
      animation-delay: 2.5s;
    }
    &.piece-7 {
      background: linear-gradient(135deg, #10b981, #34d399);
      animation-delay: 3s;
    }
    &.piece-8 {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      animation-delay: 3.5s;
    }
  }

  .mosaic-text {
    font-size: 1.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #8b5cf6, #10b981, #f59e0b, #ef4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 300% 300%;
    animation: gradientShift 4s ease infinite;
    letter-spacing: 2px;
  }

  @keyframes pieceFloat {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-5px) rotate(5deg);
      opacity: 1;
    }
  }

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
}

.courses-controls {
  margin-bottom: 2rem;
}

.controls-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.quick-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.quick-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    color: #f8fafc;
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-color: #8b5cf6;
    color: white;
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
  }

  .filter-icon {
    font-size: 1.1rem;
  }
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-box {
  position: relative;

  input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #2d2d2d;
    border-radius: 12px;
    padding: 1rem 1rem 1rem 3rem;
    color: #f8fafc;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      border-color: #3d3d3d;
    }

    &:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
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
    font-size: 1.1rem;
  }
}

.advanced-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  position: relative;

  &.modern-select {
    select {
      background: #1a1a1a;
      border: 1px solid #2d2d2d;
      border-radius: 12px;
      padding: 1rem 2.5rem 1rem 1rem;
      color: #f8fafc;
      min-width: 160px;
      cursor: pointer;
      appearance: none;
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover {
        border-color: #3d3d3d;
      }

      &:focus {
        outline: none;
        border-color: #8b5cf6;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }
    }

    .select-arrow {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      pointer-events: none;
      font-size: 0.8rem;
    }
  }
}

.filter-stats {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  .stats-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .courses-count {
    color: #94a3b8;
    font-weight: 600;

    strong {
      color: #f8fafc;
    }
  }

  .active-filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .active-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #2d2d2d;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    color: #f8fafc;
    font-size: 0.9rem;
    font-weight: 500;

    button {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        background: #3d3d3d;
        color: #f8fafc;
      }
    }
  }

  .clear-filters {
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-left: auto;

    &:hover {
      background: #ef4444;
      color: white;
      transform: translateY(-1px);
    }
  }
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  h3 {
    color: #f8fafc;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: #94a3b8;
    margin-bottom: 2rem;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .reset-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #7c3aed;
      transform: translateY(-2px);
    }
  }
}

.load-more {
  text-align: center;

  .load-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
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
      box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);

      .loading-dots .dot {
        background: white;
      }
    }
  }
}

.loading-dots {
  display: flex;
  gap: 4px;

  .dot {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: dotPulse 1.4s ease-in-out infinite both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

// Адаптивность
@media (max-width: 1200px) {
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 1024px) {
  .controls-main {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: none;
  }

  .advanced-filters {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 2.5rem;
  }

  .quick-filters {
    justify-content: center;
  }

  .advanced-filters {
    flex-direction: column;
  }

  .filter-group.modern-select select {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .filter-stats .stats-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filter-stats .clear-filters {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-header h2 {
    font-size: 2rem;
  }

  .quick-filter {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }
}
</style>
