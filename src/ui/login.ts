import { signIn } from '../services/auth'

const loginRoot = document.querySelector<HTMLDivElement>('#login')!

export const renderLogin = (onSuccess: () => void) => {
	loginRoot.innerHTML = `
		<main class="d-flex justify-content-center align-items-center vh-100" aria-labelledby="login-title">
			<div class="card p-4 shadow" style="width: 300px;">
				<h1 id="login-title" class="h5 mb-4 text-center">Login</h1>
				<form id="login-form" aria-describedby="login-error-message" novalidate>
					<div class="mb-3">
						<label for="email-input" class="form-label fw-bold">Email</label>
						<input type="email" class="form-control" id="email-input" name="email" autocomplete="email" required autofocus placeholder="Enter your email">
					</div>
					<div class="mb-3">
						<label for="password-input" class="form-label fw-bold">Password</label>
						<input type="password" class="form-control" id="password-input" name="password" autocomplete="current-password" required placeholder="Enter your password">
					</div>
					<button type="submit" class="btn btn-primary w-100" id="login-button">Login</button>
				</form>
				<p id="login-error-message" class="mt-3 text-danger mb-0" role="alert" aria-live="assertive" aria-atomic="true"></p>
			</div>
		</main>`

	const loginForm = document.getElementById('login-form') as HTMLFormElement | null
	loginForm?.addEventListener('submit', async (event) => {
		event.preventDefault()

		const emailInput = document.getElementById('email-input') as HTMLInputElement
		const passwordInput = document.getElementById('password-input') as HTMLInputElement
		const errorNode = document.getElementById('login-error-message')

		errorNode?.replaceChildren()

		if (!emailInput.value.trim() || !passwordInput.value.trim()) {
			if (errorNode) {
				errorNode.textContent = 'Please enter both email and password.'
			}
			return
		}

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