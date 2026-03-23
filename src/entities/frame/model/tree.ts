import type { TreeNode } from './types'

export interface FlatRow {
  key: string
  formatTag: string
  channel: string
  platform: string
  creative: string
  frameName: string
  gifFrameInfo?: string
}

export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query) return nodes
  const q = query.toLowerCase()
  return nodes.map((node) => filterNode(node, q)).filter((n): n is TreeNode => n !== null)
}

export function filterNode(node: TreeNode, query: string): TreeNode | null {
  if (node.type === 'frame') {
    const matches =
      node.name.toLowerCase().includes(query) ||
      (node.size && node.size.toLowerCase().includes(query))
    return matches ? node : null
  }
  // For non-leaf nodes, check if the node name matches or any children match
  const nameMatches = node.name.toLowerCase().includes(query)
  if (!node.children) return nameMatches ? node : null
  const filteredChildren = node.children
    .map((c) => filterNode(c, query))
    .filter((c): c is TreeNode => c !== null)
  if (filteredChildren.length > 0) {
    return { ...node, children: filteredChildren }
  }
  return nameMatches ? { ...node, children: [] } : null
}

export function countFrames(node: TreeNode): string {
  let count = 0
  function walk(n: TreeNode) {
    if (n.type === 'frame') count++
    n.children?.forEach(walk)
  }
  walk(node)
  return `${count}`
}

export function flattenToRows(nodes: TreeNode[]): FlatRow[] {
  const rows: FlatRow[] = []
  for (const fmt of nodes) {
    const formatTag = fmt.name.toLowerCase()
    for (const ch of fmt.children ?? []) {
      for (const pl of ch.children ?? []) {
        for (const cr of pl.children ?? []) {
          for (const fr of cr.children ?? []) {
            if (fr.type === 'frame') {
              const gifInfo =
                formatTag === 'gif' ? fr.size?.match(/\(\d+ frames?\)/)?.[0] : undefined
              rows.push({
                key: `${fr.name}_${formatTag}`,
                formatTag,
                channel: ch.name,
                platform: pl.name,
                creative: cr.name,
                frameName: fr.name.replace(/\.[^.]+$/, ''),
                gifFrameInfo: gifInfo,
              })
            }
          }
        }
      }
    }
  }
  return rows
}

export function filterFlatRows(rows: FlatRow[], query: string): FlatRow[] {
  if (!query) return rows
  const q = query.toLowerCase()
  return rows.filter(
    (r) =>
      r.frameName.toLowerCase().includes(q) ||
      r.formatTag.includes(q) ||
      r.channel.toLowerCase().includes(q) ||
      r.platform.toLowerCase().includes(q) ||
      r.creative.toLowerCase().includes(q),
  )
}
