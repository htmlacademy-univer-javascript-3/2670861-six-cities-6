export function getFirstLocation(offer: Offer): [number, number] {
  return [offer.location.latitude, offer.location.longitude];
}
