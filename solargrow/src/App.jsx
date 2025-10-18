import './index.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import LogIn from './components/LogIn'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import { baseTheme } from '@chakra-ui/theme'
import { Provider } from '@chakra-ui/react/provider'

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
    <Provider theme={baseTheme}>
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
    </Provider>
  )
}


export default App
