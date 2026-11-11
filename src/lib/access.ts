import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => Boolean(user?.role === 'admin')

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  Boolean(user && (user.role === 'admin' || user.role === 'editor'))

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

export const publishedOnly: Access = ({ req: { user } }) => {
  if (user && (user.role === 'admin' || user.role === 'editor')) return true
  return { _status: { equals: 'published' } }
}
