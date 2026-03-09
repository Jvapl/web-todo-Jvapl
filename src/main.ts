import './style.css'
import { addElement } from './addElementsList'
import { updateOverdueAlert } from './overdueAlert'
import { reloadPage } from './reloadPages'
import { saveLocalStorage } from './saveToLocal'
import type { TaskType } from './types'

export const deleteAllTodo = document.querySelector<HTMLButtonElement>(
  '#task-to-do__remove-All-button',
)
export const buttonAdd =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
export const todoElements =
  document.querySelector<HTMLUListElement>('#todo-elements')
export const errorInput = document.querySelector<HTMLParagraphElement>('#error')
export const inputTodo = document.querySelector<HTMLInputElement>('#todo-input')
export const dateInput =
  document.querySelector<HTMLInputElement>('#todo-date-input')

export const taskTodo: TaskType[] = []

// Crée un type
if (
  !inputTodo ||
  !buttonAdd ||
  !todoElements ||
  !errorInput ||
  !deleteAllTodo
) {
  throw new Error(
    "Didn't find one or many DOM elements. Verify the IDs from index.html.",
  )
}
if (!dateInput) {
  throw new Error(
    "Could't find the 'todo-date-input DOM element. Verify the ID in index.html",
  )
}

updateOverdueAlert()
reloadPage()

inputTodo.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addElement()
  }
})
buttonAdd.addEventListener('click', () => {
  addElement()
})

let isConfirming = false

deleteAllTodo.addEventListener('click', () => {
  const warningTimeout = () => {
    taskTodo.length = 0
    saveLocalStorage()
    isConfirming = false
    deleteAllTodo.textContent = 'Delete All'
    updateOverdueAlert()
  }
  if (!isConfirming) {
    isConfirming = true
    deleteAllTodo.textContent = 'Are you sure ?'
    deleteAllTodo.classList.add('warning')
    setTimeout(warningTimeout, 3000)
  } else {
    warningTimeout()
    todoElements.innerHTML = ''
  }
})
