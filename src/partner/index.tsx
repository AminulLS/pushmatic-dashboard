import React from 'react'
import { useAppSelector } from '../redux/hooks';

function Index() {
    const auth = useAppSelector(({ auth }) => auth)

    return (
        <p>Welcome, {auth.name}</p>
    )
}

export default Index
