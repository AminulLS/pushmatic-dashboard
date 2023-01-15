import React from 'react'
import { Result } from 'antd'
import { useRouteError } from 'react-router-dom'

function ErrorPage({ status, title, subTitle, extra }: any) {
    const error: any = useRouteError()

    const code = status ?? error?.status
    const heading = title ?? 'Oops!'
    const subHeading = subTitle ?? 'Sorry, an unexpected error has occurred.'
    const content = extra ?? (<i>{error?.statusText || error?.message}</i>)

    if (error) {
        console.error(error)
    }

    return (
        <div style={{
            height: '100vh',
            display: 'grid',
            placeItems: 'center',
        }}>
            <Result
                status={[403, 404, 500].indexOf(code) !== -1 ? code : 500}
                title={heading}
                subTitle={subHeading}
                extra={content}
            />
        </div>
    )
}

export default ErrorPage
