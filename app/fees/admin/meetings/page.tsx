'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Meeting {
  id: string
  meeting_date: string
  type: string
  collection_open: boolean
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase.from('meeting_sessions').select('*').order('meeting_date')
    setMeetings(data || [])
  }, [supabase])

  async function toggleCollection(id: string, current: boolean) {
    await supabase.from('meeting_sessions').update({ collection_open: !current }).eq('id', id)
    load()
  }

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Collection Windows</h2>
      {meetings.map(m => (
        <div key={m.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex justify-between items-center">
          <div>
            <p className="font-medium">{new Date(m.meeting_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-xs text-gray-500 capitalize">{m.type}</p>
          </div>
          <button onClick={() => toggleCollection(m.id, m.collection_open)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              m.collection_open ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400'
            }`}>
            {m.collection_open ? 'Open' : 'Closed'}
          </button>
        </div>
      ))}
    </div>
  )
}
