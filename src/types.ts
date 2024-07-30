export interface ADFRoot {
  type: 'doc'
  version: number
  content: Array<ADFTopLevelBlockNode>
}

// Top-level block nodes
export interface ADFBlockquoteNode {
  type: 'blockquote'
  content: Array<ADFBulletListNode | ADFOrderedListNode | ADFParagraphNode>
}

export interface ADFBulletListNode {
  type: 'bulletList'
  content: Array<ADFListItemNode>
}

export interface ADFCodeBlockNode {
  type: 'codeBlock'
  content: Array<ADFTextNode>
  attrs?: {
    language?: string
  }
}

export interface ADFHeadingNode {
  type: 'heading'
  content: Array<ADFInlineNode>
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6
    localId?: string
  }
}

export interface ADFMediaGroupNode {
  type: 'mediaGroup'
  content: Array<ADFMediaNode>
}

export interface ADFMediaSingleNode {
  type: 'mediaSingle'
  content: Array<ADFMediaNode>
  attrs: {
    layout: 'wrap-left' | 'center' | 'wrap-right' | 'wide' | 'full-width' | 'align-start' | 'align-end'
    width?: number
    widthType?: 'pixel' | 'percentage'
  }
}

export interface ADFOrderedListNode {
  type: 'orderedList'
  content: Array<ADFListItemNode>
  attrs?: {
    order?: number
  }
}

export interface ADFPanelNode {
  type: 'panel'
  content: Array<ADFBulletListNode | ADFHeadingNode | ADFOrderedListNode | ADFParagraphNode>
  attrs: {
    panelType: 'info' | 'note' | 'warning' | 'success' | 'error'
  }
}

export interface ADFParagraphNode {
  type: 'paragraph'
  content: Array<ADFInlineNode>
  attrs?: {
    localId?: string
  }
}

export interface ADFRuleNode {
  type: 'rule'
}

export interface ADFTableNode {
  type: 'table'
  content: Array<ADFTableRowNode>
  attrs?: {
    isNumberColumnEnabled?: boolean
    width?: number
    layout?: 'center' | 'align-start'
    displayMode?: 'default' | 'fixed'
  }
}

export type ADFTopLevelBlockNode =
  | ADFBlockquoteNode
  | ADFBulletListNode
  | ADFCodeBlockNode
  | ADFHeadingNode
  | ADFMediaGroupNode
  | ADFMediaSingleNode
  | ADFOrderedListNode
  | ADFPanelNode
  | ADFParagraphNode
  | ADFRuleNode
  | ADFTableNode

// child block nodes
export interface ADFListItemNode {
  type: 'listItem'
  content: Array<ADFBulletListNode | ADFCodeBlockNode | ADFMediaSingleNode | ADFOrderedListNode | ADFParagraphNode>
}

export interface ADFMediaNode {
  type: 'media'
  attrs: {
    id: string
    type: 'file' | 'link'
    collection: string
    width?: number
    height?: number
    occurrenceKey?: string
  }
  marks?: Array<ADFLinkMark>
}

export interface ADFTableCellNode {
  type: 'tableCell'
  content: Array<ADFBlockquoteNode | ADFBulletListNode | ADFCodeBlockNode | ADFHeadingNode | ADFMediaGroupNode | ADFOrderedListNode | ADFPanelNode | ADFParagraphNode | ADFRuleNode>
  attrs?: {
    background?: string
    colspan?: number
    colwidth?: Array<number>
    rowspan?: number
  }
}

export interface ADFTableHeaderNode {
  type: 'tableHeader'
  content: Array<ADFBlockquoteNode | ADFBulletListNode | ADFCodeBlockNode | ADFHeadingNode | ADFMediaGroupNode | ADFOrderedListNode | ADFPanelNode | ADFParagraphNode | ADFRuleNode>
  attrs?: {
    background?: string
    colspan?: number
    colwidth?: Array<number>
    rowspan?: number
  }
}

export interface ADFTableRowNode {
  type: 'tableRow'
  content: Array<ADFTableCellNode> | Array<ADFTableHeaderNode>
}

export type ADFChildBlockNode = ADFListItemNode | ADFMediaNode | ADFTableCellNode | ADFTableHeaderNode | ADFTableRowNode
export type ADFBlockNode = ADFTopLevelBlockNode | ADFChildBlockNode

// inline nodes

export interface ADFEmojiNode {
  type: 'emoji'
  attrs: {
    shortName: string
    id?: string
    text?: string
  }
}

export interface ADFHardBreakNode {
  type: 'hardBreak'
  attrs?: {
    text?: string
  }
}

export interface ADFInlineCardNode {
  type: 'inlineCard'
  attrs: {
    url: string
  }
  // TODO support Json-ld eventually
}

export interface ADFMentionNode {
  type: 'mention'
  attrs: {
    id: string
    accessLevel?: 'NONE' | 'SITE' | 'APPLICATION' | 'CONTAINER'
    text?: string
    userType?: 'DEFAULT' | 'SPECIAL' | 'APP'
  }
}

export interface ADFTextNode {
  type: 'text'
  text: string
  marks?: Array<ADFMark>
}

export type ADFInlineNode = ADFEmojiNode | ADFHardBreakNode | ADFInlineCardNode | ADFMentionNode | ADFTextNode

export interface ADFCodeMark {
  type: 'code'
}

export interface ADFEmMark {
  type: 'em'
}

export interface ADFLinkMark {
  type: 'link'
  attrs: {
    href: string
    collection?: string
    id?: string
    occurrenceKey?: string
    title?: string
  }
}

export interface ADFStrikeMark {
  type: 'strike'
}

export interface ADFStrongMark {
  type: 'strong'
}

export interface ADFSubsupMark {
  type: 'subsup'
  attrs: {
    type: 'sub' | 'sup'
  }
}

export interface ADFTextColorMark {
  type: 'textColor'
  attrs: {
    color: string
  }
}

export interface ADFUnderlineMark {
  type: 'underline'
}

export type ADFMark = ADFCodeMark | ADFEmMark | ADFLinkMark | ADFStrikeMark | ADFStrongMark | ADFSubsupMark | ADFTextColorMark | ADFUnderlineMark

export type ADFNode = ADFBlockNode | ADFInlineNode
