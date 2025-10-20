<template>
  <div class="about-view">
    <div class="container">
      <!-- Герой секция -->
      <div class="hero-section">
        <div class="hero-content">
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
          <h1 class="hero-title">{{ $t('about.title') }}</h1>
          <p class="hero-subtitle">{{ $t('about.subtitle') }}</p>
        </div>
      </div>

      <!-- Миссия и ценности -->
      <MissionSection />

      <!-- Команда -->
      <TeamSection />

      <!-- Статистика -->
      <StatsSection />

      <!-- Технологический стек -->
      <TechStack />

      <!-- Призыв к действию -->
      <div class="cta-section">
        <div class="cta-content">
          <h2>{{ $t('about.cta.title') }}</h2>
          <p>{{ $t('about.cta.description') }}</p>
          <div class="cta-buttons">
            <router-link to="/" class="cta-btn primary">
              {{ $t('about.cta.startLearning') }}
            </router-link>
            <router-link to="/courses" class="cta-btn secondary">
              {{ $t('about.cta.exploreCourses') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MissionSection from '@/components/about/MissionSection.vue'
import TeamSection from '@/components/about/TeamSection.vue'
import StatsSection from '@/components/about/StatsSection.vue'
import TechStack from '@/components/about/TechStack.vue'
</script>

<style lang="scss" scoped>
.about-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 0 2rem;
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }
}

.mosaic-decoration {
  margin-bottom: 2rem;
}

.mosaic-composition {
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #10b981, #f59e0b, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradientShift 4s ease infinite;
  letter-spacing: 2px;
}

.hero-title {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-weight: 800;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.cta-section {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border-radius: 24px;
  padding: 4rem 2rem;
  margin: 4rem 0;
  text-align: center;
  border: 1px solid #2d2d2d;
  
  .cta-content {
    max-width: 600px;
    margin: 0 auto;
    
    h2 {
      color: #f8fafc;
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    p {
      color: #94a3b8;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
  }
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
    }
  }
  
  &.secondary {
    background: transparent;
    border: 2px solid #8b5cf6;
    color: #8b5cf6;
    
    &:hover {
      background: #8b5cf6;
      color: white;
    }
  }
}

@keyframes pieceFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
    opacity: 1;
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .mosaic-composition {
    gap: 1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>