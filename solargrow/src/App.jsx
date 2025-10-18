import './index.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Location from './components/Location'
import Header from './components/Header'
import { baseTheme } from '@chakra-ui/theme'
import { Provider } from '@chakra-ui/react/provider'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <Provider theme={baseTheme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={ <SignUp /> } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  )
}


export default App;