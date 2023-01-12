import React from 'react';
import { Result } from 'antd';

const InvalidHost: React.FC = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        alignItems: 'center'
    }}>
        <Result
            status="404"
            title="Invalid Host"
            subTitle="Sorry, the request host is invalid. Please contact support"
        />
    </div>
);

export default InvalidHost;
