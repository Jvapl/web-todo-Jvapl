import {
  categoriesElements,
  categoryColor,
  deleteAllTodo,
  selectOption,
  todoElements,
} from '../QuerySelector'
import { updateOverdueAlert } from '../reloadPages'
import type { NewCategorie, NewTask } from '../types'
import { BothTC, categoryTodo, taskTodo } from '../types'
import { deleteAPI, updateAPI } from './API'
import { deleteAPICategory } from './APIcategories'

export const colorChangeDays = (selectedDate: string) => {
  const colorDay = [
    'var(--overdued-color-red)',
    'var(--overdued-color-orange)',
    'var(--overdued-color-yellow)',
    'var(--overdued-color-green)',
  ]

  if (selectedDate && selectedDate !== 'No due date') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const target = new Date(selectedDate)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return colorDay[0]
    if (diffDays === 0) return colorDay[1]
    if (diffDays <= 4) return colorDay[2]
    return colorDay[3]
  }
  return ''
}

export const displayTask = (text: NewTask) => {

  if (!todoElements || !deleteAllTodo) {
    throw new Error(
      "Didn't find one or many DOM elements. Verify the IDs from index.html.",
    )
  }
  const newLi = document.createElement('li')
  const spanCreated = document.createElement('span')
  const statusCheck = document.createElement('label')
  const checkBox = document.createElement('input')
  const removeButton = document.createElement('button')
  const dateLabel = document.createElement('p')
  const dateTimes = document.createElement('time')
  const dateLine = text.due_date ?? 'No due date'
  dateLabel.textContent = dateLine

  deleteAllTodo.textContent = 'Delete All'
  let taskStatusText = 'Uncompleted'
  removeButton.textContent = 'Remove'
  statusCheck.textContent = taskStatusText
  checkBox.type = 'checkbox'
  newLi.classList.add('task-to-do')
  dateLabel.classList.add('dateTimeClass')
  spanCreated.classList.add('task-status-container')
  removeButton.classList.add('task-to-do__remove-button')

  const association = BothTC.find((a) => a.todo_id === text.id)

  const category = association
    ? categoryTodo.find((e) => e.id === association.category_id)
    : null

  const categoryName = document.createElement('span')
  categoryName.style.marginRight = '10px'
  categoryName.style.fontWeight = 'bold'

  if (category) {
    categoryName.textContent = `[${category.title}]`
    newLi.style.border = `2px solid ${category.color}`
    spanCreated.appendChild(categoryName) /// - -------------------------------------
  }

  if (text.due_date) {
    const taskColor = colorChangeDays(text.due_date)
    if (taskColor) {
      newLi.style.backgroundColor = taskColor
    }
  }

  const statusBox = async () => {
    if (checkBox.checked) {
      taskStatusText = 'Completed'
      statusCheck.textContent = taskStatusText
      spanCreated.style.color = 'var(--completed-task-color)'
    } else {
      taskStatusText = 'Uncompleted'
      statusCheck.textContent = taskStatusText
      spanCreated.style.color = ''
    }
    updateOverdueAlert()
  }
  checkBox.addEventListener('change', async () => {
    statusBox()
    if (text.id === undefined) return

    const originalState = text.done
    text.done = checkBox.checked

    try {
      await updateAPI(text.id, checkBox.checked)
    } catch (error) {
      console.error('Failed to update task status:', error)
      text.done = originalState
      checkBox.checked = originalState
      statusBox()
    }
  })

  removeButton.addEventListener('click', async () => {
    try {
      await deleteAPI([text])
      newLi.remove()

      const taskIndex = taskTodo.findIndex((e) => e.id === text.id)
      if (taskIndex > -1) {
        taskTodo.splice(taskIndex, 1)
      }
      updateOverdueAlert()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  })
  checkBox.checked = text.done
  statusBox()
  const taskName = document.createElement('span')
  taskName.textContent = text.title
  newLi.appendChild(taskName)
  spanCreated.appendChild(removeButton)
  spanCreated.appendChild(statusCheck)
  dateTimes.appendChild(dateLabel)
  spanCreated.appendChild(dateTimes)
  spanCreated.appendChild(checkBox)
  newLi.appendChild(spanCreated)
  todoElements.appendChild(newLi)
}

// Fonction pour déterminer si le texte doit être noir ou blanc
const getContrastColor = (hexColor: string): string => {
  // On retire le '#' pour avoir 'RRGGBB'
  const hex = hexColor.replace('#', '')

  // On extrait les composants R G B avec substring
  const r = Number(`0x${hex.substring(0, 2)}`)
  const g = Number(`0x${hex.substring(2, 4)}`)
  const b = Number(`0x${hex.substring(4, 6)}`)

  // Calcul de la luminosité (formule de luminance relative)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Si c'est clair (> 128) on écrit en noir sinon en blanc.
  return brightness > 128 ? 'black' : 'white'
}

let activeCategoryID: number | null = null
export const displayCategory = (text: NewCategorie) => {

  if (!categoryColor) return
  if (!categoriesElements) {
    throw new Error(
      "Didn't find one or many DOM elements. Verify the IDs from index.html.",
    )
  }
  const newCategory = document.createElement('a')
  const spanCreated = document.createElement('span')
  const removeButton = document.createElement('button')

  removeButton.textContent = 'Remove'
  newCategory.classList.add('category-to-do')
  removeButton.classList.add('task-to-do__remove-button')

  const bgColor = text.color || '#FFFFFF'
  newCategory.style.background = bgColor
  newCategory.style.color = getContrastColor(bgColor)

  removeButton.addEventListener('click', async () => {
    try {
      await deleteAPICategory([text])
      newCategory.remove()
      const taskIndex = categoryTodo.findIndex((e) => e.id === text.id)
      if (taskIndex > -1) {
        taskTodo.splice(taskIndex, 1)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  })

  newCategory.addEventListener('click', () => {
    if (text.id === undefined) {
      throw new Error("This category isn't validated")
    }

    if (activeCategoryID === text.id) {
      // Reset
      activeCategoryID = null
      if (todoElements) {
        todoElements.innerHTML = ''
        taskTodo.forEach((task) => {
          displayTask(task)
        })
      }
    } else {
      // Filtrage
      const filteredTasks = taskTodo.filter((task) => {
        return BothTC.some(

          (association) =>
            association.category_id === text.id &&
            association.todo_id === task.id,
        )
      })

      if (filteredTasks.length === 0) {

        return
      }

      activeCategoryID = text.id
      if (todoElements) {
        todoElements.innerHTML = ''
        filteredTasks.forEach((task) => {
          displayTask(task)
        })
      }
    }
  })

  const categoryName = document.createElement('span')
  categoryName.textContent = text.title
  newCategory.appendChild(categoryName)
  spanCreated.appendChild(removeButton)
  newCategory.appendChild(spanCreated)
  categoriesElements.appendChild(newCategory)
}

export const updateCategorySelect = (categories: NewCategorie[]) => {
  if (!selectOption) throw new Error('selectOption not find')
  selectOption.innerHTML = '<option value="">No category</option>'
  categories.forEach((cat) => {
    if (!selectOption) throw new Error('selectOption not find')
    const option = document.createElement('option')
    option.value = cat.id?.toString() || '' 
    option.textContent = cat.title 
    selectOption.appendChild(option)
  })
}
