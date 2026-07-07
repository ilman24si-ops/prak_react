import React, { useEffect, useState } from 'react'
import { supabase } from '@/services/supabaseClient'
import UserForm from './UserForm'
import UserList from './UserList'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data)
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  const handleUserUpdate = async (userData) => {
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userData.id)
    if (error) {
      console.error('Error updating user:', error)
    } else {
      fetchUsers()
      setSelectedUser(null)
    }
  }

  const handleUserDelete = async (userId) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    if (error) {
      console.error('Error deleting user:', error)
    } else {
      fetchUsers()
    }
  }

  return (
    <div>
      <h1>User Management</h1>
      <UserForm 
        selectedUser={selectedUser} 
        onUserUpdate={handleUserUpdate} 
      />
      <UserList 
        users={users} 
        onUserSelect={handleUserSelect} 
        onUserDelete={handleUserDelete} 
      />
    </div>
  )
}

export default UserManagement