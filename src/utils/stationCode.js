const stationCode = (name) => {
  if (name.includes("NLT")) return "NLT"
  if (name.includes("SWLT")) return "SWLT"
  if (name.includes("Science")) return "SCI"
  if (name.includes("New Site")) return "NSW"
  if (name.includes("Old Site")) return "OSW"
  return name.slice(0, 3).toUpperCase()
}

export default stationCode