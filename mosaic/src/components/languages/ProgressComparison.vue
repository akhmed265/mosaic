<template>
  <div class="progress-comparison">
    <h3>Сравнение языков</h3>
    
    <div class="comparison-chart">
      <div 
        v-for="language in comparedLanguages"
        :key="language.code"
        class="language-comparison"
      >
        <div class="language-header">
          <span class="language-flag">{{ language.flag }}</span>
          <span class="language-name">{{ language.name }}</span>
          <span class="language-percent">{{ language.progress }}%</span>
        </div>
        
        <div class="progress-bars">
          <div 
            v-for="skill in language.skills"
            :key="skill.name"
            class="skill-bar-container"
          >
            <div class="skill-label">{{ skill.name }}</div>
            <div class="skill-bar">
              <div 
                class="skill-progress"
                :style="{
                  width: `${skill.progress}%`,
                  background: skill.color
                }"
              ></div>
            </div>
            <div class="skill-percent">{{ skill.progress }}%</div>
          </div>
        </div>
        
        <div class="language-stats">
          <div class="stat">
            <div class="stat-value">{{ language.lessons }}</div>
            <div class="stat-label">Уроки</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ language.words }}</div>
            <div class="stat-label">Слова</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ language.time }}ч</div>
            <div class="stat-label">Время</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="comparison-insights">
      <h4>Инсайты</h4>
      <div class="insights-list">
        <div class="insight-item">
          <div class="insight-icon">💡</div>
          <div class="insight-text">
            <strong>Английский</strong> - ваш самый сильный язык в грамматике
          </div>
        </div>
        <div class="insight-item">
          <div class="insight-icon">🎯</div>
          <div class="insight-text">
            Сосредоточьтесь на <strong>аудировании</strong> в испанском
          </div>
        </div>
        <div class="insight-item">
          <div class="insight-icon">⚡</div>
          <div class="insight-text">
            Вы изучаете слова быстрее в <strong>английском</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const comparedLanguages = [
  {
    code: 'en',
    name: 'Английский',
    flag: '🇬🇧',
    progress: 65,
    lessons: 42,
    words: 1250,
    time: 25,
    skills: [
      { name: 'Грамматика', progress: 70, color: '#8b5cf6' },
      { name: 'Слова', progress: 65, color: '#10b981' },
      { name: 'Аудирование', progress: 55, color: '#f59e0b' },
      { name: 'Разговор', progress: 45, color: '#ef4444' }
    ]
  },
  {
    code: 'es',
    name: 'Испанский',
    flag: '🇪🇸',
    progress: 30,
    lessons: 15,
    words: 450,
    time: 12,
    skills: [
      { name: 'Грамматика', progress: 25, color: '#8b5cf6' },
      { name: 'Слова', progress: 35, color: '#10b981' },
      { name: 'Аудирование', progress: 20, color: '#f59e0b' },
      { name: 'Разговор', progress: 15, color: '#ef4444' }
    ]
  }
]
</script>

<style lang="scss" scoped>
.progress-comparison {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #2d2d2d;
  
  h3 {
    color: #f8fafc;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.comparison-chart {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.language-comparison {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
}

.language-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .language-flag {
    font-size: 1.5rem;
  }
  
  .language-name {
    color: #f8fafc;
    font-weight: 700;
    flex: 1;
  }
  
  .language-percent {
    color: #8b5cf6;
    font-size: 1.1rem;
    font-weight: 700;
  }
}

.progress-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skill-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .skill-label {
    color: #94a3b8;
    font-weight: 600;
    min-width: 100px;
    font-size: 0.9rem;
  }
  
  .skill-bar {
    flex: 1;
    height: 8px;
    background: #3d3d3d;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .skill-progress {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
  }
  
  .skill-percent {
    color: #f8fafc;
    font-weight: 600;
    min-width: 40px;
    text-align: right;
    font-size: 0.9rem;
  }
}

.language-stats {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #3d3d3d;
  
  .stat {
    text-align: center;
    
    .stat-value {
      color: #f8fafc;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }
}

.comparison-insights {
  h4 {
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  border-radius: 8px;
  
  .insight-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .insight-text {
    color: #f8fafc;
    font-size: 0.9rem;
    line-height: 1.4;
    
    strong {
      color: #8b5cf6;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .skill-bar-container {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .language-stats {
    gap: 1rem;
  }
  
  .insight-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}
</style>