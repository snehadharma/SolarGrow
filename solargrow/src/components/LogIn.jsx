import './LogIn.css';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'


function LogIn() {
    const navigate = useNavigate()

    // optional: listen for login completion
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            navigate('/dashboard')
        }
    })

    return (
    <div className="login-container">
        <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        />
    </div>
    )
}

export default LogIn; 