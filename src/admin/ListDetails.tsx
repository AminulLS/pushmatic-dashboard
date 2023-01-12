import React from 'react'
import { useParams } from 'react-router-dom';

function ListDetails() {
    const { list_id } = useParams()

    return (
        <p>List Details: {list_id}</p>
    )
}

export default ListDetails
