export const PLACES = [
  'Main Campus',
  'West Campus',
  'Hacıosman Metro Station',
  'Sarıyer',
  'Sabiha Gökçen Airport',
] as const

export type Place = (typeof PLACES)[number]

export type Ride = {
  id: string
  hostName: string
  pickup: Place
  destination: Place
  departureTime: string // HH:mm
  seatsTaken: number
  seatsTotal: 4
}

export const CAPACITY = 4 as const
