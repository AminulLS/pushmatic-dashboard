import React from 'react'
import { Outlet, useMatches } from 'react-router-dom'

function Dashboard() {
    const matches = useMatches();
    const permissions = matches
        .filter(({ handle }: any) => handle?.permissions)
        .map(({ handle }: any) => handle.permissions)
        .flat()
    const filteredPerms = Array.from(new Set(permissions));

    console.log(matches, filteredPerms)
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
