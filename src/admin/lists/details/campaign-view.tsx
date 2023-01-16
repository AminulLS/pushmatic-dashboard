import React from 'react'
import { useSearchParams } from 'react-router-dom'

function CampaignView() {
    const [searchParams] = useSearchParams()

    return <p>View: {searchParams.get('id')}</p>
}

export default CampaignView
