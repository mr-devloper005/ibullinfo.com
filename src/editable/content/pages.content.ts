import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Browse local posts, listings, and useful updates',
      description: 'A calm, directory-style homepage for discovering listings, classifieds, articles, and supporting pages.',
      openGraphTitle: 'Browse local posts, listings, and useful updates',
      openGraphDescription: 'Discover listings, posts, documents, and local updates through a cleaner browsing experience.',
      keywords: ['local listings', 'classifieds', 'directory', 'posts', 'discover'],
    },
    hero: {
      badge: 'Fresh posts and nearby listings',
      title: ['Find what you need,', 'post what you want,', 'and keep moving.'],
      description: 'Use one clear homepage to search listings, review offers, open articles, and browse useful pages without extra clutter.',
      primaryCta: { label: 'Browse listings', href: '/listing' },
      secondaryCta: { label: 'View classifieds', href: '/classified' },
      searchPlaceholder: 'Looking for a service, place, or offer?',
      focusLabel: 'Search',
      featureCardBadge: 'live feed',
      featureCardTitle: 'A homepage that balances search, discovery, and promotion.',
      featureCardDescription: 'The page is built like a modern directory: search first, cards second, and useful shortcuts within reach.',
    },
    intro: {
      badge: 'How it works',
      title: 'Everything important is organized for quick browsing.',
      paragraphs: [
        'Visitors can move between listings, classifieds, articles, profiles, images, and files using the same clear layout.',
        'The homepage keeps the strongest items up front while still leaving room for the latest posts, helpful links, and practical shortcuts.',
        'Every section is designed to feel readable on desktop and polished on mobile.',
      ],
      sideBadge: 'Quick notes',
      sidePoints: [
        'Search sits close to the top so visitors can jump in immediately.',
        'Cards change style by section to keep the layout feeling lively.',
        'Featured items use a horizontal rail with subtle motion.',
        'Supporting blocks stay compact and easy to scan.',
      ],
      primaryLink: { label: 'Start browsing', href: '/listing' },
      secondaryLink: { label: 'Open articles', href: '/article' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'Promote, browse, and publish from one clean front page.',
      description: 'This layout is tuned for faster discovery, stronger presentation, and simple entry points for every major content type.',
      primaryCta: { label: 'Post an ad', href: '/contact' },
      secondaryCta: { label: 'Create account', href: '/signup' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Fresh content is surfaced here with a clear and readable layout.',
    },
  },
  about: {
    badge: 'About this site',
    title: `A public site for sharing useful posts and local opportunities.`,
    description: `${slot4BrandConfig.siteName} is organized to help people browse, compare, and promote content without feeling lost in a generic feed.`,
    paragraphs: [
      'The focus is simple: make useful content easier to find, easier to read, and easier to act on.',
      'The site keeps listings, classifieds, articles, profiles, and document pages connected through a consistent navigation system.',
    ],
    values: [
      {
        title: 'Clear navigation',
        description: 'The top-level paths stay consistent so users can move from search to detail pages quickly.',
      },
      {
        title: 'Flexible cards',
        description: 'Different card styles help featured posts, compact items, and editorial reads feel distinct.',
      },
      {
        title: 'Safe fallbacks',
        description: 'Posts still render cleanly even when an image, summary, or category field is missing.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Send a note, ask a question, or share a listing request.',
    description: 'Use this page for publishing help, account questions, or anything else that belongs on a general contact form.',
    formTitle: 'Write to us',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, listings, visuals, and resources faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More stories',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'More listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details appear here when available.',
      visitButton: 'Open profile',
    },
  },
} as const
