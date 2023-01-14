import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { Navigate } from 'react-router-dom'
import { setAuth } from '../redux/auth-slice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { login } from '../services/auth'
import { currentHost } from '../services/config'

const config = currentHost

function Auth() {
    const auth = useAppSelector(({ auth }) => auth)
    const dispatch = useAppDispatch()

    if (auth.isLoggedIn === true) {
        const route = auth.role === 'admin' ? '/admin' : '/partner'

        return (<Navigate to={route} replace={true} />)
    }

    return (
        <div style={{
            height: '100vh',
            display: 'grid',
            placeItems: 'center',
        }}>
            <div>
                <LoginForm
                    logo={config.icon}
                    title={config.name}
                    subTitle={config.desc}
                    onFinish={async ({ username, password }: any) => {
                        const { profile } = await login(username, password)

                        dispatch(setAuth(profile))
                    }}
                    onFinishFailed={(values) => console.log(values)}
                >
                    <ProFormText
                        name="username"
                        placeholder="Your email..."
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className={'prefixIcon'} />,
                        }}
                        rules={[{ required: true, type: 'email' }]}
                    />
                    <ProFormText.Password
                        name="password"
                        placeholder="Your password..."
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        rules={[{ required: true }]}
                    />
                </LoginForm>
            </div>
        </div>
    )
}

export default Auth
