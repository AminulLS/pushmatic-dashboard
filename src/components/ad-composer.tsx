import React from 'react'
import { Alert, Image } from 'antd'
import {
    ProForm,
    ProFormDigit,
    ProFormDependency,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, ProFormRadio
} from '@ant-design/pro-components'
import type { ProFormProps } from '@ant-design/pro-components'
import { useAdImages, useAdTags, useProviders } from '../hooks/cache'
import { useIconTypes, useOnlyUserFields } from '../hooks/tags'
import { appendSearchParams } from '../utils/urls'

type AdComposerProps = {
    hideName?: boolean
} & ProFormProps

function AdComposer(props: AdComposerProps) {
    const providers = useProviders()
    const adTags = useAdTags()
    const adImages = useAdImages()
    const userFields = useOnlyUserFields()
    const iconTypes = useIconTypes()
    const { hideName, ...rest } = props

    return <ProForm {...rest}>
        {!hideName ? <ProFormText
            name="name"
            label="Name"
            tooltip="This should be lowercase and unique for the list"
            placeholder="Enter the ad name"
            rules={[{ required: true }]}
        /> : null}
        <ProFormText
            name="title"
            label="Title"
            placeholder="The message title..."
            rules={[{ required: true }]}
        />
        <ProFormTextArea
            name="content"
            label="Message"
            placeholder="The message content..."
            rules={[{ required: true }]}
            extra={<small>Available Tags: {adTags.join(', ')}</small>}
        />
        <ProFormSelect
            name="ad_type"
            label="Job Provider"
            showSearch={true}
            options={Object.values(providers).map(({ label, value }) => ({ label, value }))}
            rules={[{ required: true }]}
        />
        <ProFormDependency name={['ad_type']}>
            {({ ad_type }) => (ad_type && ad_type !== 'directlink') && <ProFormText
                name="keyword"
                label="Keyword"
                placeholder="To override user search keyword..."
            />}
        </ProFormDependency>

        <ProFormDependency name={['ad_type']}>
            {({ ad_type }) => (ad_type && ['talent', 'omxml'].indexOf(ad_type) !== -1) && <ProFormDigit
                name="cpc"
                label="CPC"
                fieldProps={{ step: 0.001 }}
                min={0.00}
            />}
        </ProFormDependency>
        <ProFormDependency name={['ad_type', 'ad_link', 'ad_link_params']}>
            {(fields) => {
                // if provider is operation media
                if (fields.ad_type === 'omxml') {
                    return <>
                        <ProFormSelect
                            name={['config', 'campaign_ids']}
                            label="Campaigns"
                            showSearch={true}
                            mode="multiple"
                            options={Object.values(providers.omxml?.campaigns || {})}
                        />

                        <ProFormSelect
                            name={['config', 'exclude_campaign_ids']}
                            label="Exclude Campaigns"
                            showSearch={true}
                            mode="multiple"
                            options={Object.values(providers.omxml?.campaigns || {})}
                        />
                    </>
                }

                // if direct link
                if (fields.ad_type === 'directlink') {
                    const message = appendSearchParams(fields?.ad_link ?? '', fields?.ad_link_params ?? [])

                    return <>
                        <ProFormTextArea
                            name="ad_link"
                            label="Link"
                            placeholder="The link used for the ad..."
                            extra={<small>Available Tags: {'{{' + userFields.join('}}, {{') + '}}'}</small>}
                            rules={[{ required: true }]}
                        />

                        <ProFormSelect
                            name="ad_link_params"
                            label="Link Params"
                            showSearch={true}
                            mode="multiple"
                            options={userFields.map(f => ({ label: f, value: f }))}
                            extra={message && <Alert message={message} type="info" style={{ marginTop: 10 }} />}
                        />
                    </>
                }
            }}
        </ProFormDependency>
        <ProFormRadio.Group
            name="icon_type"
            label="Icon Type"
            radioType="button"
            options={iconTypes}
            rules={[{ required: true }]}
        />
        <ProFormDependency name={['icon_type']}>
            {(fields) => {
                if (fields.icon_type !== 'custom') {
                    return
                }

                return <ProFormRadio.Group
                    name="icon_url"
                    label="Custom Icon"
                    rules={[{ required: true }]}
                    options={adImages.map(img => ({
                        value: img,
                        label: <Image
                            src={img}
                            preview={false}
                            width={32}
                            style={{ margin: '2px 0' }}
                        />
                    }))}
                />
            }}
        </ProFormDependency>
    </ProForm>
}

export default AdComposer
