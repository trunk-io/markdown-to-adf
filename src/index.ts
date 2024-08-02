import type { Nodes as MDASTNode, Root } from 'mdast'
import type {
  ADFBlockquoteNode,
  ADFBulletListNode,
  ADFCodeBlockNode,
  ADFHardBreakNode,
  ADFHeadingNode,
  ADFInlineNode,
  ADFListItemNode,
  ADFNode,
  ADFOrderedListNode,
  ADFParagraphNode,
  ADFRoot,
  ADFRuleNode,
  ADFTextNode,
  ADFTopLevelBlockNode,
} from './types'



function mapMDASTNodeToADFNodes(node: MDASTNode, blockParent: boolean = false): ADFNode[] {
  switch (node.type) {
    case 'blockquote': {
      const adf: ADFBlockquoteNode = {
        type: 'blockquote',
        content: node.children.flatMap((child) => mapMDASTNodeToADFNodes(child, false)) as ADFParagraphNode[],
      }
      return [adf]
    }
    case 'break': {
      const adf: ADFHardBreakNode = {
        type: 'hardBreak',
      }
      return [adf]
    }
    case 'code': {
      const adf: ADFCodeBlockNode = {
        type: 'codeBlock',
        attrs: {
          language: node.lang ?? undefined,
        },
        content: [
          {
            type: 'text',
            text: node.value,
          },
        ],
      }
      return [adf]
    }
    case 'definition': {
      return []
    }
    case 'delete': {
      const mappedChildren = node.children.flatMap((child) => {
        const mapped = mapMDASTNodeToADFNodes(child, true)
        mapped.forEach((c) => {
          if (c?.type === 'text') {
            c.marks = [...(c?.marks ?? []), { type: 'strike' }]
          }
        })
        return mapped
      })
      if (!blockParent) {
        return [
          {
            type: 'paragraph',
            content: mappedChildren as ADFInlineNode[],
          },
        ]
      }
      return mappedChildren
    }
    case 'emphasis': {
      const mappedChildren = node.children.flatMap((child) => {
        const mapped = mapMDASTNodeToADFNodes(child, true)
        mapped.forEach((c) => {
          if (c?.type === 'text') {
            c.marks = [...(c?.marks ?? []), { type: 'em' }]
          }
        })
        return mapped
      })
      if (!blockParent) {
        return [
          {
            type: 'paragraph',
            content: mappedChildren as ADFInlineNode[],
          },
        ]
      }
      return mappedChildren
    }
    case 'footnoteDefinition': {
      return [] // TODO support GFM footnotes
    }
    case 'footnoteReference': {
      return [] // TODO support GFM footnotes
    }
    case 'heading': {
      const adf: ADFHeadingNode = {
        type: 'heading',
        attrs: {
          level: node.depth,
        },
        content: node.children.flatMap((child) => mapMDASTNodeToADFNodes(child, true)) as ADFInlineNode[],
      }
      return [adf]
    }
    case 'html': {
      // console.log('xX converting html', JSON.stringify(node))
      // TODO: special case SOME allowed HTML
      const adf: ADFParagraphNode = {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: node.value,
          },
        ],
      }
      return [adf]
    }
    case 'image': {
      // TODO support images
      // (atlassian requires attaching and referencing, so this cannot be done in isolation)
      return []
    }
    case 'imageReference': {
      return [] // TODO support refs (depends on definitions)
    }
    case 'inlineCode': {
      const adf: ADFTextNode = {
        type: 'text',
        text: node.value,
        marks: [{ type: 'code' }],
      }
      if (!blockParent) {
        return [
          {
            type: 'paragraph',
            content: [adf],
          },
        ]
      }
      return [adf]
    }
    case 'link': {
      const mappedChildren = node.children.flatMap((child) => {
        const mapped = mapMDASTNodeToADFNodes(child, true)
        mapped.forEach((c) => {
          if (c?.type === 'text') {
            c.marks = [...(c?.marks ?? []), { type: 'link', attrs: { href: node.url, title: node.title ?? undefined } }]
          }
        })
        return mapped
      })
      if (!blockParent) {
        return [
          {
            type: 'paragraph',
            content: mappedChildren as ADFInlineNode[],
          },
        ]
      }
      return mappedChildren
    }
    case 'linkReference': {
      return [] // TODO support refs (depends on definitions)
    }
    case 'list': {
      if (node.ordered) {
        const adf: ADFOrderedListNode = {
          type: 'orderedList',
          attrs: {
            order: node.start ?? 1,
          },
          content: node.children.flatMap((child) => mapMDASTNodeToADFNodes(child, true)) as ADFListItemNode[],
          // TODO support 'spread'
        }
        return [adf]
      }
      const adf: ADFBulletListNode = {
        type: 'bulletList',
        content: node.children.flatMap((child) => mapMDASTNodeToADFNodes(child, true)) as ADFListItemNode[],
        // TODO support 'spread'
      }
      return [adf]
    }
    case 'listItem': {
      const adf: ADFListItemNode = {
        type: 'listItem',
        content: node.children.flatMap(
          (child) => mapMDASTNodeToADFNodes(child, false) // wrap any text children in paragraphs
        ) as ADFParagraphNode[], // TODO fix
      }
      return [adf]
    }
    case 'paragraph': {
      const adf: ADFParagraphNode = {
        type: 'paragraph',
        content: node.children.flatMap((child) => mapMDASTNodeToADFNodes(child, true)) as ADFInlineNode[],
      }
      return [adf]
    }
    case 'strong': {
      const mappedChildren = node.children.flatMap((child) => {
        const mapped = mapMDASTNodeToADFNodes(child, true)
        mapped.forEach((c) => {
          if (c?.type === 'text') {
            c.marks = [...(c?.marks ?? []), { type: 'strong' }]
          }
        })
        return mapped
      })
      if (!blockParent) {
        return [
          {
            type: 'paragraph',
            content: mappedChildren as ADFInlineNode[],
          },
        ]
      }
      return mappedChildren
    }
    case 'table': {
      return [] // TODO support tables
    }
    case 'tableCell': {
      return [] // TODO support tables
    }
    case 'tableRow': {
      return [] // TODO support tables
    }
    case 'text': {
      const adf: ADFTextNode = {
        type: 'text',
        text: node.value,
      }
      if (!blockParent) {
        return [
          {
            type: 'paragraph',
            content: [adf],
          },
        ]
      }
      return [adf]
    }
    case 'thematicBreak': {
      const adf: ADFRuleNode = {
        type: 'rule',
      }
      return [adf]
    }
    case 'yaml': {
      return [] // TODO support YAML frontmatter
    }
    default: {
      //   console.error('xX unhandled node type', node.type)
      return []
    }
  }
}

export async function markdownToADF(markdown: string): Promise<ADFRoot> {
  const {fromMarkdown} = (await import('mdast-util-from-markdown'));
  const mdAST: Root = fromMarkdown(markdown)
  const adfRoot: ADFRoot = {
    type: 'doc',
    version: 1,
    content: mdAST.children.flatMap((child) => mapMDASTNodeToADFNodes(child)) as ADFTopLevelBlockNode[],
  }
  return adfRoot
}
