import type { NewCategorie, NewTask } from '../types'

const url = 'https://api.todos.in.jt-lab.ch/todos'
// Create
// ## API Ajouter une tache à l'API -----
// envoie une nouvelle tache à l'API pour l'enregistrer en base de données

export async function postDataAPI(taskToSent: NewTask) {
  // L'adresse pour les taches

  const reponse = await fetch(url, {
    method: 'POST', // on precise qu'on ENVOIE
    headers: {
      'Content-Type': 'application/json', // on dit à l'API qu'on envoie du JSON
      Prefer: 'return=representation', //on dit à l'API de retourner la tache que j'ai ajoutée
    },
    body: JSON.stringify(taskToSent), // on transforme l'objet en texte JSON
  })
  if (!reponse.ok) {
    const erreur = await reponse.text()
    console.error('Add task Error error:', erreur)
    throw new Error('Undefined') // dit au code que c'est faux et return rien
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
      //Si j'ai bien compris je prends url en format postGres et je prends sur les task.id
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) {
        console.error(`Remove date Error ${task.id}:`, res.status)
      }
    }),
  )
  await Promise.all(deletePromises) // execute toutes les taches d'une seule foix (delete)
}

// ## API Modifier une tache de l'API -----

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
//async est une commende qui dit a mon code que cette function prendras plus de temps
//await est une commende qui dit a mon code d'attendre un reponse et aussi fetch
//recupère les informations dans mon JSON --

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

// export async function updateAPICategory(id: number) {
//   const response = await fetch(`${urlCategory}?id=eq.${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(),
//   })
//   if (!response.ok) {
//     const errorText = await response.text()
//     console.error(`Failed to update categorie ${id}:`, errorText)
//     throw new Error(`Failed to update categorie ${id}`)
//   }
// }

// export async function postInfoAPI<D>(url: <D>, sendAPI: <D>) {
//   // L'adresse pour les taches

//   const reponse = await fetch(url, {
//     method: 'POST', // on precise qu'on ENVOIE
//     headers: {
//       'Content-Type': 'application/json', // on dit à l'API qu'on envoie du JSON
//       Prefer: 'return=representation', //on dit à l'API de retourner la tache que j'ai ajoutée
//     },
//     body: JSON.stringify(sendAPI), // on transforme l'objet en texte JSON
//   })
//   if (!reponse.ok) {
//     const erreur = await reponse.text()
//     console.error('Add task Error error:', erreur)
//     throw new Error('Undefined') // dit au code que c'est faux et return rien
//   }

//   const resultat = await reponse.json()

//   if (!resultat) throw new Error('Undefined')
//   return resultat
// }
