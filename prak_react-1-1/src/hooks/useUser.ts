import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { User } from '../types'

const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.session()
    setUser(session?.user || null)
    setLoading(false)

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading }
}

export default useUser