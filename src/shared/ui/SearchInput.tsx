import { SearchTextbox } from '@create-figma-plugin/ui'
import { SEARCH_PLACEHOLDER } from '../config/strings'

export { SEARCH_PLACEHOLDER }

/**
 * Shared search input wrapper around Figma UI `SearchTextbox`.
 * Clears on Escape key by default and uses a shared placeholder.
 * @param root0
 * @param root0.value
 * @param root0.onValueInput
 */
export function SearchInput({
  value,
  onValueInput,
}: {
  value: string
  onValueInput: (v: string) => void
}) {
  return (
    <SearchTextbox
      clearOnEscapeKeyDown
      placeholder={SEARCH_PLACEHOLDER}
      value={value}
      onValueInput={onValueInput}
    />
  )
}
