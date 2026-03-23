import { emit, on } from '@create-figma-plugin/utilities'
import * as config from '../shared/config'
import { scanPage, getSectionsHierarchy, updateExportItems } from '../entities/frame/api'
import { isFrame } from '../shared/lib/figma'
import { register as registerExport } from '../features/export-frames/api'
import { register as registerPlace } from '../features/place-sections/api'

declare const __html__: string

figma.showUI(__html__, {
  width: config.WINDOW_WIDTH,
  height: config.WINDOW_HEIGHT,
  themeColors: true,
})

registerExport()
registerPlace()

on('resize', ({ height }: { height: number }) => {
  figma.ui.resize(config.WINDOW_WIDTH, Math.max(config.WINDOW_MIN_HEIGHT, height))
})

figma.on('currentpagechange', () => {
  const result = scanPage()
  updateExportItems(result.items)
  emit('scan-result', { tree: result.tree, items: result.items })
  emit('sections-data', { sections: getSectionsHierarchy() })
  const frames = figma.currentPage.selection.filter(isFrame)
  emit('selection-change', { count: frames.length })
})

figma.on('selectionchange', () => {
  const frames = figma.currentPage.selection.filter(isFrame)
  emit('selection-change', { count: frames.length })
})
