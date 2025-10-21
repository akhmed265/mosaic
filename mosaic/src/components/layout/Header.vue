<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <!-- Логотип -->
    <div
      class="header__logo"
      @click="navigateToHome"
      @mouseenter="startDisassemble"
      @mouseleave="startAssemble"
    >
      <div class="mosaic-logo" :class="{ disassembled: isDisassembled }">
        <div class="mosaic-piece piece-1"></div>
        <div class="mosaic-piece piece-2"></div>
        <div class="mosaic-piece piece-3"></div>
        <div class="mosaic-piece piece-4"></div>
      </div>
      <span class="logo-text">MOSAIC</span>
    </div>

    <!-- Основная навигация -->
    <nav class="header__nav">
      <a
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ 'nav-item--active': $route.path === item.path }"
        @click="navigateTo(item.path)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.name }}</span>
        <div class="nav-indicator"></div>
      </a>
    </nav>

    <!-- Правая часть -->
    <div class="header__actions">
      <!-- Поиск -->
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск курсов..."
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Уведомления -->
      <button class="action-btn notification-btn" @click="toggleNotifications">
        <span class="action-icon">🔔</span>
        <span class="notification-badge" v-if="unreadNotifications">3</span>
      </button>

      <!-- Переключатель языков -->
      <div class="language-switcher">
        <button
          class="language-globe"
          :class="{ 'is-rotating': isGlobeRotating }"
          @click="toggleLanguage"
        >
          <div class="globe-sphere">
            <div class="globe-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
            <div class="globe-core">
              <span class="current-flag">{{ currentLanguage.flag }}</span>
            </div>
            <div class="globe-glow"></div>
          </div>
          <span class="language-code">{{ currentLanguage.short }}</span>
          <span class="language-arrow">▼</span>
        </button>

        <transition name="globe-dropdown">
          <div v-if="isLanguageOpen" class="language-dropdown">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              class="language-option"
              :class="{ active: currentLanguage.code === lang.code }"
              @click="switchLanguage(lang)"
            >
              <span class="language-flag">{{ lang.flag }}</span>
              <span class="language-name">{{ lang.name }}</span>
            </button>
          </div>
        </transition>
      </div>

      <!-- Профиль пользователя -->
      <div class="user-menu">
        <button class="user-toggle" @click="toggleUserMenu">
          <div class="user-avatar" :style="avatarStyle"></div>
          <span class="user-name">{{ userName }}</span>
          <span class="user-arrow">▼</span>
        </button>

        <transition name="dropdown">
          <div v-if="isUserMenuOpen" class="user-dropdown">
            <div class="dropdown-section">
              <div class="user-info">
                <div class="user-avatar-large" :style="avatarStyle"></div>
                <div class="user-details">
                  <div class="user-name-large">{{ userName }}</div>
                  <div class="user-status">Учащийся</div>
                </div>
              </div>
            </div>

            <div class="dropdown-section">
              <a class="dropdown-item" @click="navigateToProfile">
                <span class="item-icon">👤</span>
                <span class="item-text">Мой профиль</span>
              </a>
              <a class="dropdown-item" @click="navigateToProgress">
                <span class="item-icon">📊</span>
                <span class="item-text">Мой прогресс</span>
              </a>
              <a class="dropdown-item" @click="navigateToSettings">
                <span class="item-icon">⚙️</span>
                <span class="item-text">Настройки</span>
              </a>
            </div>

            <div class="dropdown-section">
              <a
                class="dropdown-item dropdown-item--logout"
                @click="handleLogout"
              >
                <span class="item-icon">🚪</span>
                <span class="item-text">Выйти</span>
              </a>
            </div>
          </div>
        </transition>
      </div>

      <!-- Мобильное меню -->
      <div class="header__mobile">
        <button
          class="hamburger"
          :class="{ 'hamburger--active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
        >
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
        </button>

        <transition name="mobile-menu">
          <div v-if="isMobileMenuOpen" class="mobile-menu">
            <div class="mobile-menu__overlay" @click="closeMobileMenu"></div>
            <div class="mobile-menu__content">
              <div class="mobile-menu__header">
                <div class="mobile-user-info">
                  <div class="user-avatar" :style="avatarStyle"></div>
                  <div class="user-details">
                    <div class="user-name">{{ userName }}</div>
                    <div class="user-status">Учащийся</div>
                  </div>
                </div>
                <button class="close-btn" @click="closeMobileMenu">×</button>
              </div>

              <nav class="mobile-menu__nav">
                <a
                  v-for="item in navItems"
                  :key="item.path"
                  class="mobile-nav-item"
                  :class="{
                    'mobile-nav-item--active': $route.path === item.path,
                  }"
                  @click="navigateToMobile(item.path)"
                >
                  <span class="nav-icon">{{ item.icon }}</span>
                  <span class="nav-text">{{ item.name }}</span>
                </a>
              </nav>

              <div class="mobile-menu__actions">
                <button class="mobile-action-btn" @click="navigateToProfile">
                  <span class="action-icon">👤</span>
                  <span>Профиль</span>
                </button>
                <button class="mobile-action-btn" @click="navigateToProgress">
                  <span class="action-icon">📊</span>
                  <span>Прогресс</span>
                </button>
                <button class="mobile-action-btn" @click="navigateToSettings">
                  <span class="action-icon">⚙️</span>
                  <span>Настройки</span>
                </button>
                <button
                  class="mobile-action-btn mobile-action-btn--logout"
                  @click="handleLogout"
                >
                  <span class="action-icon">🚪</span>
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { locale } = useI18n();

// Состояния
const isScrolled = ref(false);
const isSearchFocused = ref(false);
const isUserMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const searchQuery = ref("");
const unreadNotifications = ref(3);
const isMobile = ref(false);
const isDisassembled = ref(false);
const animationTimeout = ref<number | null>(null);

// Данные пользователя
const userName = ref("Akhmed Малачиев");

// Навигация
const navItems = [
  { name: "Курсы", path: "/", icon: "📚" },
  { name: "Языки", path: "/languages", icon: "🌎" },
  { name: "Прогресс", path: "/learning-map", icon: "📊" },
  { name: "О нас", path: "/about", icon: "👥" },
];

// Языки
const availableLanguages = [
  { code: "ru", name: "Русский", flag: "🇷🇺", short: "РУ" },
  { code: "en", name: "English", flag: "🇺🇸", short: "EN" },
  { code: "es", name: "Español", flag: "🇪🇸", short: "ES" },
  { code: "fr", name: "Français", flag: "🇫🇷", short: "FR" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", short: "DE" },
  { code: "zh", name: "中文", flag: "🇨🇳", short: "中文" },
];

const currentLanguage = ref(availableLanguages[0]);
const isLanguageOpen = ref(false);

// Анимации глобуса
const isGlobeRotating = ref(false);

const toggleLanguage = () => {
  isLanguageOpen.value = !isLanguageOpen.value;
  if (!isLanguageOpen.value) {
    startGlobeAnimation();
  }
};

const switchLanguage = (lang: any) => {
  startGlobeAnimation();
  setTimeout(() => {
    currentLanguage.value = lang;
    locale.value = lang.code;
    isLanguageOpen.value = false;
  }, 300);
};

const startGlobeAnimation = () => {
  isGlobeRotating.value = true;
  setTimeout(() => {
    isGlobeRotating.value = false;
  }, 600);
};

// Анимации логотипа
const startDisassemble = () => {
  if (animationTimeout.value) {
    clearTimeout(animationTimeout.value);
  }
  isDisassembled.value = true;
};

const startAssemble = () => {
  if (animationTimeout.value) {
    clearTimeout(animationTimeout.value);
  }
  isDisassembled.value = false;
};

const toggleMosaic = () => {
  isDisassembled.value = !isDisassembled.value;
};

// Аватарка (как в HeroSection)
const avatarData = computed(() => {
  const shapes = ["circle", "square", "triangle", "diamond"];
  const colorPairs = [
    { primary: "#8b5cf6", secondary: "#7c3aed" },
    { primary: "#10b981", secondary: "#059669" },
    { primary: "#f59e0b", secondary: "#d97706" },
    { primary: "#ef4444", secondary: "#dc2626" },
    { primary: "#3b82f6", secondary: "#1d4ed8" },
  ];

  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const colors = colorPairs[Math.floor(Math.random() * colorPairs.length)];

  return { shape, colors };
});

const avatarStyle = computed(() => ({
  "--avatar-primary": avatarData.value.colors.primary,
  "--avatar-secondary": avatarData.value.colors.secondary,
  "--avatar-shape": avatarData.value.shape,
}));

// Методы навигации
const navigateTo = (path: string) => {
  router.push(path);
  closeMobileMenu();
};

const navigateToHome = () => {
  router.push("/");
};

const navigateToProfile = () => {
  router.push("/profile");
  closeAllMenus();
};

const navigateToProgress = () => {
  router.push("/learning-map");
  closeAllMenus();
};

const navigateToSettings = () => {
  console.log("Navigate to settings");
  closeAllMenus();
};

const navigateToMobile = (path: string) => {
  router.push(path);
  closeMobileMenu();
};

// Методы меню
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const closeAllMenus = () => {
  isUserMenuOpen.value = false;
  isMobileMenuOpen.value = false;
};

const toggleNotifications = () => {
  console.log("Toggle notifications");
  unreadNotifications.value = 0;
};

const handleLogout = () => {
  console.log("Logout");
  closeAllMenus();
};

// Обработчики скролла и ресайза
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", checkMobile);
  checkMobile();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", checkMobile);
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid $border-dark;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  transition: all 0.3s ease;

  &--scrolled {
    background: rgba(15, 15, 15, 0.98);
    border-bottom-color: rgba(45, 45, 45, 0.8);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}

/* Логотип */
.header__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.mosaic-logo {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  .mosaic-piece {
    position: absolute;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border-radius: 4px;

    /* Начальные позиции (собранное состояние) */
    &.piece-1 {
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      top: 4px;
      left: 4px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
      animation: float 4s ease-in-out infinite 0.8s;
    }

    &.piece-2 {
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      top: 4px;
      right: 4px;
      animation: float 4s ease-in-out infinite 1s;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    &.piece-3 {
      width: 15px;
      height: 15px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      transform: rotate(45deg);
      bottom: 4px;
      left: 4px;
      animation: float 4s ease-in-out infinite 1.2s;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    }

    &.piece-4 {
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      bottom: 4px;
      right: 4px;
      animation: float 4s ease-in-out infinite 1.4s;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }
  }

  /* Состояние разобранной мозаики */
  &.disassembled {
    .mosaic-piece {
      animation-play-state: paused;

      &.piece-1 {
        transform: translate(-12px, -12px) rotate(-15deg) scale(1.1);
        opacity: 0.9;
      }

      &.piece-2 {
        transform: translate(12px, -12px) rotate(15deg) scale(1.1);
        opacity: 0.9;
      }

      &.piece-3 {
        transform: translate(-12px, 12px) rotate(-30deg) scale(1.1);
        opacity: 0.9;
      }

      &.piece-4 {
        transform: translate(12px, 12px) rotate(30deg) scale(1.1);
        opacity: 0.9;
      }
    }
  }

  /* Эффект при hover на отдельные элементы */
  &:hover:not(.disassembled) {
    .mosaic-piece {
      animation-play-state: running;

      &.piece-1 {
        transform: translate(-2px, -2px) scale(1.05);
      }
      &.piece-2 {
        transform: translate(2px, -2px) scale(1.05);
      }
      &.piece-3 {
        transform: translate(-2px, 2px) scale(1.05) rotate(45deg);
      }
      &.piece-4 {
        transform: translate(2px, 2px) scale(1.05);
      }
    }
  }
}

/* Анимации для логотипа */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.05);
  }
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #10b981, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradientShift 4s ease infinite;
  transition: all 0.3s ease;
}

.header__logo:hover .logo-text {
  animation-duration: 2s;
  filter: brightness(1.2);
}

/* Основная навигация */
.header__nav {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $text-light;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    background: transparent;
    color: $primary-color;
    border-color: $primary-color;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);

    .nav-icon {
      transform: scale(1.2) rotate(10deg);
    }

    .nav-indicator {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  &--active {
    background: linear-gradient(
      135deg,
      $primary-color,
      lighten($primary-color, 10%)
    );
    color: white;
    border-color: $primary-color;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

    .nav-indicator {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  .nav-icon {
    font-size: 1.1rem;
    opacity: 0.8;
  }
}

.nav-indicator {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: $primary-color;
  border-radius: 1px;
  opacity: 0;
  transition: all 0.3s ease;
}

/* Правая часть */
.header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Поиск */
.search-container {
  @media (max-width: 768px) {
    display: none;
  }
}

.search-box {
  position: relative;

  input {
    background: $bg-light;
    border: 1px solid $border-dark;
    border-radius: 12px;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    color: $text-light;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    width: 200px;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      width: 250px;
    }

    &::placeholder {
      color: $text-muted;
    }
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $text-muted;
  }
}

/* Кнопки действий */
.action-btn {
  position: relative;
  background: none;
  border: none;
  color: $text-light;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $primary-color;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }

  &.notification-btn {
    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.1rem 0.3rem;
      border-radius: 8px;
      min-width: 16px;
      text-align: center;
    }
  }
}

/* Меню пользователя */
.user-menu {
  position: relative;
}

.user-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: $text-light;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: transparent;
    border: 1px solid $primary-color;

    .user-avatar {
      transform: scale(1.1);
      box-shadow: 0 0 0 2px $primary-color;
    }
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
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

  &[style*="circle"]::before {
    border-radius: 50%;
  }

  &[style*="square"]::before {
    border-radius: 4px;
  }

  &[style*="triangle"]::before {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  &[style*="diamond"]::before {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    display: none;
  }
}

.user-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.user-menu:hover .user-arrow {
  transform: rotate(180deg);
}

/* Выпадающее меню пользователя */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: $bg-card;
  border: 1px solid $border-dark;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
  z-index: 1001;
  overflow: hidden;
}

.dropdown-section {
  padding: 1rem;
  border-bottom: 1px solid $border-dark;

  &:last-child {
    border-bottom: none;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--avatar-primary),
    var(--avatar-secondary)
  );
  position: relative;

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
}

.user-details {
  .user-name-large {
    font-weight: 700;
    color: $text-light;
    margin-bottom: 0.25rem;
  }

  .user-status {
    color: $text-muted;
    font-size: 0.8rem;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: $text-light;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: $bg-light;
    color: $primary-color;
  }

  &--logout {
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }

  .item-icon {
    font-size: 1.1rem;
    opacity: 0.8;
  }
}

/* Мобильное меню */
.header__mobile {
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;

  &__line {
    width: 20px;
    height: 2px;
    background: $text-light;
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  &--active {
    .hamburger__line:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .hamburger__line:nth-child(2) {
      opacity: 0;
    }

    .hamburger__line:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  &__content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    background: $bg-card;
    border-left: 1px solid $border-dark;
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid $border-dark;
  }

  &__nav {
    flex: 1;
    padding: 1rem 0;
  }

  &__actions {
    padding: 1rem;
    border-top: 1px solid $border-dark;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: $text-light;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: $primary-color;
  }
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: $text-light;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  cursor: pointer;

  &:hover {
    background: $bg-light;
    border-left-color: $primary-color;
    color: $primary-color;
  }

  &--active {
    background: $bg-light;
    border-left-color: $primary-color;
    color: $primary-color;
  }
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  background: none;
  border: none;
  color: $text-light;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $bg-light;
    color: $primary-color;
  }

  &--logout {
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
}

/* Анимации */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active .mobile-menu__content,
.mobile-menu-leave-active .mobile-menu__content {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from .mobile-menu__content,
.mobile-menu-leave-to .mobile-menu__content {
  transform: translateX(100%);
}

/* Переключатель языков */
.language-switcher {
  position: relative;
}

.language-globe {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: $text-light;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: transparent;
    transform: translateY(-2px);

    .globe-sphere {
      transform: scale(1.2);
      filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
    }

    .language-code {
      color: $primary-color;
      font-weight: 700;
    }
  }
}

.globe-sphere {
  position: relative;
  width: 24px;
  height: 24px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.globe-rings {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .ring {
    position: absolute;
    border: 1px solid rgba(139, 92, 246, 0.6);
    border-radius: 50%;
    animation: ringPulse 3s ease-in-out infinite;

    &.ring-1 {
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      animation-delay: 0s;
    }

    &.ring-2 {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      animation-delay: 1s;
    }

    &.ring-3 {
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      animation-delay: 2s;
    }
  }
}

.globe-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  .current-flag {
    font-size: 0.7rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }
}

.globe-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1;
}

/* Анимации глобуса */
@keyframes ringPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

@keyframes globeRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

/* Анимация при смене языка */
.language-globe:active .globe-sphere,
.is-rotating .globe-sphere {
  animation: globeRotate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.language-code {
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.language-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.language-switcher:hover .language-arrow {
  transform: rotate(180deg);
}

/* Неоновое выпадающее меню */
.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  box-shadow: 
    0 20px 60px rgba(139, 92, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  margin-top: 0.75rem;
  z-index: 1001;
  overflow: hidden;
  backdrop-filter: blur(20px);
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      transparent, 
      rgba(139, 92, 246, 0.1), 
      rgba(59, 130, 246, 0.1), 
      rgba(16, 185, 129, 0.1),
      transparent
    );
    border-radius: 18px;
    z-index: -1;
    animation: neonBorder 3s linear infinite;
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  background: transparent;
  border: none;
  color: $text-light;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(139, 92, 246, 0.15), 
      rgba(59, 130, 246, 0.15),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #f8fafc;
    padding-left: 1.5rem;
    transform: translateX(5px);
    
    &::before {
      left: 100%;
    }
    
    .language-flag {
      transform: scale(1.3) rotate(10deg);
      filter: drop-shadow(0 0 8px currentColor);
    }
    
    .language-name {
      color: $primary-color;
      font-weight: 700;
    }
  }

  &.active {
    background: linear-gradient(135deg, 
      rgba(139, 92, 246, 0.2), 
      rgba(59, 130, 246, 0.1)
    );
    color: #f8fafc;
    
    &::after {
      content: '✓';
      position: absolute;
      right: 1.25rem;
      color: $primary-color;
      font-weight: bold;
      animation: checkPop 0.3s ease;
    }
    
    .language-flag {
      filter: drop-shadow(0 0 6px $primary-color);
    }
  }
}

.language-flag {
  font-size: 1.4rem;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.language-name {
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

/* Анимации */
@keyframes neonBorder {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Плавное появление */
.globe-dropdown-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.globe-dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.globe-dropdown-enter-from {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.globe-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
