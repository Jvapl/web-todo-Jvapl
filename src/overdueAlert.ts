import { taskTodo } from './main'

export const updateOverdueAlert = () => {
  const overdueMsg =
    document.querySelector<HTMLParagraphElement>('#overdue-message')
  if (!overdueMsg) {
    throw new Error("Could not find the '#overdue-message' element in the DOM.")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0) // mets l'heure a 00:00

  const UrgentOverdue = taskTodo.some((task) => {
    // .some Est une commende qui fais le cacul et return true ou false
    if (!task.date || task.date === 'No due date') return false

    const target = new Date(task.date)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // arrondi mon nombre en jours

    return diffDays <= 4 && !task.verify //return que les nombres qui sont plus petit ou egaux a 4 sinon il retourne "no due date" si zero inputDate
  })

  if (UrgentOverdue) {
    overdueMsg.removeAttribute('hidden')
  } else {
    overdueMsg.setAttribute('hidden', '')
  }
}
