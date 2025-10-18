import './index.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import LogIn from './components/LogIn'
// import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-4xl font-bold mb-8 text-green-800">Welcome to SolarBloom 🌞</h1>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="bg-white border border-green-600 text-green-700 px-6 py-2 rounded-md hover:bg-green-100 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <Router>
      <Routes>
        {!session && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            {/* <Route path="/signup" element={<SignUp />} /> */}
          </>
        )}


        {session && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

      </Routes>
    </Router>
  )
}


export default App
