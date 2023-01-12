import React from 'react'
import { Outlet } from 'react-router-dom'

function Details() {
    return (
        <>
            <div className="sidebar">
                <p>Lists Details</p>
            </div>

            <div className="content">
                <Outlet />
            </div>
        </>
    )
}

export default Details
