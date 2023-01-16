import React from 'react'
import { useSearchParams } from 'react-router-dom'

function CampaignEdit() {
    const [searchParams] = useSearchParams()

    return <p>Edit: {searchParams.get('id')}</p>
}

export default CampaignEdit
