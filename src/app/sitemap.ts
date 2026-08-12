import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base='https://adxchange.vercel.app'; return ['','/advertisers','/publishers','/login','/register'].map(path=>({url:`${base}${path}`,lastModified:new Date()})); }
