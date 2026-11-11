import type { GlobalConfig } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnorderedListFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone, isAdmin } from '@/lib/access'
import { revalidateGlobals } from '@/hooks/revalidate'

export const PrivacyPage: GlobalConfig = {
  slug: 'privacy-page',
  label: 'Chính sách bảo mật',
  access: {
    read: anyone,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateGlobals],
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      editor: lexicalEditor({
        features: () => [
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature(),
          UnorderedListFeature(),
        ],
      }),
    },
  ],
}
