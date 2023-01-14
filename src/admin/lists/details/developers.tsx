import { ProCard } from '@ant-design/pro-components';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAppSelector } from '../../../redux/hooks'
import { currentHost } from '../../../services/config'
import { ListItem } from '../../../types/lists'

const config = currentHost

function Developers() {
    const [content, setContent] = useState<string>('loading')
    const list = useAppSelector<ListItem>(({ list }) => list.current)

    useEffect(() => {
        fetch('/docs/developers.md')
            .then(res => res.text())
            .then((doc) => {
                return doc.replaceAll('YOUR_LIST_ID', list._id || 'PUSH_LIST_ID')
                    .replaceAll('YOUR_DOMAIN', config.domain)
                    .replaceAll('YOUR_APP_NAME', config.name)
            })
            .then(setContent)
            .catch(() => setContent('Failed to load the documentation.'))
    }, [list])

    if (content === 'loading') {
        return <Spin />
    }

    return (
        <ProCard>
            <ReactMarkdown>{content}</ReactMarkdown>
        </ProCard>
    )
}

export default Developers
