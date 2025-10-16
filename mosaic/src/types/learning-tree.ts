export interface TreeSkill {
  id: string
  title: string
  description: string
  level: number
  category: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'writing' | 'reading'
  status: 'locked' | 'unlocked' | 'completed'
  progress: number
  nextSkills: string[] // ID следующих навыков
  prerequisites: string[] // ID необходимых навыков
  rewards: {
    xp: number
    badges?: string[]
  }
  estimatedTime: string
  exercises: number
  position: {
    row: number
    column: number
  }
}

export interface LearningTree {
  language: string
  currentLevel: number
  totalXP: number
  skills: TreeSkill[]
}