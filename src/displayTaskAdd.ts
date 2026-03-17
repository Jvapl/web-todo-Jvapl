import { colorChangeDays } from './changeColorsDaily'
import { deleteAPI, updateAPI } from './dataFromAPI'
import { deleteAllTodo, taskTodo, todoElements } from './main'
import { updateOverdueAlert } from './overdueAlert'
import type { newTask } from './types'

export const displayTask = (text: newTask) => {
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
    if (text.id !== undefined) {
      text.done = checkBox.checked
      await updateAPI(text.id, checkBox.checked)
    }
  })

  removeButton.addEventListener('click', async () => {
    await deleteAPI([text])
    newLi.remove()
    const taskIndex = taskTodo.findIndex((e) => e.id === text.id) // trouver la tâche par ID
    if (taskIndex > -1) {
      taskTodo.splice(taskIndex, 1)
    }
    updateOverdueAlert()
  })
  checkBox.checked = text.done
  statusBox()
  const taskName = document.createElement('span')
  taskName.textContent = text.title
  newLi.appendChild(taskName)
  newLi.appendChild(spanCreated)
  spanCreated.appendChild(removeButton)
  spanCreated.appendChild(statusCheck)
  dateTimes.appendChild(dateLabel)
  spanCreated.appendChild(dateTimes)
  spanCreated.appendChild(checkBox)
  newLi.appendChild(spanCreated)
  todoElements.appendChild(newLi)
}
