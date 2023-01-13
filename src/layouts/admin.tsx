import React from 'react'
import { Outlet } from 'react-router-dom'
import Dashboard from './dashboard'

function Admin() {
    return (
        <Dashboard>
            <div className="sidebar">
                <p>Dashboard</p>
            </div>

            <div className="content">
                <Outlet />
            </div>
        </Dashboard>
    )
}

export default Admin
