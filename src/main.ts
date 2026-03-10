const appRoot = document.querySelector<HTMLDivElement>('#app')
const loginRoot = document.querySelector<HTMLDivElement>('#login')

const renderFatalError = (message: string) => {
  if (loginRoot) {
    loginRoot.innerHTML = ''
  }

  if (appRoot) {
    appRoot.innerHTML = `
      <div class="container py-5">
        <div class="alert alert-danger" role="alert">
          ${message}
        </div>
      </div>
    `
  }
}

try {
  const { initApp } = await import('./ui/app')
  await initApp()
} catch (error) {
  console.error(error)
  renderFatalError(
    error instanceof Error
      ? error.message
      : 'Application startup failed.'
  )
}

// crbarrio@hotmail.com
//testsupabase