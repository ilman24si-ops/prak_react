import React from 'react'
import RegisterForm from '../components/Auth/RegisterForm'

const Register = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register