export interface SegmentRule {
    type: string
    condition: 'and' | 'or' | string
    values: string[]
}

export type SegmentRuleItem = SegmentRule

export interface Segment {
    _id?: string
    list_id?: string
    name?: string
    rules?: SegmentRuleItem[]
    created_at?: string
    updated_at?: string
}

export type SegmentItem = Segment
