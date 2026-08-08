import ImageDetailPage, {
  generateMetadata as generateImageMetadata,
} from '@/editable/pages/ImageDetailPage'

export const dynamic = 'force-dynamic'
export const revalidate = 3
export const generateMetadata = generateImageMetadata
export default ImageDetailPage
