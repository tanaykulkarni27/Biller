import { useMemo } from 'react'

const GOOGLE_COLORS = [
  { main: '#1a73e8', light: '#e8f0fe' }, // Blue
  { main: '#ea4335', light: '#fce8e6' }, // Red
  { main: '#34a853', light: '#e6f4ea' }, // Green
  { main: '#fbbc04', light: '#fef7e0' }, // Yellow
  { main: '#9334e6', light: '#f3e8fd' }, // Purple
  { main: '#ff6d01', light: '#feefe3' }, // Orange
]

function Avatar({ name = '', size = 40 }) {
  const letter = name.trim().charAt(0).toUpperCase() || '?'

  const color = useMemo(() => {
    return GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)]
  }, [])

  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color.light,
        color: color.main,
        fontSize: size * 0.45,
      }}
    >
      {letter}
    </div>
  )
}

export default Avatar
