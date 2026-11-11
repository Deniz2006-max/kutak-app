import { motion } from 'framer-motion'
import type { Ride } from '../types'

type Props = {
  seatsTaken: number
  seatsTotal: Ride['seatsTotal']
  locked: boolean
}

export function SeatSlots({ seatsTaken, seatsTotal, locked }: Props) {
  return (
    <div className="flex items-center gap-2" aria-label={`${seatsTaken} of ${seatsTotal} seats taken`}>
      {Array.from({ length: seatsTotal }, (_, i) => {
        const filled = i < seatsTaken
        return (
          <motion.span
            key={i}
            layout
            initial={false}
            animate={{
              backgroundColor: filled
                ? locked
                  ? '#5a6b6e'
                  : '#0a5c5a'
                : '#c5d4d6',
              scale: filled ? 1 : 0.92,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 24, delay: filled ? i * 0.04 : 0 }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 ${filled ? 'text-foam' : 'text-ink-soft/40'}`}
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.1-8 4.7V21h16v-2.3c0-2.6-3.6-4.7-8-4.7Z" />
            </svg>
          </motion.span>
        )
      })}
      <span className={`ml-1 text-sm font-semibold tabular-nums ${locked ? 'text-locked' : 'text-teal'}`}>
        {seatsTaken}/{seatsTotal}
      </span>
    </div>
  )
}
