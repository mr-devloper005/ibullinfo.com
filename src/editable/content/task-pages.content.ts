import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial lane',
    headline: 'Long-form posts with a calmer reading rhythm.',
    description: 'Articles use a wider layout, stronger headlines, and enough breathing room for larger passages of text.',
    filterLabel: 'Filter article topics',
    secondaryNote: 'Good reading pages stay clear, paced, and easy to scan.',
    chips: ['Editorial', 'Guides', 'Reading first'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving offers, promotions, and short-form posts.',
    description: 'Classified pages should feel practical and immediate, with direct actions and quick visual scanning.',
    filterLabel: 'Filter classified posts',
    secondaryNote: 'Keep the pace brisk and the layout easy to skim.',
    chips: ['Offers', 'Promotions', 'Quick scan'],
  },
  sbm: {
    eyebrow: 'Saved links',
    headline: 'Bookmarks arranged like useful reference shelves.',
    description: 'Bookmark pages should make curated links, tools, and resource pages feel organized and dependable.',
    filterLabel: 'Filter saved items',
    secondaryNote: 'Reference collections work best when the labels stay calm and clear.',
    chips: ['Resources', 'Collections', 'Reference'],
  },
  profile: {
    eyebrow: 'People and brands',
    headline: 'Profiles with a cleaner identity and trust cue system.',
    description: 'Profile pages highlight people, businesses, and entities in a way that makes comparison easier.',
    filterLabel: 'Filter profiles',
    secondaryNote: 'Identity should be obvious before the page becomes dense.',
    chips: ['Identity', 'Trust', 'Contacts'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Downloads and reference files presented like a useful archive.',
    description: 'PDF pages should feel practical, organized, and easy to scan before opening the file.',
    filterLabel: 'Filter documents',
    secondaryNote: 'A document page should behave more like a library than a blog.',
    chips: ['Files', 'Guides', 'Archive'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Listings that feel searchable, comparable, and up to date.',
    description: 'Directory pages need concise metadata, trust cues, and a layout that encourages quick browsing.',
    filterLabel: 'Filter listings',
    secondaryNote: 'Comparison is easier when location, actions, and names stay visible.',
    chips: ['Directory', 'Local', 'Compare'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image-first pages with a smoother browsing rhythm.',
    description: 'Image posts should lead with the visual and let short labels and captions support the story.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'When photos carry the page, the rest can stay minimal.',
    chips: ['Gallery', 'Image-led', 'Portfolio'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
