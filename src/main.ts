import { createClient } from '@supabase/supabase-js'
import { type Database } from './supabase'

const actionButtonClass = 'btn btn-sm d-inline-flex align-items-center justify-content-center lh-1'
const actionIconClass = 'material-icons d-block pe-none'

const supabase = createClient<Database>(
	'https://xrdpvlbdolmrmafucyum.supabase.co',
	'sb_publishable_PM5dFwTA6xkMR9ADBInMgQ_w_oBJfP_'
)

const loginRoot = document.querySelector<HTMLDivElement>('#login')!
const appRoot = document.querySelector<HTMLDivElement>('#app')!

let currentUserId: string | null = null
let currentUserEmail: string | null = null

const printTasks = (tasksHtml: string) => {
	const taskList = document.getElementById('task-list')
	if (taskList) {
		taskList.innerHTML = tasksHtml
	}
}

const getData = async () => {
	if (!currentUserId) return

	const { data, error } = await supabase
		.from('tareas')
		.select()
		.eq('id_usuario', currentUserId)
		.order('completada', { ascending: true })

	if (error) {
		console.error('Error fetching data:', error)
		return
	}

	let tasksHtml = ''

	if (!data || data.length === 0) {
		tasksHtml = 'No tasks found'
	} else {
		tasksHtml += '<table class="table table-borderless"><thead><tr><th>Task</th><th>Status</th><th>Actions</th></tr></thead><tbody>'

		data.forEach((task) => {
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
	}

	printTasks(tasksHtml)
}

const renderLogin = () => {
	appRoot.innerHTML = ''
	loginRoot.innerHTML = `
		<div class="d-flex justify-content-center align-items-center vh-100">
			<div class="card p-4 shadow" style="width: 300px;">
				<h2 class="h5 mb-4 text-center">Login</h2>
				<form id="login-form">
				<div class="mb-3">
					<label for="email-input" class="form-label fw-bold">Email</label>
					<input type="email" class="form-control" id="email-input" placeholder="Enter your email">
				</div>
				<div class="mb-3">
					<label for="password-input" class="form-label fw-bold">Password</label>
					<input type="password" class="form-control" id="password-input" placeholder="Enter your password">
				</div>
				<button type="button" class="btn btn-primary w-100" id="login-button">Login</button>
				</form>
				<div id="login-error-message" class="mt-3 text-danger"></div>
			</div>
		</div>
	`

	const loginButton = document.getElementById('login-button')
	loginButton?.addEventListener('click', async () => {
		const emailInput = document.getElementById('email-input') as HTMLInputElement
		const passwordInput = document.getElementById('password-input') as HTMLInputElement
		const loginErrorMessage = document.getElementById('login-error-message')

		if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
			if (loginErrorMessage) {
				loginErrorMessage.textContent = 'Please enter both email and password.'
			}
			return
		}

		const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
			email: emailInput.value,
			password: passwordInput.value
		})

		if (signInError || !authData.user) {
			if (loginErrorMessage) {
				loginErrorMessage.textContent = 'Login failed: ' + (signInError?.message ?? 'No user returned')
			}
			return
		}

		currentUserId = authData.user.id
		currentUserEmail = emailInput.value
		renderApp()
	})
}

const renderApp = async () => {
	loginRoot.innerHTML = ''
	appRoot.innerHTML = `
	<nav class="navbar navbar-expand-lg bg-body-tertiary mb-4">
	  <h1 class="ms-3 h4">Supabase Test</h1>
	  <span class="ms-auto me-3">${currentUserEmail}</span>
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
	</div>
  	`

	const taskList = document.getElementById('task-list')
	const addTaskButton = document.getElementById('add-task-button')
	const logoutButton = document.getElementById('logout-button')

	addTaskButton?.addEventListener('click', async () => {
		const taskInput = document.getElementById('task-input') as HTMLInputElement
		const errorMessage = document.getElementById('error-message')

		if (taskInput.value.trim() === '') {
			if (errorMessage) {
				errorMessage.textContent = 'Please enter a task.'
			}
			return
		}

		if (!currentUserId) {
			if (errorMessage) {
				errorMessage.textContent = 'No hay usuario autenticado.'
			}
			return
		}

		const { error } = await supabase
			.from('tareas')
			.insert([{ tarea: taskInput.value, completada: false, id_usuario: currentUserId }])

		if (error) {
			if (errorMessage) {
				errorMessage.textContent = 'Error adding task: ' + error.message
			}
		} else {
			taskInput.value = ''
			getData()
		}
	})

	taskList?.addEventListener('click', async (event) => {
		const target = event.target as HTMLElement
		const actionButton = target.closest<HTMLButtonElement>('.complete-btn, .delete-btn')

		if (!actionButton) return

		const taskId = Number(actionButton.dataset.id)
		if (!taskId) return

		if (actionButton.classList.contains('complete-btn')) {
			const { error } = await supabase
				.from('tareas')
				.update({ completada: true })
				.eq('id_tarea', taskId)

			if (!error) {
				getData()
			}
		}

		if (actionButton.classList.contains('delete-btn')) {
			const { error } = await supabase
				.from('tareas')
				.delete()
				.eq('id_tarea', taskId)

			if (!error) {
				getData()
			}
		}
	})

	logoutButton?.addEventListener('click', async () => {
		await supabase.auth.signOut()
		currentUserId = null
		currentUserEmail = null
		renderLogin()
	})

	await getData()
}

const init = async () => {
	const { data, error } = await supabase.auth.getUser()

	if (!error && data.user && currentUserId) {
		currentUserId = data.user.id
		await renderApp()
		return
	}

	renderLogin()
}

init()

// crbarrio@hotmail.com
//testsupabase