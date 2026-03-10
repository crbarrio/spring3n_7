import { supabase } from '../supabase'
import { sessionState } from '../state'

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    throw error ?? new Error('No user returned')
  }

  sessionState.userId = data.user.id
  sessionState.userEmail = data.user.email ?? email
}

export const signOut = async () => {
  await supabase.auth.signOut()
  sessionState.userId = null
  sessionState.userEmail = null
}

export const restoreSession = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return false
  }

  sessionState.userId = data.user.id
  sessionState.userEmail = data.user.email ?? null
  return true
}