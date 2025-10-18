import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div>
      <h2>Welcome Back 🌿</h2>

      <form
        onSubmit={handleLogIn}
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
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {error && <p >{error}</p>}

        <p >
          Don’t have an account?{' '}
          <a href="/signup" >
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}

export default LogIn
