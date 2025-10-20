<template>
  <section class="team-section">
    <div class="section-header">
      <h2>{{ $t('about.team.title') }}</h2>
      <p class="section-subtitle">{{ $t('about.team.subtitle') }}</p>
    </div>

    <div class="team-grid">
      <div class="team-member main-developer">
        <div class="member-avatar">
          <div class="avatar-icon">👨‍💻</div>
        </div>
        <div class="member-info">
          <h3 class="member-name">Ахмед Малачиев</h3>
          <p class="member-role">{{ $t('about.team.roles.fullStack') }}</p>
          <p class="member-bio">{{ $t('about.team.bio') }}</p>
          
          <div class="member-skills">
            <span class="skill-tag">Vue.js</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">Node.js</span>
            <span class="skill-tag">SCSS</span>
            <span class="skill-tag">UI/UX Design</span>
          </div>
          
          <div class="member-links">
            <a href="#" class="social-link">GitHub</a>
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">Telegram</a>
          </div>
        </div>
      </div>
    </div>

    <div class="contributors-section">
      <h3>{{ $t('about.team.contributors') }}</h3>
      <div class="contributors-grid">
        <div class="contributor-card">
          <div class="contributor-avatar">👤</div>
          <div class="contributor-info">
            <h4>{{ $t('about.team.community') }}</h4>
            <p>{{ $t('about.team.communityDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.team-section {
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

.team-grid {
  max-width: 800px;
  margin: 0 auto 4rem;
}

.team-member {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  
  &.main-developer {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, #1a1a1a, #8b5cf620);
  }
}

.member-avatar {
  .avatar-icon {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }
}

.member-info {
  flex: 1;
  
  .member-name {
    color: #f8fafc;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .member-role {
    color: #8b5cf6;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .member-bio {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .skill-tag {
    background: #2d2d2d;
    color: #f8fafc;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 1px solid #3d3d3d;
  }
}

.member-links {
  display: flex;
  gap: 1rem;
  
  .social-link {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border: 1px solid #8b5cf6;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: #8b5cf6;
      color: white;
    }
  }
}

.contributors-section {
  max-width: 800px;
  margin: 0 auto;
  
  h3 {
    color: #f8fafc;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }
}

.contributors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contributor-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  
  .contributor-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #2d2d2d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1rem;
  }
  
  h4 {
    color: #f8fafc;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .team-member {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
  
  .member-links {
    justify-content: center;
  }
  
  .member-skills {
    justify-content: center;
  }
}
</style>