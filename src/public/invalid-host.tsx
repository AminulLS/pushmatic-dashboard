import React from 'react'
import { Result } from 'antd'

function InvalidHost() {
    return (
        <div style={{
            height: '100vh',
            display: 'grid',
            placeItems: 'center',
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
