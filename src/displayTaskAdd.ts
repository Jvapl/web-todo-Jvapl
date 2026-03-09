import { colorChangeDays } from './changeColorsDaily'
import { deleteAllTodo, taskTodo, todoElements } from './main'
import { updateOverdueAlert } from './overdueAlert'
import { saveLocalStorage } from './saveToLocal'
import type { TaskType } from './types'

export const displayTask = (text: TaskType) => {
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
  const dateLine = text.date || 'No due date'
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

  const taskColor = colorChangeDays(text.date)
  if (taskColor) {
    newLi.style.backgroundColor = taskColor
  }

  const statusBox = () => {
    if (checkBox.checked) {
      taskStatusText = 'Completed'
      statusCheck.textContent = taskStatusText
      spanCreated.style.color = 'var(--completed-task-color)'
    } else {
      taskStatusText = 'Uncompleted'
      statusCheck.textContent = taskStatusText
      spanCreated.style.color = ''
    }
    text.verify = checkBox.checked
    saveLocalStorage()
    updateOverdueAlert()
  }
  checkBox.addEventListener('change', () => {
    statusBox()
  })
  removeButton.addEventListener('click', () => {
    newLi.remove()
    const result = taskTodo.filter((e) => e.id !== text.id)
    taskTodo = result
    saveLocalStorage()
    updateOverdueAlert()
  })
  checkBox.checked = text.verify
  statusBox()
  newLi.textContent = text.name
  spanCreated.appendChild(removeButton)
  spanCreated.appendChild(statusCheck)
  dateTimes.appendChild(dateLabel)
  spanCreated.appendChild(dateTimes)
  spanCreated.appendChild(checkBox)
  newLi.appendChild(spanCreated)
  todoElements.appendChild(newLi)
}
