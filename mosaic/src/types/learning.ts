export interface Skill {
  id: string
  title: string
  description: string
  level: number
  category: 'basics' | 'grammar' | 'vocabulary' | 'conversation' | 'business'
  status: 'locked' | 'available' | 'completed'
  progress: number
  duration: string
  exercises: number
  xp: number
  nextSkills: string[]
  requiredSkills: string[]
}

export interface LanguagePath {
  language: string
  flag: string
  color: string
  currentLevel: number
  totalXP: number
  skills: Skill[]
}