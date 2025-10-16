export interface SkillNode {
  id: string
  title: string
  description: string
  level: number
  category: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'writing' | 'reading'
  status: 'locked' | 'unlocked' | 'completed'
  progress: number
  dependencies: string[] // ID узлов, от которых зависит этот навык
  rewards: {
    xp: number
    badges?: string[]
  }
  estimatedTime: string
  exercises: number
}

export interface LearningPath {
  language: string
  currentLevel: number
  totalXP: number
  nextLevelXP: number
  skills: SkillNode[]
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  progress: number
  type: 'streak' | 'mastery' | 'completion' | 'speed'
}

export interface Connection {
  id: string
  from: string // ID исходного узла
  to: string   // ID целевого узла
  path: string // SVG path data
  status: 'completed' | 'unlocked' | 'locked'
}