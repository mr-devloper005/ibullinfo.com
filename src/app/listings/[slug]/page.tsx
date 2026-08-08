import ListingDetailPage, {
  generateMetadata as generateListingMetadata,
} from '@/editable/pages/ListingDetailPage'

export const dynamic = 'force-dynamic'
export const revalidate = 3
export const generateMetadata = generateListingMetadata
export default ListingDetailPage
