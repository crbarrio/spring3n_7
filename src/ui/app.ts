import { sessionState } from '../state'
import { restoreSession, signOut } from '../services/auth'
import { fetchTasks, createTask, completeTask, deleteTask } from '../services/tasks'
import { renderLogin, clearLogin } from './login'

const appRoot = document.querySelector<HTMLDivElement>('#app')!
const actionButtonClass = 'btn btn-sm d-inline-flex align-items-center justify-content-center lh-1'
const actionIconClass = 'material-icons d-block pe-none'

const renderTasks = async () => {
  const taskList = document.getElementById('task-list')
  if (!taskList) return

  const tasks = await fetchTasks()

  if (!tasks.length) {
    taskList.innerHTML = 'No tasks found'
    return
  }

  let tasksHtml = '<table class="table table-borderless"><caption class="visually-hidden">Lista de tareas del usuario</caption><thead><tr><th scope="col">Task</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>'

  tasks.forEach((task) => {
    let actionsHtml = ''
    const taskName = task.tarea ?? 'Untitled task'

    if (task.completada) {
      actionsHtml = `<td class="col-3"><button type="button" class="${actionButtonClass} btn-outline-danger delete-btn" data-id="${task.id_tarea}" aria-label="Delete task ${taskName}"><i class="${actionIconClass}" aria-hidden="true">delete</i></button></td>`
    } else {
      actionsHtml = `<td class="col-3">
      <button type="button" class="${actionButtonClass} btn-outline-success complete-btn" data-id="${task.id_tarea}" aria-label="Mark task ${taskName} as completed"><i class="${actionIconClass}" aria-hidden="true">check</i></button>
      <button type="button" class="${actionButtonClass} btn-outline-danger delete-btn" data-id="${task.id_tarea}" aria-label="Delete task ${taskName}"><i class="${actionIconClass}" aria-hidden="true">delete</i></button>
    </td>`
    }

    tasksHtml += `<tr><th scope="row">${taskName}</th><td>${task.completada ? 'Completada' : 'Pendiente'}</td>${actionsHtml}</tr>`
  })

  tasksHtml += '</tbody></table>'
  taskList.innerHTML = tasksHtml
}

export const renderApp = async () => {
  clearLogin()

  appRoot.innerHTML = `
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-4">
    <h1 class="ms-3 h4" id="app-title">Supabase Test</h1>
    <p class="ms-auto me-3 mb-0" aria-label="Current signed in user">${sessionState.userEmail ?? ''}</p>
	  <button class="btn btn-outline-danger me-3" id="logout-button">Logout</button>
	</nav>

  <main class="container" aria-labelledby="app-title">
	  <div class="row">
    <section class="col-md-8" aria-labelledby="task-list-title">
      <h2 class="h5 mb-5" id="task-list-title">Task List</h2>
      <div id="task-list" aria-live="polite" aria-busy="false"></div>
    </section>
    <section class="col-md-4" aria-labelledby="task-form-title">
      <h2 class="h5 mb-5" id="task-form-title">Add New Task</h2>
      <form id="task-form" aria-describedby="error-message">
			<div class="mb-3">
			  <label for="task-input" class="form-label fw-bold">Task</label>
        <input type="text" class="form-control" id="task-input" name="task" required placeholder="Enter a new task">
			</div>
      <button type="submit" class="btn btn-outline-primary" id="add-task-button">Add Task</button>
		  </form>
      <p id="error-message" class="mt-3 text-danger mb-0" role="alert" aria-live="assertive" aria-atomic="true"></p>
    </section>
	  </div>
  </main>`

  const taskForm = document.getElementById('task-form') as HTMLFormElement | null
  const logoutButton = document.getElementById('logout-button')
  const taskList = document.getElementById('task-list')

  taskForm?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const taskInput = document.getElementById('task-input') as HTMLInputElement
    const errorMessage = document.getElementById('error-message')

    errorMessage?.replaceChildren()

    if (!taskInput.value.trim()) {
      if (errorMessage) {
        errorMessage.textContent = 'Please enter a task.'
      }
      return
    }

    await createTask(taskInput.value)
    taskInput.value = ''
    await renderTasks()
  })

  taskList?.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement
    const actionButton = target.closest<HTMLButtonElement>('.complete-btn, .delete-btn')

    if (!actionButton) return

    const taskId = Number(actionButton.dataset.id)
    if (!taskId) return

    if (actionButton.classList.contains('complete-btn')) {
      await completeTask(taskId)
    }

    if (actionButton.classList.contains('delete-btn')) {
      await deleteTask(taskId)
    }

    await renderTasks()
  })

  logoutButton?.addEventListener('click', async () => {
    await signOut()
    appRoot.innerHTML = ''
    renderLogin(() => {
      void renderApp()
    })
  })

  await renderTasks()
}

export const initApp = async () => {
  const hasSession = await restoreSession()

  if (hasSession) {
    await renderApp()
    return
  }

  renderLogin(() => {
    void renderApp()
  })
}