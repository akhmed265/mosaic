<template>
  <div class="profile-view">
    <div class="profile-container">
      <h1 class="profile-title">Профиль</h1>
        <UserHeader />

        <div class="profile-layout">
        <div class="left-column">
          <ActiveCourses />
          
          <DailyGoals />
        </div>

        
        <div class="right-column">
          <ProgressStats />

          <AchievementShowcase />

          <StudyActivity />
        </div>
      </div>
      
      <div class="profile-content">
        <ProgressStats />

        <div class="coming-soon">
          <div class="coming-soon-icon">🚧</div>
          <h3>Профиль в разработке</h3>
          <p>Скоро здесь появится ваша статистика и достижения!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import UserHeader from '@/components/profile/UserHeader.vue'
  import ProgressStats  from '@/components/profile/ProgressStats.vue'
  import ActiveCourses from '@/components/profile/ActiveCourses.vue'
  import AchievementShowcase from '@/components/profile/AchievementShowcase.vue'
  import StudyActivity from '@/components/profile/StudyActivity.vue'
  import DailyGoals from '@/components/profile/DailyGoals.vue'
</script>

<style lang="scss" scoped>
.profile-view {
  padding: 2rem;
  min-height: 100vh;
  background: #0f0f0f;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-content {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 3rem;
  border: 1px solid #2d2d2d;
}

.coming-soon {
  text-align: center;
  padding: 4rem 2rem;
  
  .coming-soon-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: #f8fafc;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #94a3b8;
    font-size: 1.1rem;
  }
}
</style>
