import React from 'react'
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

function Index() {
    const auth = useAppSelector(({ auth }) => auth)

    return (
        <>
            <p>Welcome, {auth.name}</p>

            <NavLink to="lists">Lists</NavLink>
        </>
    )
}

export default Index
