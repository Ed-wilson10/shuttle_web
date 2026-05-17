const generateBookingId = () => {
  return "SP-" + Math.random().toString(36).substr(2, 6).toUpperCase()
}

export default generateBookingId