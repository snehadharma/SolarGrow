import { useNavigate, Link } from "react-router-dom";


function Home () {
    return (
        <div>
            <h1>Welcome to SolarBloom 🌞</h1>
            <div>
                <Link to="/login">Log In</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}

export default Home; 
