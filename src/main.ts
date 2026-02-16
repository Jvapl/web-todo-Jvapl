import './style.css'
const inputTodo = document.querySelector('#todo-input') as HTMLInputElement
const buttonAdd = document.querySelector(
  '#add-todo-button',
) as HTMLButtonElement
const todoElements = document.querySelector(
  '#todo-elements',
) as HTMLUListElement
const errorInput = document.querySelector('#error') as HTMLParagraphElement

const addElement = () => {
  const text = inputTodo.value.trim()
  if (!text) {
    errorInput.removeAttribute('hidden')
    return
  }
  errorInput.setAttribute('hidden', '')
  const newLi = document.createElement('li')
  newLi.textContent = text
  todoElements.appendChild(newLi)
  inputTodo.value = ''
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addElement()
  }
})
buttonAdd.addEventListener('click', () => {
  addElement()
})
