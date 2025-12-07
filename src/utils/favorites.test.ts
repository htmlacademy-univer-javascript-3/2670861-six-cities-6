import { describe, it, expect } from 'vitest';
import { mapOfferToFavorite } from './favorites';

describe('mapOfferToFavorite', () => {
  const mockOffer: Offer = {
    id: '1',
    title: 'Beautiful Apartment',
    type: 'apartment',
    price: 150,
    previewImage: 'image.jpg',
    rating: 4.2,
    isPremium: true,
    isFavorite: false,
    city: {
      name: 'Paris',
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
    },
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 12,
    },
    reviews: [],
  };

  it('should correctly map Offer to FavoriteOffer', () => {
    const result = mapOfferToFavorite(mockOffer);

    expect(result).toEqual({
      id: '1',
      title: 'Beautiful Apartment',
      type: 'apartment',
      price: 150,
      image: 'image.jpg',
      ratingPercent: 84, // 4.2 * 20 = 84
      isPremium: true,
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
    });
  });

  it('should handle non-premium offers', () => {
    const offer = { ...mockOffer, isPremium: false };
    const result = mapOfferToFavorite(offer);

    expect(result.isPremium).toBe(false);
  });

  it('should convert rating to percentage correctly', () => {
    const offer = { ...mockOffer, rating: 2.5 };
    const result = mapOfferToFavorite(offer);

    expect(result.ratingPercent).toBe(50); // 2.5 * 20 = 50
  });

  it('should handle zero rating', () => {
    const offer = { ...mockOffer, rating: 0 };
    const result = mapOfferToFavorite(offer);

    expect(result.ratingPercent).toBe(0);
  });

  it('should handle maximum rating', () => {
    const offer = { ...mockOffer, rating: 5 };
    const result = mapOfferToFavorite(offer);

    expect(result.ratingPercent).toBe(100);
  });
});
