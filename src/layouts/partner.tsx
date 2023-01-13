import React from 'react'
import { Outlet } from 'react-router-dom'
import Dashboard from './dashboard'

function Partner() {
    return (
        <Dashboard>
            <div className="sidebar">
                <p>Partner</p>
            </div>

            <div className="content">
                <Outlet />
            </div>
        </Dashboard>
    )
}

export default Partner
