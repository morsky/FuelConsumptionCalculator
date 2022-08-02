export function calculateConsumption({ kilometers, liters }) {
  return (liters * 100) / kilometers;
}

export function calculatePricePerPerson({ cost, persons }) {
  return cost / persons;
}
