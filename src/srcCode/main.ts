import '../disign/style.css'
import { deleteAPI } from './addElements/API'
import { addACategorie } from './addElements/addCategories'
import { addElement } from './addElements/addTodos'
import {
  buttonAdd,
  dateInput,
  deleteAllTodo,
  errorInput,
  inputTodo,
  todoElements,
} from './QuerySelector'
import { reloadPage } from './reloadPages'
import { categoryTodo, taskTodo } from './types'

const categoryInput = document.querySelector<HTMLInputElement>(
  '#category-name-input',
)
const categoryButtonAdd =
  document.querySelector<HTMLButtonElement>('#addCategoryButton')

if (!categoryButtonAdd || !categoryInput) {
  throw new Error("Couldn't find the required element(s) for categories.")
}

reloadPage()

if (inputTodo && dateInput && errorInput && buttonAdd) {
  const input = inputTodo
  const date = dateInput
  const error = errorInput
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addElement(date, error, input, taskTodo)
    }
  })

  buttonAdd.addEventListener('click', () => {
    addElement(date, error, input, taskTodo) // __________________________
  })
}

let isConfirming = false
let deleteTimer: number | undefined

if (deleteAllTodo && todoElements) {
  const btnDelete = deleteAllTodo
  const list = todoElements
  btnDelete.addEventListener('click', async () => {
    const resetBtn = () => {
      isConfirming = false
      btnDelete.textContent = 'Delete All'
      btnDelete.classList.remove('warning')
    }

    if (!isConfirming) {
      isConfirming = true
      btnDelete.textContent = 'Are you sure ?'
      btnDelete.classList.add('warning')
      deleteTimer = window.setTimeout(resetBtn, 3000)
    } else {
      clearTimeout(deleteTimer)
      try {
        await deleteAPI(taskTodo)
        taskTodo.length = 0
        list.innerHTML = ''
      } catch (error) {
        console.error('Delete failed: ', error)
      }
      list.innerHTML = ''
    }
  })
}
categoryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault() // prevents from the button and request firing twice
    addACategorie(errorInput as HTMLParagraphElement, categoryTodo)
  }
})
categoryButtonAdd.addEventListener('click', () => {
  addACategorie(errorInput as HTMLParagraphElement, categoryTodo)
})
