import { supabase } from '../supabase'
import { sessionState } from '../state'

export const fetchTasks = async () => {
  if (!sessionState.userId) {
    throw new Error('No authenticated user')
  }

  const { data, error } = await supabase
    .from('tareas')
    .select()
    .eq('id_usuario', sessionState.userId)
    .order('completada', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export const createTask = async (task: string) => {
  if (!sessionState.userId) {
    throw new Error('No authenticated user')
  }

  const { error } = await supabase
    .from('tareas')
    .insert([{ tarea: task, completada: false, id_usuario: sessionState.userId }])

  if (error) {
    throw error
  }
}

export const completeTask = async (taskId: number) => {
  const { error } = await supabase
    .from('tareas')
    .update({ completada: true })
    .eq('id_tarea', taskId)

  if (error) {
    throw error
  }
}

export const deleteTask = async (taskId: number) => {
  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('id_tarea', taskId)

  if (error) {
    throw error
  }
}