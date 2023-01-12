import React from 'react'
import { Outlet } from 'react-router-dom'

function Partner() {
    return (
        <>
            <div className="sidebar">
                <p>Partner</p>
            </div>

            <div className="content">
                <Outlet />
            </div>
        </>
    )
}

export default Partner
