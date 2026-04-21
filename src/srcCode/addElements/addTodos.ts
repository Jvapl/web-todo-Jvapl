import { selectOption } from '../QuerySelector'
import { updateOverdueAlert } from '../reloadPages'
import { BothTC, type NewTask } from '../types'
import { postDataAPI } from './API'
import { postCategoryAPI } from './APIforCateTask'
import { displayTask } from './displayTaskAdd'

export const addElement = async (
  dateInput: HTMLInputElement,
  errorInput: HTMLParagraphElement,
  inputTodo: HTMLInputElement,
  taskTodo: NewTask[],
) => {
  const text: string = inputTodo.value.trim()
  if (!text) {
    errorInput.textContent = 'Please enter a task !!'
    errorInput.removeAttribute('hidden')
    return
  }

  const currentDate = new Date().toISOString().split('T')[0]
  if (dateInput.value && dateInput.value < currentDate) {
    errorInput.textContent = 'Choose a valid date !!'
    errorInput.removeAttribute('hidden')
    return
  }

  errorInput.setAttribute('hidden', '')
  const taskToSent: NewTask = {
    title: text,
    content: text,
    done: false,
    due_date: dateInput.value || null,
  }
  try {
    const fromServer = await postDataAPI(taskToSent)
    const finalTask = Array.isArray(fromServer) ? fromServer[0] : fromServer

    if (!finalTask || !finalTask.id) return

    const selectedCategoryId = selectOption?.value

    if (selectedCategoryId) {
      const association = {
        category_id: Number(selectedCategoryId),
        todo_id: finalTask.id,
      }
      await postCategoryAPI(association)
      BothTC.push(association)
    }
    taskTodo.push(finalTask)
    dateInput.value = ''
    inputTodo.value = ''
    if (selectOption) selectOption.value = ''
    displayTask(finalTask)
    updateOverdueAlert()
  } catch (error) {
    console.error("The task or association wasn't added", error)
  }
}
