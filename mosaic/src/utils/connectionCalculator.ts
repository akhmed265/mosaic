import type { SkillNode, Connection } from '@/types/learning-map'

interface NodePosition {
  id: string
  x: number
  y: number
  level: number
}

export function calculateConnections(skills: SkillNode[]): Connection[] {
  const connections: Connection[] = []
  
  // Рассчитываем позиции для всех узлов
  const nodePositions = calculateNodePositions(skills)
  
  skills.forEach(skill => {
    skill.dependencies.forEach(depId => {
      const fromSkill = skills.find(s => s.id === depId)
      const toSkill = skill
      
      if (fromSkill && toSkill) {
        const fromPos = nodePositions.find(p => p.id === fromSkill.id)
        const toPos = nodePositions.find(p => p.id === toSkill.id)
        
        if (fromPos && toPos) {
          const connection = calculateConnectionPath(fromPos, toPos, toSkill.status)
          connections.push(connection)
        }
      }
    })
  })
  
  return connections
}

function calculateNodePositions(skills: SkillNode[]): NodePosition[] {
  const positions: NodePosition[] = []
  
  // Группируем навыки по уровням
  const skillsByLevel: { [level: number]: SkillNode[] } = {}
  skills.forEach(skill => {
    if (!skillsByLevel[skill.level]) {
      skillsByLevel[skill.level] = []
    }
    skillsByLevel[skill.level].push(skill)
  })
  
  // Рассчитываем позиции для каждого уровня
  Object.keys(skillsByLevel).forEach(levelStr => {
    const level = parseInt(levelStr)
    const levelSkills = skillsByLevel[level]
    
    levelSkills.forEach((skill, index) => {
      const x = level * 300 + 100 // Горизонтальное смещение по уровням
      const y = 100 + index * 120 // Вертикальное расположение внутри уровня
      
      positions.push({
        id: skill.id,
        x,
        y,
        level
      })
    })
  })
  
  return positions
}

function calculateConnectionPath(from: NodePosition, to: NodePosition, status: string): Connection {
  // Создаем изогнутый путь с контрольными точками
  const startX = from.x + 140 // Середина правого края исходного узла
  const startY = from.y + 35  // Центр по вертикали
  
  const endX = to.x - 10      // Левый край целевого узла
  const endY = to.y + 35      // Центр по вертикали
  
  // Контрольные точки для изгиба
  const controlX1 = startX + (endX - startX) * 0.5
  const controlY1 = startY
  const controlX2 = controlX1
  const controlY2 = endY
  
  const path = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
  
  return {
    id: `${from.id}-${to.id}`,
    from: from.id,
    to: to.id,
    path,
    status: status as 'completed' | 'unlocked' | 'locked'
  }
}

// Экспортируем также функцию для получения позиций узлов
export function getNodePositions(skills: SkillNode[]): NodePosition[] {
  return calculateNodePositions(skills)
}