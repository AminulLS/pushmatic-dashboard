import React from 'react'
import { theme } from 'antd'

function AppLogo({ brand }: any) {
    const { token: { borderRadius } } = theme.useToken()

    return <div className="app-branding" style={{ borderRadius }}>{brand}</div>

}

export default AppLogo
