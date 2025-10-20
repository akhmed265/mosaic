<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <!-- Кнопка скрытия/показа -->
    <button class="sidebar__toggle" @click="toggleSidebar">
      <div
        class="toggle__arrow"
        :class="{ 'toggle__arrow--collapsed': isCollapsed }"
      >
        ←
      </div>
    </button>

    <!-- Заголовок меню -->
    <div class="sidebar__header">
      <div class="user-avatar" :style="avatarStyle"></div>
      <div class="user-info" v-if="!isCollapsed">
        <h3 class="user-name">{{ userName }}</h3>
        <p class="user-status">Учащийся</p>
        <!-- XPCounter -->
        <XPCounter
          :xp="userXP"
          :level="userLevel"
          :show-level="true"
          :show-progress="true"
          size="small"
          @levelUp="handleLevelUp"
        />
      </div>
    </div>

    <!-- Навигация -->
    <nav class="sidebar__nav">
      <a class="nav-item" @click="navigateToHome">
        <div class="nav-icon nav-icon--courses"></div>
        <span class="nav-text" v-if="!isCollapsed">Курсы</span>
      </a>

      <!-- Языки с выпадающим меню -->
      <div class="nav-item-with-dropdown">
        <a class="nav-item" @click="toggleLocaleMenu">
          <div class="nav-icon nav-icon--locale"></div>
          <span class="nav-text" v-if="!isCollapsed">{{
            currentLocaleName
          }}</span>
          <span class="nav-arrow" :class="{ rotated: localeMenuOpen }">▼</span>
        </a>

        <transition name="dropdown">
          <div v-if="localeMenuOpen && !isCollapsed" class="locale-dropdown">
            <div class="dropdown-header">
              <h4>Язык интерфейса</h4>
            </div>

            <div class="locales-list">
              <div
                v-for="loc in appLocales"
                :key="loc.code"
                class="locale-option"
                :class="{ active: currentLocale === loc.code }"
                @click="switchAppLocale(loc.code)"
              >
                <span class="locale-flag">{{ loc.flag }}</span>
                <span class="locale-name">{{ loc.name }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <a class="nav-item" @click="navigateToLearningMap">
        <div class="nav-icon nav-icon--progress"></div>
        <span class="nav-text" v-if="!isCollapsed">Карта развития</span>
      </a>

      <a class="nav-item" @click="navigateToProfile">
        <div class="nav-icon nav-icon--profile"></div>
        <span class="nav-text" v-if="!isCollapsed">Профиль</span>
      </a>

      <!-- ИСПРАВЛЕННАЯ СТРОКА: navigateToAbout вместо navigateToAbote -->
      <a class="nav-item" @click="navigateToAbout">
        <div class="nav-icon nav-icon--about"></div>
        <span class="nav-text" v-if="!isCollapsed">О нас</span>
      </a>

      <a href="#contact" class="nav-item">
        <div class="nav-icon nav-icon--contact"></div>
        <span class="nav-text" v-if="!isCollapsed">Контакты</span>
      </a>
    </nav>

    <!-- Логотип внизу -->
    <div class="sidebar__logo" v-if="!isCollapsed">
      <Logo size="small" />
    </div>

    <!-- Кнопки входа/регистрации -->
    <div class="sidebar__auth" v-if="!isCollapsed">
      <button class="auth-btn auth-btn--login">Вход</button>
      <button class="auth-btn auth-btn--register">Регистрация</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import Logo from "@/components/common/Logo.vue";
import XPCounter from "@/components/common/XPCounter.vue";

const router = useRouter();
const { locale } = useI18n();

// ИСПРАВЛЕНО: переименовал переменную чтобы избежать конфликта
const appLocales = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const navigateToProgress = () => {
  console.log("Навигация к карте развития");
  router.push("/learning-map").catch((err) => {
    console.error("Ошибка навигации:", err);
  });
};

const navigateToLanguages = () => {
  router.push("/languages");
  languagesMenuOpen.value = false;
};

const navigateToHome = () => {
  router.push("/");
};

const navigateToLearningMap = () => {
  router.push("/learning-map");
};

const navigateToProfile = () => {
  router.push("/profile");
};

// ИСПРАВЛЕННЫЙ МЕТОД: navigateToAbout вместо navigateToAbote
const navigateToAbout = () => {
  router.push("/about");
};

const isCollapsed = ref(false);
const userName = ref("Akhmed Малачиев");

// Генерация уникальной аватарки
const avatarData = computed(() => {
  const shapes = ["circle", "square", "triangle", "diamond"];
  const colorPairs = [
    { primary: "#4f46e5", secondary: "#8b5cf6" },
    { primary: "#10b981", secondary: "#059669" },
    { primary: "#f59e0b", secondary: "#d97706" },
    { primary: "#ef4444", secondary: "#dc2626" },
    { primary: "#8b5cf6", secondary: "#7c3aed" },
  ];

  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const colors = colorPairs[Math.floor(Math.random() * colorPairs.length)];

  return {
    shape,
    colors,
  };
});

// Данные пользователя
const userXP = ref(1250);
const userLevel = ref(3);

// Обработчик повышения уровня
const handleLevelUp = (data: { newLevel: number; oldLevel: number }) => {
  console.log(`Уровень повышен с ${data.oldLevel} на ${data.newLevel}!`);
};

const avatarStyle = computed(() => {
  return {
    "--avatar-primary": avatarData.value.colors.primary,
    "--avatar-secondary": avatarData.value.colors.secondary,
    "--avatar-shape": avatarData.value.shape,
  };
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Для выпадающего меню
const languagesMenuOpen = ref(false);

// Данные пользовательских языков
const userLanguages = ref([
  {
    code: "en",
    name: "Английский",
    flag: "🇬🇧",
    level: 5,
    progress: 65,
    color: "#8b5cf6",
    isLearning: true,
  },
  {
    code: "es",
    name: "Испанский",
    flag: "🇪🇸",
    level: 2,
    progress: 30,
    color: "#10b981",
    isLearning: true,
  },
  {
    code: "fr",
    name: "Французский",
    flag: "🇫🇷",
    level: 1,
    progress: 0,
    color: "#f59e0b",
    isLearning: false,
  },
  {
    code: "de",
    name: "Немецкий",
    flag: "🇩🇪",
    level: 0,
    progress: 0,
    color: "#ef4444",
    isLearning: false,
  },
  {
    code: "ja",
    name: "Японский",
    flag: "🇯🇵",
    level: 0,
    progress: 0,
    color: "#06b6d4",
    isLearning: false,
  },
]);

const currentLanguage = ref("en");

// Computed
const learningLanguages = computed(() => {
  return userLanguages.value.filter((lang) => lang.isLearning);
});

// Методы
const toggleLanguagesMenu = () => {
  languagesMenuOpen.value = !languagesMenuOpen.value;
};

const switchLanguage = (languageCode: string) => {
  currentLanguage.value = languageCode;
  languagesMenuOpen.value = false;
  console.log("Переключен язык:", languageCode);
};

const openLanguageSelector = () => {
  console.log("Открыть селектор языков");
};

// Закрывать меню при клике вне его
const closeLanguagesMenu = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".nav-item-with-dropdown")) {
    languagesMenuOpen.value = false;
  }
};

// Добавляем обработчик клика по документу
onMounted(() => {
  document.addEventListener("click", closeLanguagesMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeLanguagesMenu);
});

// Для смены языка интерфейса
const localeMenuOpen = ref(false)

const currentLocaleName = computed(() => {
  const localeMap: Record<string, string> = {
    'ru': 'Русский',
    'en': 'English'
  }
  return localeMap[locale.value] || 'Русский'
})

const toggleLocaleMenu = () => {
  localeMenuOpen.value = !localeMenuOpen.value
}

const switchAppLocale = (localeCode: string) => {
  locale.value = localeCode
  localStorage.setItem('user-language', localeCode)
  localeMenuOpen.value = false
}

const currentLocale = ref(locale.value)
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: $bg-card;
  box-shadow: $shadow-lg;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  font-family: "Montserrat", sans-serif;
  border-right: 1px solid $border-dark;

  &--collapsed {
    width: 80px;
  }

  &__toggle {
    position: absolute;
    right: -12px;
    top: 20px;
    width: 24px;
    height: 24px;
    border: none;
    background: $primary-color;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .toggle__arrow {
    transition: transform 0.3s ease;

    &--collapsed {
      transform: rotate(180deg);
    }
  }

  &__header {
    padding: 2rem 1.5rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__nav {
    flex: 1;
    padding: 1.5rem 0;
  }

  &__auth {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.sidebar__header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid $border-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;

  .user-info {
    text-align: center;
    width: 100%;
  }
}

// Генерация аватарки
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--avatar-primary),
    var(--avatar-secondary)
  );
  position: relative;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    width: 60%;
    height: 60%;
    background: $white;
    top: 20%;
    left: 20%;
    opacity: 0.8;
  }

  // Применяем разные формы через CSS
  &[style*="circle"]::before {
    border-radius: 50%;
  }

  &[style*="square"]::before {
    border-radius: 4px;
  }

  &[style*="triangle"]::before {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    border-radius: 0;
  }

  &[style*="diamond"]::before {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    border-radius: 0;
  }
}

.user-info {
  .user-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-light;
    margin-bottom: 0.25rem;
  }

  .user-status {
    font-size: 0.875rem;
    color: $text-muted;
  }
}

// Навигационные элементы
.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: $text-light;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  cursor: pointer;

  &:hover {
    background: $bg-light;
    border-left-color: $primary-color;
    color: $primary-color;
  }
}

.nav-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  &--courses {
    background: linear-gradient(45deg, #4f46e5, #8b5cf6);
    border-radius: 6px 2px 6px 2px;
  }

  &--languages {
    background: conic-gradient(from 45deg, #10b981, #06b6d4, #10b981);
    border-radius: 50% 20% 50% 20%;
  }

  &--progress {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &--profile {
    background: linear-gradient(135deg, #06b6d4, #0ea5e9);
    border-radius: 50%;
  }

  &--about {
    background: radial-gradient(circle, #ef4444, #dc2626);
    border-radius: 2px 8px 2px 8px;
  }

  &--contact {
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 4px;
    transform: skewX(-10deg);
  }

  &--locale {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 50%;
  }
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
}

// Кнопки авторизации
.auth-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: $border-radius;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;

  &--login {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: $text-light;
    }
  }

  &--register {
    background: $primary-color;
    color: $text-light;

    &:hover {
      background: darken($primary-color, 10%);
      transform: translateY(-2px);
    }
  }
}

.nav-item-with-dropdown {
  position: relative;
}

.locale-dropdown {
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  margin-left: 8px;
  
  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 20px;
    width: 12px;
    height: 12px;
    background: #1a1a1a;
    border-left: 1px solid #2d2d2d;
    border-bottom: 1px solid #2d2d2d;
    transform: rotate(45deg);
  }
}

.locales-list {
  padding: 0.5rem;
}

.locale-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2d2d2d;
  }
  
  &.active {
    background: #8b5cf620;
    border: 1px solid #8b5cf6;
  }

  .locale-flag {
    font-size: 1.2rem;
  }
  
  .locale-name {
    color: #f8fafc;
    font-weight: 600;
  }
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #2d2d2d;

  h4 {
    color: #f8fafc;
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0;
  }
}

.nav-arrow {
  color: #94a3b8;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  margin-left: auto;

  &.rotated {
    transform: rotate(180deg);
  }
}

// Анимации
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>