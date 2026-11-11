type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  children?: LexicalNode[]
  fields?: { url?: string; newTab?: boolean }
}

function renderNodes(nodes?: LexicalNode[]): React.ReactNode {
  if (!nodes) return null
  return nodes.map((node, i) => {
    if (node.type === 'text') return <span key={i}>{node.text}</span>
    if (node.type === 'linebreak') return <br key={i} />
    if (node.type === 'link' || node.type === 'autolink') {
      const url = node.fields?.url || '#'
      return (
        <a key={i} href={url} className="underline" target={node.fields?.newTab ? '_blank' : undefined} rel="noopener noreferrer">
          {renderNodes(node.children)}
        </a>
      )
    }
    if (node.type === 'paragraph') return <p key={i} className="mb-3 last:mb-0">{renderNodes(node.children)}</p>
    if (node.type === 'heading') {
      const Tag = (node.tag || 'h2') as 'h2' | 'h3'
      return (
        <Tag key={i} className={Tag === 'h2' ? 'text-h2 mb-4' : 'text-h3 mb-3'}>
          {renderNodes(node.children)}
        </Tag>
      )
    }
    if (node.type === 'list') {
      return (
        <ul key={i} className="mb-3 list-disc pl-5">
          {renderNodes(node.children)}
        </ul>
      )
    }
    if (node.type === 'listitem') return <li key={i}>{renderNodes(node.children)}</li>
    if (node.children) return <span key={i}>{renderNodes(node.children)}</span>
    return null
  })
}

export function RichText({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object') return null
  const root = (data as { root?: { children?: LexicalNode[] } }).root
  return <div>{renderNodes(root?.children)}</div>
}
