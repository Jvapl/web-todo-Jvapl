import type { NewTask } from '../types'

const url = 'https://api.todos.in.jt-lab.ch/todos'

// ## API Ajouter une tache à l'API -----

export async function postDataAPI(taskToSent: NewTask) {

  const reponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation', 
    },
    body: JSON.stringify(taskToSent),
  })
  if (!reponse.ok) {
    const erreur = await reponse.text()
    console.error('Add task Error error:', erreur)
    throw new Error('Undefined')
  }

  const resultat = await reponse.json()

  if (!resultat) throw new Error('Undefined')
  return resultat
}

export async function appelerAPI() {
  const response = await fetch(url)
  if (!response.ok) {
    console.error('Recuperation tasks Error')
    throw new Error('Undefined')
  }
  const donnee = await response.json()
  return donnee
}

// ## API Suprimer une tache de l'API -----

export async function deleteAPI(tasks: NewTask[]) {
  const deletePromises = tasks.map((task) =>
    fetch(`${url}?id=eq.${task.id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) {
        console.error(`Remove date Error ${task.id}:`, res.status)
      }
    }),
  )
  await Promise.all(deletePromises)
}

export async function updateAPI(id: number, done: boolean) {
  const response = await fetch(`${url}?id=eq.${id}`, {
    method: 'PATCH', //update l'infomation avec l'id
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ done }),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Failed to update task ${id}:`, errorText)
    throw new Error(`Failed to update task ${id}`)
  }
}
