import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: 'Local listings, posts, and useful updates',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Browse, post, and discover',
    primaryLinks: [
      { label: 'Listings', href: '/listing' },
      { label: 'Classifieds', href: '/classified' },
      { label: 'Articles', href: '/article' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Files', href: '/pdf' },
    ],
    actions: {
      primary: { label: 'Post a free ad', href: '/contact' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'A neat place for browsing local content and useful pages.',
    description: 'Explore posts, listings, documents, images, and profile pages through a cleaner front door designed for quick discovery.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Listings', href: '/listing' },
          { label: 'Classifieds', href: '/classified' },
          { label: 'Articles', href: '/article' },
          { label: 'Images', href: '/image' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { label: 'Profiles', href: '/profile' },
          { label: 'PDFs', href: '/pdf' },
          { label: 'Bookmarks', href: '/sbm' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Help',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Login', href: '/login' },
          { label: 'Sign up', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Built for fast browsing and easy posting.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
