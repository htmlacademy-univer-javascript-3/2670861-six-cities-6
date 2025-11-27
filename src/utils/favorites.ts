/**
 * Преобразует Offer в формат FavoriteOffer для списка избранного
 */
export function mapOfferToFavorite(offer: Offer): FavoriteOffer {
  return {
    id: offer.id,
    title: offer.title,
    type: offer.type,
    price: offer.price,
    image: offer.previewImage, // маппинг previewImage в image
    ratingPercent: offer.rating * 20, // конвертация rating (0-5) в проценты (0-100)
    isPremium: offer.isPremium,
    city: offer.city.name, // извлечение названия города
    latitude: offer.location.latitude,
    longitude: offer.location.longitude,
  };
}
