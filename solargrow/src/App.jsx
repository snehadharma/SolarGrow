import './index.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import Home from './components/Home'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //     setLoading(false)
  //   })

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })

  //   return () => subscription.unsubscribe()
  // }, [])

  // // Show loading state while checking auth
  // if (loading) {
  //   return <div>Loading...</div>
  // }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={ <SignUp /> } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}


export default App;