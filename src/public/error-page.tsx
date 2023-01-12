import React from 'react'
import { Result } from 'antd'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
    const error: any = useRouteError()

    console.error(error)

    return (
        <Result
            status={[403, 404, 500].indexOf(error.status) !== -1 ? error.status : 500}
            title="Oops!"
            subTitle="Sorry, an unexpected error has occurred."
            extra={(
                <i>{error.statusText || error.message}</i>
            )}
        />
    )
}

export default ErrorPage
