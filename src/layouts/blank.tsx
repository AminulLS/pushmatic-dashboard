import React from 'react'
import { setProfile } from '../redux/auth-slice';
import { useAppDispatch, useAppSelector } from '../redux/hooks'

function Blank() {
    const user = useAppSelector(state => state.authReduce)
    const dispatch = useAppDispatch()

    function loginAdmin() {
        dispatch(setProfile({
            isLoggedIn: true,
            name: 'Admin',
            role: 'admin',
            permissions: [
                'dashboard_view', 'lists_read', 'lists_edit', 'list_delete', 'reports_master', 'admins_read', 'admins_edit', 'admins_delete'
            ],
        }))
    }

    function loginPartner() {
        dispatch(setProfile({
            isLoggedIn: true,
            name: 'Partner',
            role: 'partner',
            permissions: ['dashboard', 'lists_read'],
        }))
    }

    return (
        <>
            <p>{user.name}</p>
            <button onClick={loginAdmin}>Login as Admin</button>
            <button onClick={loginPartner}>Login as Partner</button>
        </>
    )
}

export default Blank
