import './style.css'
const buttonAdd = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoElements = document.querySelector<HTMLUListElement>('#todo-elements')
const errorInput = document.querySelector<HTMLParagraphElement>('#error')
const inputTodo = document.querySelector<HTMLInputElement>('#todo-input')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')
const deleteAllTodo = document.querySelector<HTMLButtonElement>(
  '#task-to-do__remove-All-button',
)
let taskTodo: TaskType[] = []

// Crée un type
interface TaskType {
  id: number
  name: string
  verify: boolean
  date: string
}

// Check si touts mes elements existent vraiment dans mon HTML
if (
  !inputTodo ||
  !buttonAdd ||
  !todoElements ||
  !errorInput ||
  !deleteAllTodo
) {
  throw new Error(
    "Didn't find one or many DOM elements. Verify the IDs from index.html.", //
  )
}
if (!dateInput) {
  throw new Error(
    "Could't find the 'todo-date-input DOM element. Verify the ID in index.html",
  )
}

const saveLocalStorage = () => {
  localStorage.setItem('taskTodo', JSON.stringify(taskTodo))
}
//Regarde si il y a une grande difference entre la date actuelle et la date qui a été input
const colorChangeDays = (selectedDate: string) => {
  const colorDay = ['#FF0000', '#FF7F00', '#FFFF00', '#008000']

  if (selectedDate && selectedDate !== 'No due date') {
    const today = new Date()
    today.setHours(0, 0, 0, 0) //mets l'heure a 00:00

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

// crée ma todo comme une liste
const displayTask = (text: TaskType) => {
  const newLi = document.createElement('li') //label + input("checkBox") -> span + les li
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
      saveLocalStorage()
    } else {
      taskStatusText = 'Uncompleted'
      statusCheck.textContent = taskStatusText
      spanCreated.style.color = ''
      saveLocalStorage()
    }
  }

  checkBox.addEventListener('change', () => {
    text.verify = checkBox.checked
    statusBox()
  })
  //filtre les id des li avec les boutons que j'ai clické et les sauvegardes
  removeButton.addEventListener('click', () => {
    newLi.remove()
    taskTodo = taskTodo.filter((e) => e.id !== text.id)
    saveLocalStorage()
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

// Mon reload est pour que quand ça reload la page ça recharge tout
const reload = localStorage.getItem('taskTodo')
if (reload) {
  try {
    const savedTasks: TaskType[] = JSON.parse(reload)
    taskTodo.push(...savedTasks)
    taskTodo.forEach((taskText) => {
      displayTask(taskText)
    })
  } catch (e) {
    console.error('Failed to parse tasks from localStorage', e)
    localStorage.removeItem('taskTodo')
  }
}

const addElement = () => {
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
    errorInput.textContent = 'Chose a valid date !!'
    errorInput.removeAttribute('hidden')
    return
  }
  errorInput.setAttribute('hidden', '')
  displayTask(newTask)
  taskTodo.push(newTask)
  dateInput.value = ''
  inputTodo.value = ''
  const tasksJson = JSON.stringify(taskTodo)
  localStorage.setItem('taskTodo', tasksJson)
}

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
