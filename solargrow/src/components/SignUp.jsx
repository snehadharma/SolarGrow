import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a confirmation link!')
    }
  }

  return (
    <div>
      <h2>Create Your Account 🌱</h2>

      <form
        onSubmit={handleSignUp}
        >
        <label >Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />

        <label >Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <button
          type="submit"
        >
          Sign Up
        </button>

        {error && <p >{error}</p>}
        {message && <p >{message}</p>}

        <p >
          Already have an account?{' '}
          <a href="/login">
            Log in
          </a>
        </p>
      </form>
    </div>
  )
}

export default SignUp
