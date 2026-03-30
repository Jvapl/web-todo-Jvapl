import {
  categoriesElements,
  categoryColor,
  deleteAllTodo,
  todoElements,
} from '../QuerySelector'
import { updateOverdueAlert } from '../reloadPages'
import type { NewCategorie, NewTask } from '../types'
import { taskTodo } from '../types'
import { deleteAPI, deleteAPICategory, updateAPI } from './API'

export const colorChangeDays = (selectedDate: string) => {
  const colorDay = [
    'var(--overdued-color-red)', //crée une variable avec une couleur OBS(c'est plus facile si je veux changer de couleur après)
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

//ce bout de code je pourrais le changer.

export const displayTask = (text: NewTask) => {
  // je pourrais faire en sorte de transformer ceci en import
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

  // On extrait les composants R, G, B avec substring
  const r = Number(`0x${hex.substring(0, 2)}`)
  const g = Number(`0x${hex.substring(2, 4)}`)
  const b = Number(`0x${hex.substring(4, 6)}`)

  // Calcul de la luminosité (formule de luminance relative)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Si c'est clair (> 128), on écrit en noir. Sinon, en blanc.
  return brightness > 128 ? 'black' : 'white'
}

export const displayCategory = (text: NewCategorie) => {
  // je pourrais faire en sorte de transformer ceci en import
  if (!categoryColor) return
  if (!categoriesElements) {
    throw new Error(
      "Didn't find one or many DOM elements. Verify the IDs from index.html.",
    )
  }
  const NewCategory = document.createElement('li')
  const spanCreated = document.createElement('span')
  const removeButton = document.createElement('button')

  removeButton.textContent = 'Remove'
  NewCategory.classList.add('category-to-do')
  removeButton.classList.add('task-to-do__remove-button')

  const bgColor = text.color || '#FFFFFF'
  NewCategory.style.background = bgColor
  NewCategory.style.color = getContrastColor(bgColor)

  removeButton.addEventListener('click', async () => {
    try {
      await deleteAPICategory([text])
      NewCategory.remove()
      const taskIndex = taskTodo.findIndex((e) => e.id === text.id)
      if (taskIndex > -1) {
        taskTodo.splice(taskIndex, 1)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  })
  const categoryName = document.createElement('span')
  categoryName.textContent = text.title
  NewCategory.appendChild(categoryName)
  spanCreated.appendChild(removeButton)
  NewCategory.appendChild(spanCreated)
  categoriesElements.appendChild(NewCategory)
}
