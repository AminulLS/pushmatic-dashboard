import React from 'react'
import { Navigate, Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'
import { Dropdown, Layout, Menu, theme } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import AppLogo from '../components/AppLogo'
import ErrorPage from '../public/error-page'
import { unsetAuth } from '../redux/auth-slice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { hasAccess } from '../services/access'
import { logout } from '../services/auth'
import { currentHost } from '../services/config'

const config = currentHost

const { Header, Content, Footer, Sider } = Layout

function Dashboard({ menuItems }: any) {
    const { token: { colorBgContainer } } = theme.useToken()
    const auth = useAppSelector(({ auth }) => auth)
    const location = useLocation()
    const navigate = useNavigate()
    const matches = useMatches()
    const dispatch = useAppDispatch()

    if (!auth.isLoggedIn) {
        return <Navigate to={`/auth/login?next=${location.pathname}`} />
    }

    // handle permissions
    const filteredPerms = matches
        .filter(({ handle }: any) => handle?.permissions)
        .map(({ handle }: any) => handle.permissions)
        .flat()
    const reqPerms = Array.from(new Set(filteredPerms))
    const authPerms = Array.from(new Set(auth.permissions))

    authPerms.push(String(auth.role))

    if (!hasAccess(authPerms, reqPerms)) {
        return <ErrorPage code={403} title="Unauthorized" subTitle="You don't have access to view this page." />
    }

    return (
        <Layout className="app-main-layout">
            <Sider className="app-content-sidebar">
                <AppLogo brand={config.name} />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    onClick={(item) => navigate(item.key)}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header className="app-content-header" style={{ background: colorBgContainer }}>
                    <div className="app-content-header-left"></div>
                    <div className="app-content-header-right">
                        <Dropdown.Button
                            menu={{
                                onClick: () => logout(String(auth.token)).finally(() => dispatch(unsetAuth())),
                                items: [
                                    {
                                        label: 'Logout',
                                        key: 'logout',
                                        icon: <LogoutOutlined />
                                    },
                                ]
                            }}
                            placement="bottomRight"
                            icon={<UserOutlined />}
                        >
                            Hi, {auth.name}
                        </Dropdown.Button>
                    </div>
                </Header>
                <Content className="app-content-area">
                    <Outlet />
                </Content>
                <Footer className="app-content-footer">&copy; {`${(new Date()).getFullYear()} ${config.name}`}</Footer>
            </Layout>
        </Layout>
    )
}

export default Dashboard
