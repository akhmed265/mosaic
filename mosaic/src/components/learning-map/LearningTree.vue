<template>
  <div class="learning-tree">
    <!-- Заголовок языка -->
    <div class="tree-header">
      <h2>Древо развития: {{ language }}</h2>
      <p>Изучайте навыки последовательно, двигаясь от основ к продвинутым темам</p>
    </div>

    <!-- Древо навыков -->
    <div class="tree-container">
      <!-- Уровни (ряды) -->
      <div 
        v-for="row in rows" 
        :key="row" 
        class="tree-row"
        :class="`row--${row}`"
      >
        <div class="row-label">
          Уровень {{ row }}
        </div>
        
        <!-- Навыки в ряду -->
        <div class="skills-in-row">
          <TreeSkillNode
            v-for="skill in getSkillsByRow(row)"
            :key="skill.id"
            :skill="skill"
            :language="language"
            @select="handleSkillSelect"
          />
        </div>
      </div>

      <!-- Соединительные линии -->
      <svg class="tree-connections" width="100%" height="100%">
        <path
          v-for="connection in connections"
          :key="connection.id"
          :d="connection.path"
          class="connection-line"
          :class="`connection--${connection.status}`"
        />
      </svg>
    </div>

    <!-- Легенда -->
    <div class="tree-legend">
      <div class="legend-item">
        <div class="legend-color completed"></div>
        <span>Завершено</span>
      </div>
      <div class="legend-item">
        <div class="legend-color unlocked"></div>
        <span>Доступно</span>
      </div>
      <div class="legend-item">
        <div class="legend-color locked"></div>
        <span>Заблокировано</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LearningTree, TreeSkill } from '@/types/learning-tree'
import TreeSkillNode from '@/components/learning-map/TreeSkillNode.vue'

const props = defineProps<{
  treeData: LearningTree
  language: string
}>()

const emit = defineEmits<{
  select: [skill: TreeSkill]
}>()

// Все ряды (уровни) в древе
const rows = computed(() => {
  const levels = props.treeData.skills.map(skill => skill.position.row)
  return [...new Set(levels)].sort((a, b) => a - b)
})

// Навыки по рядам
const getSkillsByRow = (row: number) => {
  return props.treeData.skills.filter(skill => skill.position.row === row)
    .sort((a, b) => a.position.column - b.position.column)
}

// Соединения между навыками
const connections = computed(() => {
  const connections: any[] = []
  
  props.treeData.skills.forEach(skill => {
    skill.nextSkills.forEach(nextSkillId => {
      const nextSkill = props.treeData.skills.find(s => s.id === nextSkillId)
      if (nextSkill) {
        const connection = calculateConnection(skill, nextSkill)
        connections.push(connection)
      }
    })
  })
  
  return connections
})

// Расчет пути соединения
const calculateConnection = (from: TreeSkill, to: TreeSkill) => {
  const fromCol = from.position.column
  const fromRow = from.position.row
  const toCol = to.position.column
  const toRow = to.position.row
  
  const startX = 120 + fromCol * 200
  const startY = 100 + fromRow * 150
  const endX = 120 + toCol * 200
  const endY = 100 + toRow * 150
  
  // Простой путь для демонстрации
  const path = `M ${startX} ${startY} L ${endX} ${endY}`
  
  return {
    id: `${from.id}-${to.id}`,
    path,
    status: to.status
  }
}

const handleSkillSelect = (skill: TreeSkill) => {
  if (skill.status !== 'locked') {
    emit('select', skill)
  }
}
</script>

<style lang="scss" scoped>
.learning-tree {
  padding: 2rem;
}

.tree-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    color: #f8fafc;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #94a3b8;
    font-size: 1.1rem;
  }
}

.tree-container {
  position: relative;
  min-height: 600px;
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2d2d2d;
}

.tree-row {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  
  .row-label {
    width: 100px;
    color: #94a3b8;
    font-weight: 600;
    font-size: 0.9rem;
    text-align: center;
    flex-shrink: 0;
  }
  
  .skills-in-row {
    display: flex;
    gap: 1rem;
    flex: 1;
    justify-content: center;
  }
}

.tree-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-line {
  fill: none;
  stroke-width: 2;
  
  &.connection--completed {
    stroke: #10b981;
  }
  
  &.connection--unlocked {
    stroke: #8b5cf6;
  }
  
  &.connection--locked {
    stroke: #64748b;
    stroke-dasharray: 3, 3;
  }
}

.tree-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #2d2d2d;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
  
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    
    &.completed {
      background: #10b981;
    }
    
    &.unlocked {
      background: #8b5cf6;
    }
    
    &.locked {
      background: #64748b;
    }
  }
}
</style>