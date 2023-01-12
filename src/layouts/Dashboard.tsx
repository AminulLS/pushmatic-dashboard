import React from 'react'
import { Outlet } from 'react-router-dom'

function Dashboard() {
    return (
        <>
            <div className="sidebar">
                <p>Dashboard</p>
            </div>

            <div className="content">
                <Outlet />
            </div>
        </>
    )
}

export default Dashboard
