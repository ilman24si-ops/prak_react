import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.session()
    setUser(session?.user ?? null)
    setLoading(false)

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    const { user, error } = await supabase.auth.signIn({ email, password })
    setLoading(false)
    return { user, error }
  }

  const register = async (email, password) => {
    setLoading(true)
    const { user, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    return { user, error }
  }

  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setLoading(false)
  }

  return { user, loading, login, register, logout }
}

export { useAuth }
export default useAuth