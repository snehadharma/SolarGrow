import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Header() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/home')
  }

  return (
    <header>
      <Link to="/home">
        CelestiGrow 🌿
      </Link>

      <nav>
        {!session ? (
          <>
            <Link to="/login">
              Log In
            </Link>
            <Link to="/signup" >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline"
            >
              Log Out
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
