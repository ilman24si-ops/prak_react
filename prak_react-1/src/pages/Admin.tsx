import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import UserManagement from '../components/UserManagement'

const Admin = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <UserManagement users={users} />
    </div>
  )
}

export default Admin