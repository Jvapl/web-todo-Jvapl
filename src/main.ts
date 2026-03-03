import './style.css'
const deleteAllTodo = document.querySelector<HTMLButtonElement>(
  '#task-to-do__remove-All-button',
)
const overdueMsg =
  document.querySelector<HTMLParagraphElement>('#overdue-message')
const buttonAdd = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoElements = document.querySelector<HTMLUListElement>('#todo-elements')
const errorInput = document.querySelector<HTMLParagraphElement>('#error')
const inputTodo = document.querySelector<HTMLInputElement>('#todo-input')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')

let taskTodo: TaskType[] = []

// Crée un type
interface TaskType {
  id: number
  name: string
  verify: boolean
  date: string
}

if (
  !inputTodo ||
  !buttonAdd ||
  !todoElements ||
  !errorInput ||
  !deleteAllTodo ||
  !overdueMsg
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

const saveLocalStorage = () => {
  localStorage.setItem('taskTodo', JSON.stringify(taskTodo)) // Je transforme mes taskTodo en string et je le mets en format JSON dans mon local storage
}
const updateOverdueAlert = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // mets l'heure a 00:00

  const UrgentOverdue = taskTodo.some((task) => {
    if (!task.date || task.date === 'No due date') return false

    const target = new Date(task.date)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // arrondi mon nombre en jours

    return diffDays <= 4 && !task.verify //return la differance entre le nombre choisi et le 4
  })

  if (UrgentOverdue) {
    overdueMsg.removeAttribute('hidden')
  } else {
    overdueMsg.setAttribute('hidden', '')
  }
}
const colorChangeDays = (selectedDate: string) => {
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

// crée ma todo comme une liste
const displayTask = (text: TaskType) => {
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
    taskTodo = taskTodo.filter((e) => e.id !== text.id)
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

// Mon reload est pour que quand ça reload la page ça recharge tout
const reload = localStorage.getItem('taskTodo')
if (reload) {
  try {
    const savedTasks: TaskType[] = JSON.parse(reload)
    taskTodo.push(...savedTasks)
    taskTodo.forEach((taskText) => {
      displayTask(taskText)
    })
    updateOverdueAlert()
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
  taskTodo.push(newTask)
  displayTask(newTask)
  dateInput.value = ''
  inputTodo.value = ''
  saveLocalStorage()
  updateOverdueAlert()
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
