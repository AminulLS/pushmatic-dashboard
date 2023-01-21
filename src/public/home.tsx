import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/auth/login')

        // eslint-disable-next-line
    }, [])
    return (
        <p>Redirecting you to login page...</p>
    )
}

export default Home
