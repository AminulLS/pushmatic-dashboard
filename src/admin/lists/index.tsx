import React from 'react'
import { NavLink } from 'react-router-dom'

function Index() {
    return (
        <>
            <p>List Index</p>
            <NavLink to="/admin/lists">Lists</NavLink>
            <NavLink to="../">Back</NavLink>
        </>
    )
}

export default Index
