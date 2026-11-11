import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Clients } from './collections/Clients'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { Faqs } from './collections/Faqs'
import { Leads } from './collections/Leads'
import { SiteSettings } from './globals/SiteSettings'
import { AboutPage } from './globals/AboutPage'
import { PrivacyPage } from './globals/PrivacyPage'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · ADX',
    },
  },
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
  collections: [Users, Media, Clients, Services, Projects, Faqs, Leads],
  globals: [SiteSettings, AboutPage, PrivacyPage],
  editor: lexicalEditor(),
  // PAYLOAD_SECRET required at runtime; build-time fallback keeps `next build` from crashing
  // when Vercel preview env is incomplete (still set a real secret in production).
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      // Empty string breaks pg SASL at connect; placeholder is for config init only.
      // Runtime / seed still need a real DATABASE_URI (Neon etc.).
      // Neon cold starts need more than a tight CI timeout; 10s covers pooler wake-up.
      connectionString:
        process.env.DATABASE_URI ||
        process.env.DATABASE_URL ||
        'postgresql://build:build@127.0.0.1:5432/adx_build',
      connectionTimeoutMillis: 10_000,
    },
    push: process.env.NODE_ENV !== 'production',
  }),
  plugins,
  sharp,
  localization: false,
})
