import { motion } from 'framer-motion'
import type { Ride } from '../types'
import { SeatSlots } from './SeatSlots'

type Props = {
  ride: Ride
  onReserve: (id: string) => void
  index: number
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = ((h + 11) % 12) + 1
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function RideCard({ ride, onReserve, index }: Props) {
  const locked = ride.seatsTaken >= ride.seatsTotal
  const seatsLeft = ride.seatsTotal - ride.seatsTaken

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-shadow ${
        locked
          ? 'border-locked/20 bg-foam/60 shadow-none'
          : 'border-teal/10 bg-foam/90 shadow-[0_12px_40px_-20px_rgba(12,26,28,0.35)] hover:shadow-[0_16px_44px_-18px_rgba(10,92,90,0.35)]'
      }`}
    >
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(90,107,110,0.04)_10px,rgba(90,107,110,0.04)_20px)]"
          aria-hidden
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft/70">Host</p>
          <h3 className="mt-0.5 font-display text-lg font-bold tracking-tight text-ink">
            {ride.hostName}
          </h3>
        </div>
        {locked ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-locked/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-locked">
            <LockIcon />
            Locked
          </span>
        ) : (
          <span className="tabular-nums text-sm font-semibold text-teal">
            {seatsLeft} left
          </span>
        )}
      </div>

      <div className="relative space-y-2">
        <RouteLine from={ride.pickup} to={ride.destination} muted={locked} />
        <p className={`text-sm ${locked ? 'text-locked' : 'text-ink-soft'}`}>
          Departs <span className="font-semibold text-ink">{formatTime(ride.departureTime)}</span>
        </p>
      </div>

      <div className="relative mt-auto flex flex-col gap-3 border-t border-ink/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <SeatSlots seatsTaken={ride.seatsTaken} seatsTotal={ride.seatsTotal} locked={locked} />
        <button
          type="button"
          disabled={locked}
          onClick={() => onReserve(ride.id)}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
            locked
              ? 'cursor-not-allowed bg-locked/15 text-locked'
              : 'bg-teal text-foam hover:bg-teal-deep focus-visible:outline-teal active:scale-[0.98]'
          }`}
        >
          {locked ? 'Fully booked' : 'Reserve Seat'}
        </button>
      </div>
    </motion.article>
  )
}

function RouteLine({ from, to, muted }: { from: string; to: string; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${muted ? 'text-locked' : 'text-ink'}`}>
      <span className="truncate">{from}</span>
      <ArrowIcon className={muted ? 'text-locked/50' : 'text-saffron'} />
      <span className="truncate">{to}</span>
    </div>
  )
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8 0V7a3 3 0 0 1 6 0v2H9Z" />
    </svg>
  )
}
