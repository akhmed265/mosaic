<template>
  <section class="tech-stack-section">
    <div class="section-header">
      <h2>{{ $t('about.tech.title') }}</h2>
      <p class="section-subtitle">{{ $t('about.tech.subtitle') }}</p>
    </div>

    <div class="tech-categories">
      <div class="category">
        <h3>{{ $t('about.tech.frontend') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in frontendTech" 
            :key="tech.name"
            class="tech-card"
          >
            <div class="tech-icon">{{ tech.icon }}</div>
            <div class="tech-info">
              <h4>{{ tech.name }}</h4>
              <p>{{ tech.description }}</p>
            </div>
            <div class="tech-level">
              <div class="level-bar">
                <div 
                  class="level-fill" 
                  :style="{ width: tech.level + '%' }"
                ></div>
              </div>
              <span class="level-text">{{ tech.level }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="category">
        <h3>{{ $t('about.tech.backend') }}</h3>
        <div class="tech-grid">
          <div 
            v-for="tech in backendTech" 
            :key="tech.name"
            class="tech-card"
          >
            <div class="tech-icon">{{ tech.icon }}</div>
            <div class="tech-info">
              <h4>{{ tech.name }}</h4>
              <p>{{ tech.description }}</p>
            </div>
            <div class="tech-level">
              <div class="level-bar">
                <div 
                  class="level-fill" 
                  :style="{ width: tech.level + '%' }"
                ></div>
              </div>
              <span class="level-text">{{ tech.level }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="category">
        <h3>{{ $t('about.tech.tools') }}</h3>
        <div class="tools-grid">
          <div 
            v-for="tool in developmentTools" 
            :key="tool.name"
            class="tool-card"
          >
            <div class="tool-icon">{{ tool.icon }}</div>
            <span class="tool-name">{{ tool.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="architecture-info">
      <h3>{{ $t('about.tech.architecture') }}</h3>
      <div class="architecture-grid">
        <div class="arch-item">
          <div class="arch-icon">🏗️</div>
          <div class="arch-content">
            <h4>{{ $t('about.tech.modular') }}</h4>
            <p>{{ $t('about.tech.modularDesc') }}</p>
          </div>
        </div>
        <div class="arch-item">
          <div class="arch-icon">⚡</div>
          <div class="arch-content">
            <h4>{{ $t('about.tech.performance') }}</h4>
            <p>{{ $t('about.tech.performanceDesc') }}</p>
          </div>
        </div>
        <div class="arch-item">
          <div class="arch-icon">🔧</div>
          <div class="arch-content">
            <h4>{{ $t('about.tech.maintainable') }}</h4>
            <p>{{ $t('about.tech.maintainableDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const frontendTech = [
  {
    name: 'Vue.js 3',
    icon: '⚡',
    description: 'Прогрессивный фреймворк для пользовательских интерфейсов',
    level: 95
  },
  {
    name: 'TypeScript',
    icon: '📘',
    description: 'Статическая типизация для надежного кода',
    level: 90
  },
  {
    name: 'Vite',
    icon: '🚀',
    description: 'Быстрая сборка и горячая перезагрузка',
    level: 88
  },
  {
    name: 'SCSS',
    icon: '🎨',
    description: 'Препроцессор для мощных стилей',
    level: 92
  },
  {
    name: 'Vue Router',
    icon: '🧭',
    description: 'Официальный маршрутизатор для Vue.js',
    level: 85
  },
  {
    name: 'Vue I18n',
    icon: '🌍',
    description: 'Интернационализация и локализация',
    level: 80
  }
]

const backendTech = [
  {
    name: 'Node.js',
    icon: '🟢',
    description: 'Серверная платформа на JavaScript',
    level: 88
  },
  {
    name: 'Express.js',
    icon: '🚂',
    description: 'Минималистичный веб-фреймворк',
    level: 85
  },
  {
    name: 'MongoDB',
    icon: '🍃',
    description: 'Документоориентированная база данных',
    level: 82
  },
  {
    name: 'JWT',
    icon: '🔐',
    description: 'JSON Web Tokens для аутентификации',
    level: 78
  }
]

const developmentTools = [
  { name: 'Git', icon: '📚' },
  { name: 'VS Code', icon: '💻' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Postman', icon: '📮' },
  { name: 'Docker', icon: '🐳' },
  { name: 'ESLint', icon: '📏' },
  { name: 'Prettier', icon: '✨' },
  { name: 'Chrome DevTools', icon: '🔍' }
]
</script>

<style lang="scss" scoped>
.tech-stack-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    color: #f8fafc;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .section-subtitle {
    color: #94a3b8;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }
}

.tech-categories {
  max-width: 1200px;
  margin: 0 auto 4rem;
}

.category {
  margin-bottom: 3rem;
  
  h3 {
    color: #f8fafc;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    font-weight: 700;
    text-align: center;
  }
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.tech-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }
  
  .tech-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .tech-info {
    flex: 1;
    
    h4 {
      color: #f8fafc;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    
    p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.4;
      margin: 0;
    }
  }
  
  .tech-level {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    
    .level-bar {
      width: 60px;
      height: 6px;
      background: #2d2d2d;
      border-radius: 3px;
      overflow: hidden;
      
      .level-fill {
        height: 100%;
        background: linear-gradient(90deg, #8b5cf6, #10b981);
        border-radius: 3px;
        transition: width 1s ease-in-out;
      }
    }
    
    .level-text {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 200px);
  justify-content: center;
  gap: 1rem;
  padding: 0 25px;
}

.tool-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #f59e0b;
    transform: scale(1.05);
  }
  
  .tool-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .tool-name {
    color: #f8fafc;
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.architecture-info {
  max-width: 1000px;
  margin: 0 auto;
  
  h3 {
    color: #f8fafc;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.arch-item {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  .arch-icon {
    font-size: 2rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
  
  .arch-content {
    flex: 1;
    
    h4 {
      color: #f8fafc;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    
    p {
      color: #94a3b8;
      line-height: 1.5;
      margin: 0;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-card {
    flex-direction: column;
    text-align: center;
    
    .tech-level {
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .arch-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>