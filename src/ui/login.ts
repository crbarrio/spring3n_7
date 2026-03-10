import { signIn } from '../services/auth'

const loginRoot = document.querySelector<HTMLDivElement>('#login')!

export const renderLogin = (onSuccess: () => void) => {
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
	</div>`

	const loginButton = document.getElementById('login-button')
	loginButton?.addEventListener('click', async () => {
		const emailInput = document.getElementById('email-input') as HTMLInputElement
		const passwordInput = document.getElementById('password-input') as HTMLInputElement
		const errorNode = document.getElementById('login-error-message')

		try {
			await signIn(emailInput.value, passwordInput.value)
			onSuccess()
		} catch (error) {
			if (errorNode) {
				errorNode.textContent = error instanceof Error ? error.message : 'Login failed'
			}
		}
	})
}

export const clearLogin = () => {
	loginRoot.innerHTML = ''
}