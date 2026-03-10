import { useEffect, useState } from 'react'
import { getCurrentSession } from '../utils/supabaseClient'

// Local-only profile storage (per user, per device)
function storageKeyFor(uid) {
  return `vg_profile_${uid}`
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState(null)

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    studying: '',
    // We store avatar as data URL in localStorage (no backend)
    avatar_data_url: '',
    avatar_name: '',
  })

  // Load session and then load local profile for that user
  useEffect(() => {
    async function load() {
      setLoading(true)
      const session = await getCurrentSession()
      const uid = session?.user?.id || null
      const email = session?.user?.email || ''
      setUserId(uid)

      if (!uid) {
        // Not authenticated, just show empty read-only state
        setProfile((p) => ({ ...p, email }))
        setLoading(false)
        return
      }

      const raw = localStorage.getItem(storageKeyFor(uid))
      if (raw) {
        try {
          const saved = JSON.parse(raw)
          setProfile((p) => ({
            ...p,
            full_name: saved.full_name || '',
            email: saved.email || email,
            phone: saved.phone || '',
            bio: saved.bio || '',
            studying: saved.studying || '',
            avatar_data_url: saved.avatar_data_url || '',
            avatar_name: saved.avatar_name || '',
          }))
        } catch (_) {
          setProfile((p) => ({ ...p, email }))
        }
      } else {
        // Initialize with session email
        setProfile((p) => ({ ...p, email }))
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, [name]: value }))
  }

  // Handle file selection: convert to data URL and keep in state (no uploads)
  const handleAvatarSelect = (file) => {
    if (!file) {
      setProfile((p) => ({ ...p, avatar_data_url: '', avatar_name: '' }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar_data_url: reader.result || '', avatar_name: file.name }))
    }
    reader.onerror = () => {
      alert('Failed to read selected image')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!userId) {
      alert('You must be logged in to save your profile')
      return
    }

    setSaving(true)
    try {
      const payload = {
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        studying: profile.studying || '',
        avatar_data_url: profile.avatar_data_url || '',
        avatar_name: profile.avatar_name || '',
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem(storageKeyFor(userId), JSON.stringify(payload))
      alert('Profile saved locally on this device')
    } catch (err) {
      console.error(err)
      alert('Failed to save profile locally')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white shadow-soft rounded-xl p-6">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-soft rounded-xl p-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h1>
        <p className="text-gray-600 mb-6">This profile is stored locally on your device and tied to your login. There is no backend database for this section.</p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
              {profile.avatar_data_url ? (
                <img src={profile.avatar_data_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No Photo</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarSelect(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {profile.avatar_name && (
                <p className="text-xs text-gray-500 mt-1 truncate" title={profile.avatar_name}>{profile.avatar_name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Stored only on this device. Large images may increase local storage size.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., +91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Studying</label>
              <input
                type="text"
                name="studying"
                value={profile.studying}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Degree / Course (e.g., B.Tech CSE)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
