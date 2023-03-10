import React from 'react'
import { Image, Space } from 'antd'
import { useAdImages } from '../hooks/cache'
import type { AdItem } from '../types/ads'
import type { CardProps } from 'antd'


const AdView: React.FC<{ ad: AdItem } & CardProps> = ({ ad, ...rest }) => {
    const adImages = useAdImages()
    const iconUrl = ad?.icon_type === 'custom' && ad?.icon_url ? ad.icon_url : adImages[Math.floor(Math.random() * adImages.length)]

    return <Space className="ad-view" size="small">
        <Image className="ad-view--image" src={iconUrl} width={64} preview={false} />
        <div className="ad-view--body">
            <p className="ad-view--title">{ad?.title || 'No Title'}</p>
            <p className="ad-view--content">{ad?.content || 'No Content'}</p>
        </div>
    </Space>
}

export default AdView
