import React from 'react'
import { currentHost } from '../services/config';

const config = currentHost

function Home() {
    return (
        <h1>Welcome to {config.name}</h1>
    )
}

export default Home
