import React from 'react'
import { useParams } from 'react-router-dom'

function Index() {
    const { list_id } = useParams()

    return (
        <p>List Details: {list_id}</p>
    )
}

export default Index
