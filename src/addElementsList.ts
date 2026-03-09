import { displayTask } from './displayTaskAdd'
import { dateInput, errorInput, inputTodo, taskTodo } from './main'
import { updateOverdueAlert } from './overdueAlert'
import { saveLocalStorage } from './saveToLocal'
import type { TaskType } from './types'

export const addElement = () => {
  if (!inputTodo || !errorInput || !dateInput) {
    throw new Error(
      "Didn't find one or many DOM elements. Verify the IDs from index.html.",
    )
  }
  const text: string = inputTodo.value.trim()
  if (!text) {
    errorInput.textContent = 'Please enter a task !!'
    errorInput.removeAttribute('hidden')
    return
  }

  const currentDate = new Date().toISOString().split('T')[0]
  const newTask: TaskType = {
    id: Date.now(),
    name: text,
    verify: false,
    date: dateInput.value || 'No due date',
  }

  // verifie si la date est valide.
  if (dateInput.value && dateInput.value < currentDate) {
    errorInput.textContent = 'Choose a valid date !!'
    errorInput.removeAttribute('hidden')
    return
  }
  errorInput.setAttribute('hidden', '')
  taskTodo.push(newTask)
  displayTask(newTask)
  dateInput.value = ''
  inputTodo.value = ''
  saveLocalStorage()
  updateOverdueAlert()
}
