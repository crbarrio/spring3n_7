# spring3n_7

Aplicacion web sencilla con Vite, TypeScript y Supabase para gestionar tareas.

El flujo actual es:

- Pantalla inicial de login.
- Si la autenticacion es correcta, se muestra la lista de tareas del usuario.
- Permite crear tareas, marcarlas como completadas y eliminarlas.

## Tecnologias usadas

- TypeScript
- Vite
- Supabase
- Bootstrap 5
- Material Icons
- HTML5

## Requisitos

- Node.js
- Una cuenta y proyecto de Supabase

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto con estas variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

Si faltan estas variables, la aplicacion no podra inicializar el cliente de Supabase.

## Comandos

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar build de produccion:

```bash
npm run build
```

Previsualizar la build:

```bash
npm run preview
```

## Estructura principal

- `src/main.ts`: arranque de la aplicacion y manejo de errores fatales.
- `src/supabase.ts`: configuracion del cliente de Supabase.
- `src/services/`: logica de autenticacion y tareas.
- `src/ui/`: renderizado de login y aplicacion.
