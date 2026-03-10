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

  if (!tasks || tasks.length === 0) {
		taskList.innerHTML = 'No tasks found'
	} else {
		let tasksHtml = '<table class="table table-borderless"><thead><tr><th>Task</th><th>Status</th><th>Actions</th></tr></thead><tbody>'

		tasks.forEach((task) => {
			let actionsHtml = ''

			if (task.completada) {
				actionsHtml = `<td class="col-3"><button class="${actionButtonClass} btn-outline-danger delete-btn" data-id="${task.id_tarea}"><i class="${actionIconClass}">delete</i></button></td>`
			} else {
				actionsHtml = `<td class="col-3">
		  <button class="${actionButtonClass} btn-outline-success complete-btn" data-id="${task.id_tarea}"><i class="${actionIconClass}">check</i></button>
		  <button class="${actionButtonClass} btn-outline-danger delete-btn" data-id="${task.id_tarea}"><i class="${actionIconClass}">delete</i></button>
		</td>`
			}

			tasksHtml += `<tr><td>${task.tarea}</td><td>${task.completada ? 'Completada' : 'Pendiente'}</td>${actionsHtml}</tr>`
		})

		tasksHtml += '</tbody></table>'
        taskList.innerHTML = tasksHtml
	}

	
}

export const renderApp = async () => {
  clearLogin()

  appRoot.innerHTML = `
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-4">
	  <h1 class="ms-3 h4">Supabase Test</h1>
	  <span class="ms-auto me-3">${sessionState.userEmail ?? ''}</span>
	  <button class="btn btn-outline-danger me-3" id="logout-button">Logout</button>
	</nav>

	<div class="container">
	  <div class="row">
		<div class="col-md-8">
		  <h2 class="h5 mb-5">Task List</h2>
		  <ul id="task-list"></ul>
		</div>
		<div class="col-md-4">
		  <h2 class="h5 mb-5">Add New Task</h2>
		  <form id="task-form">
			<div class="mb-3">
			  <label for="task-input" class="form-label fw-bold">Task</label>
			  <input type="text" class="form-control" id="task-input" placeholder="Enter a new task">
			</div>
			<button type="button" class="btn btn-outline-primary" id="add-task-button">Add Task</button>
		  </form>
		  <div id="error-message" class="mt-3 text-danger"></div>
		</div>
	  </div>
	</div>`

  const addTaskButton = document.getElementById('add-task-button')
  const logoutButton = document.getElementById('logout-button')
  const taskList = document.getElementById('task-list')

  addTaskButton?.addEventListener('click', async () => {
    const taskInput = document.getElementById('task-input') as HTMLInputElement
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