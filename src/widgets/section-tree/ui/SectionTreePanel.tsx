import { Fragment, useState } from 'react'
import { VerticalSpace, Text } from '@create-figma-plugin/ui'
import { SearchInput } from '../../../shared/ui/SearchInput'
import { LABEL_ADD_TO_SECTION } from '../../../shared/config/strings'
import { SectionTree } from './components/SectionTree'
import type { SectionFormat } from '../../../entities/frame/model/types'

/**
 * Panel displaying existing sections on the page with a search input and quick-add buttons.
 * Shown at the bottom of the Place tab when sections are available.
 * @param root0
 * @param root0.sections
 * @param root0.onPlace
 * @param root0.selectedCount
 */
export function SectionTreePanel({
  sections,
  onPlace,
  selectedCount,
}: {
  sections: SectionFormat[]
  onPlace: (fmt: string, ch: string, pl: string, cr: string) => void
  selectedCount: number
}) {
  const [query, setQuery] = useState('')
  return (
    <Fragment>
      <VerticalSpace space="small" />
      <Text>
        <strong>{LABEL_ADD_TO_SECTION}</strong>
      </Text>
      <VerticalSpace space="extraSmall" />
      <SearchInput value={query} onValueInput={setQuery} />
      <VerticalSpace space="extraSmall" />
      <SectionTree
        sections={sections}
        searchQuery={query}
        onPlace={onPlace}
        selectedCount={selectedCount}
      />
    </Fragment>
  )
}
