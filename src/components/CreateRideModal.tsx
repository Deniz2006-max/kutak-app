import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState } from 'react'
import { PLACES, type Place, type Ride } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (ride: Omit<Ride, 'id' | 'seatsTaken' | 'seatsTotal'>) => void
}

export function CreateRideModal({ open, onClose, onCreate }: Props) {
  const titleId = useId()
  const [hostName, setHostName] = useState('')
  const [pickup, setPickup] = useState<Place>('Main Campus')
  const [destination, setDestination] = useState<Place>('Hacıosman Metro Station')
  const [departureTime, setDepartureTime] = useState('08:30')
  const [error, setError] = useState('')

  function reset() {
    setHostName('')
    setPickup('Main Campus')
    setDestination('Hacıosman Metro Station')
    setDepartureTime('08:30')
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hostName.trim()) {
      setError('Add a host name')
      return
    }
    if (pickup === destination) {
      setError('Pickup and destination must differ')
      return
    }
    onCreate({
      hostName: hostName.trim(),
      pickup,
      destination,
      departureTime,
    })
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-teal/15 bg-foam p-6 shadow-2xl"
          >
            <h2 id={titleId} className="font-display text-2xl font-bold tracking-tight text-ink">
              Create Taxi Group
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Host a 4-seat ride for verified KU students.
            </p>

            <div className="mt-5 space-y-4">
              <Field label="Host name">
                <input
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Your name"
                  className="field"
                  autoFocus
                />
              </Field>
              <Field label="Pickup">
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value as Place)}
                  className="field"
                >
                  {PLACES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Destination">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value as Place)}
                  className="field"
                >
                  {PLACES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Departure time">
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="field"
                />
              </Field>
              {error && <p className="text-sm font-medium text-coral">{error}</p>}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  reset()
                  onClose()
                }}
                className="flex-1 rounded-xl border border-ink/10 bg-mist px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-mist-deep"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-saffron px-4 py-2.5 text-sm font-semibold text-ink hover:bg-saffron-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
              >
                Create group
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/80">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
