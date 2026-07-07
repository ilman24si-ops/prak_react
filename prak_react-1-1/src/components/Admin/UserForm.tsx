import React, { useEffect, useState } from 'react'
import { supabase } from '@/services/supabaseClient'
import { User } from '@/types'

interface UserFormProps {
  user?: User
  onSubmit: (user: User) => void
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState<User>({
    id: user?.id || '',
    email: user?.email || '',
    name: user?.name || '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({ email: formData.email, name: formData.name })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating user:', error)
      } else {
        onSubmit(formData)
      }
    } else {
      // Create new user
      const { error } = await supabase
        .from('users')
        .insert([{ email: formData.email, name: formData.name }])

      if (error) {
        console.error('Error creating user:', error)
      } else {
        onSubmit(formData)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{user ? 'Update User' : 'Create User'}</button>
    </form>
  )
}

export default UserForm