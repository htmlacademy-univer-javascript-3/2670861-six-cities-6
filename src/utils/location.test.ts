import { describe, it, expect } from 'vitest';
import { getFirstLocation } from './location';

describe('getFirstLocation', () => {
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

  it('should return latitude and longitude as a tuple', () => {
    const result = getFirstLocation(mockOffer);

    expect(result).toEqual([48.8566, 2.3522]);
  });

  it('should extract coordinates from offer location', () => {
    const offerWithDifferentLocation: Offer = {
      ...mockOffer,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 10,
      },
    };

    const result = getFirstLocation(offerWithDifferentLocation);

    expect(result).toEqual([40.7128, -74.006]);
  });
});
