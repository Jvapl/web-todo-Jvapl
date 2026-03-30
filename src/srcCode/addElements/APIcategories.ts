import type { NewCategorie } from '../types'

const urlCategory = 'https://api.todos.in.jt-lab.ch/categories'

export async function postCategoryAPI(taskToSent: NewCategorie) {
  const reponse = await fetch(urlCategory, {
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

export async function appelerAPICategory() {
  const response = await fetch(urlCategory)
  if (!response.ok) {
    console.error('Recuperation category Error')
    throw new Error('Undefined')
  }
  const donnee = await response.json()

  return donnee
}

// ## API Suprimer une tache de l'API -----

export async function deleteAPICategory(tasks: NewCategorie[]) {
  const deletePromises = tasks.map((task) =>
    fetch(`${urlCategory}?id=eq.${task.id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) {
        console.error(`Remove date Error ${task.id}:`, res.status)
      }
    }),
  )
  await Promise.all(deletePromises)
}
