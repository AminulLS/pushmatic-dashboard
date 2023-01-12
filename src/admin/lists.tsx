import React from 'react'
import { Outlet } from 'react-router-dom'

function Lists() {
    return (
        <>
            <div className="sidebar">
                <p>Lists</p>
            </div>

            <div className="content">
                <Outlet />
            </div>
        </>
    )
}

export default Lists
