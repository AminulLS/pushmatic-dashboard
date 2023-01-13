import React from 'react'
import { ConfigProvider, theme } from 'antd'
import antdEnUS from 'antd/locale/en_US'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import InvalidHost from './public/invalid-host'
import reportWebVitals from './reportWebVitals'
import router from './router'
import { isValidHost } from './services/config'
import { store } from './redux/store'

import 'antd/dist/reset.css'
import './index.css'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider
                locale={antdEnUS}
                theme={{
                    algorithm: theme.compactAlgorithm,
                    token: {
                        colorPrimary: '#4700ba',
                        borderRadius: 4,
                    }
                }}
            >
                {isValidHost(window.location.host) ? <RouterProvider router={router} /> : <InvalidHost />}
            </ConfigProvider>
        </Provider>
    </React.StrictMode>
)

reportWebVitals()
