import React from 'react'
import { Result } from 'antd'

function InvalidHost() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            alignItems: 'center'
        }}>
            <Result
                status="500"
                title="Invalid Host"
                subTitle="Sorry, the request host is invalid. Please contact support"
            />
        </div>
    )
}

export default InvalidHost
