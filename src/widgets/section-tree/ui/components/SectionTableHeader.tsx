import { FlatTableHeader } from '../../../../shared/ui/FlatTableHeader'

/** Sticky column header for the section table view. Last column is the add-button spacer. */
export function SectionTableHeader() {
  return <FlatTableHeader lastCell={<span style={{ width: 18 }} />} />
}
