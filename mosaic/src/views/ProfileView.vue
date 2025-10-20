<template>
  <div class="profile-view">
    <!-- 1. Шапка пользователя -->
    <UserHeader />
    
    <div class="profile-content">
      <!-- Левая колонка -->
      <div class="left-column">
        <!-- 2. Активные курсы -->
        <ActiveCourses />
        
        <!-- 3. Ежедневные цели -->
        <DailyGoals />
      </div>
      
      <!-- Правая колонка -->
      <div class="right-column">
        <!-- 4. Статистика прогресса -->
        <ProgressStats />
        
        <!-- 5. Достижения -->
        <AchievementShowcase />
        
        <!-- 6. Активность -->
        <StudyActivity />
      </div>
    </div>
  </div>
</template>