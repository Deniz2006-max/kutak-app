import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { CreateRideModal } from './components/CreateRideModal'
import { RideCard } from './components/RideCard'
import { mockRides } from './data/mockRides'
import { CAPACITY, PLACES, type Place, type Ride } from './types'

const QUICK_FILTERS = [
  'Hacıosman Metro',
  'Sarıyer',
  'West Campus',
  'Sabiha Gökçen',
] as const

type QuickFilter = (typeof QUICK_FILTERS)[number]

function matchesQuickFilter(ride: Ride, chip: QuickFilter): boolean {
  const haystack = `${ride.pickup} ${ride.destination}`.toLowerCase()
  const needle = chip.toLowerCase()
  if (chip === 'Hacıosman Metro') return haystack.includes('hacıosman')
  if (chip === 'Sabiha Gökçen') return haystack.includes('sabiha')
  return haystack.includes(needle)
}

function placeIncludes(place: Place, query: string) {
  return place.toLowerCase().includes(query.trim().toLowerCase())
}

export default function App() {
  const [rides, setRides] = useState<Ride[]>(mockRides)
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [time, setTime] = useState('')
  const [activeChip, setActiveChip] = useState<QuickFilter | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    return rides.filter((ride) => {
      if (pickup && !placeIncludes(ride.pickup, pickup)) return false
      if (destination && !placeIncludes(ride.destination, destination)) return false
      if (time && ride.departureTime < time) return false
      if (activeChip && !matchesQuickFilter(ride, activeChip)) return false
      return true
    })
  }, [rides, pickup, destination, time, activeChip])

  function reserveSeat(id: string) {
    setRides((prev) =>
      prev.map((ride) => {
        if (ride.id !== id || ride.seatsTaken >= CAPACITY) return ride
        return { ...ride, seatsTaken: ride.seatsTaken + 1 }
      }),
    )
  }

  function createRide(draft: Omit<Ride, 'id' | 'seatsTaken' | 'seatsTotal'>) {
    const ride: Ride = {
      ...draft,
      id: `r-${Date.now()}`,
      seatsTaken: 0,
      seatsTotal: CAPACITY,
    }
    setRides((prev) => [ride, ...prev])
  }

  function toggleChip(chip: QuickFilter) {
    setActiveChip((current) => (current === chip ? null : chip))
  }

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-teal/10 bg-foam/55 px-5 py-8 shadow-[0_24px_60px_-36px_rgba(12,26,28,0.45)] backdrop-blur-md sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-saffron/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-teal/15 blur-3xl"
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">
            Koç University · @ku.edu.tr
          </p>
          <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl md:text-7xl">
            Kutak
          </h1>
          <p className="mt-3 max-w-xl text-base text-ink-soft sm:text-lg">
            Share a taxi between campus and the city — four seats, one ride, no chat chaos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_0.9fr_auto]"
        >
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft/75">
              Pickup
            </span>
            <input
              list="kutak-places"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Where from?"
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft/75">
              Destination
            </span>
            <input
              list="kutak-places"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft/75">
              Time from
            </span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="field"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-xl bg-saffron px-4 py-3 text-sm font-bold text-ink shadow-[0_10px_28px_-12px_rgba(232,163,23,0.8)] transition hover:bg-saffron-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron active:scale-[0.98] sm:whitespace-nowrap"
            >
              + Create Taxi Group
            </button>
          </div>
        </motion.div>

        <datalist id="kutak-places">
          {PLACES.map((place) => (
            <option key={place} value={place} />
          ))}
        </datalist>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
          }}
          className="relative mt-5 flex flex-wrap gap-2"
        >
          {QUICK_FILTERS.map((chip) => {
            const active = activeChip === chip
            return (
              <motion.button
                key={chip}
                type="button"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                onClick={() => toggleChip(chip)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'border-teal bg-teal text-foam'
                    : 'border-teal/20 bg-foam/80 text-ink-soft hover:border-teal/40 hover:text-teal'
                }`}
              >
                {chip}
              </motion.button>
            )
          })}
          {(pickup || destination || time || activeChip) && (
            <button
              type="button"
              onClick={() => {
                setPickup('')
                setDestination('')
                setTime('')
                setActiveChip(null)
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-coral hover:underline"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Open rides
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {filtered.length} group{filtered.length === 1 ? '' : 's'} matching your search
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-teal/25 bg-foam/50 px-6 py-14 text-center">
            <p className="font-display text-xl font-bold text-ink">No rides match</p>
            <p className="mt-2 text-sm text-ink-soft">
              Try clearing filters or create a new taxi group.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((ride, index) => (
                <RideCard key={ride.id} ride={ride} index={index} onReserve={reserveSeat} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <CreateRideModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createRide} />
    </div>
  )
}
