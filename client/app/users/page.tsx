'use client'

import { useEffect, useState } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Badge } from '@/components/badge'
import userService from '@/lib/services/userService'
import { Filter, Trash2, Edit, Check, X } from 'lucide-react'

const roleLabel: Record<string, string> = {
  admin: 'Administrator',
  it_staff: 'IT Staff',
  student: 'Student',
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll()
      setUsers(res.users || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEditStart = (user: any) => {
    setEditingId(user._id)
    setEditRole(user.role)
    setError('')
  }

  const handleEditSave = async (id: string) => {
    try {
      await userService.updateRole(id, editRole)
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: editRole } : u))
      )
      setEditingId(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update role')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      await userService.remove(id)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user')
    }
  }

  // Backend has no "active/inactive" field — derive from updatedAt
  const formatted = users.map((u: any) => ({
    ...u,
    displayRole: roleLabel[u.role] || u.role,
    lastLogin: u.updatedAt
      ? new Date(u.updatedAt).toLocaleString()
      : 'Never',
    initials: u.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  }))

  const filtered = formatted.filter((u) => {
    const roleMatch = roleFilter === 'all' || u.role === roleFilter
    return roleMatch
  })

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    students: users.filter((u) => u.role === 'student').length,
  }

  return (
    <LayoutWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold mt-2 text-blue-500">
              {stats.admins}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Students</p>
            <p className="text-2xl font-bold mt-2">{stats.students}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="it_staff">IT Staff</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-foreground">
                            {user.initials}
                          </span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                      {user.email}
                    </td>

                    {/* Role — inline edit */}
                    <td className="px-6 py-4 text-sm">
                      {editingId === user._id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="rounded-lg border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="admin">Administrator</option>
                          <option value="it_staff">IT Staff</option>
                          <option value="student">Student</option>
                        </select>
                      ) : (
                        <Badge
                          variant={
                            user.role === 'admin'
                              ? 'error'
                              : user.role === 'it_staff'
                              ? 'info'
                              : 'success'
                          }
                          label={user.displayRole}
                        />
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {editingId === user._id ? (
                          <>
                            <button
                              onClick={() => handleEditSave(user._id)}
                              className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Save"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(user)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="Edit role"
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </LayoutWrapper>
  )
}