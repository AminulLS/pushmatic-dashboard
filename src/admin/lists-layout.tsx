import React from 'react'
import { Outlet } from 'react-router-dom'

function ListsLayout() {
    // TODO: Maybe we can add a tabbed menu to create new list (wizard based)
    return <Outlet />
}

export default ListsLayout
