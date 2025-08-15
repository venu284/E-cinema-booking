const seatLayout = []

const rows = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i))
const seatsPerRow = 10

rows.forEach(row => {
  for (let i = 1; i <= seatsPerRow; i++) {
    seatLayout.push(`${row}${i}`)
  }
})

export default seatLayout
