import { describe, it, expect } from 'vitest';
import { SORTING_LABELS, sortOffers } from './sorting';

describe('SORTING_LABELS', () => {
  it('should contain all sorting type labels', () => {
    expect(SORTING_LABELS).toEqual({
      popular: 'Popular',
      'price-low-to-high': 'Price: low to high',
      'price-high-to-low': 'Price: high to low',
      'top-rated-first': 'Top rated first',
    });
  });

  it('should have correct label for popular sorting', () => {
    expect(SORTING_LABELS.popular).toBe('Popular');
  });

  it('should have correct label for price low to high sorting', () => {
    expect(SORTING_LABELS['price-low-to-high']).toBe('Price: low to high');
  });

  it('should have correct label for price high to low sorting', () => {
    expect(SORTING_LABELS['price-high-to-low']).toBe('Price: high to low');
  });

  it('should have correct label for top rated first sorting', () => {
    expect(SORTING_LABELS['top-rated-first']).toBe('Top rated first');
  });
});

describe('sortOffers', () => {
  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Cheap Apartment',
      type: 'apartment',
      price: 100,
      previewImage: 'image1.jpg',
      rating: 3.0,
      isPremium: false,
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
    },
    {
      id: '2',
      title: 'Expensive House',
      type: 'house',
      price: 300,
      previewImage: 'image2.jpg',
      rating: 4.5,
      isPremium: true,
      isFavorite: true,
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
    },
    {
      id: '3',
      title: 'Medium Hotel',
      type: 'hotel',
      price: 200,
      previewImage: 'image3.jpg',
      rating: 4.0,
      isPremium: false,
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
    },
  ];

  it('should sort offers by price low to high', () => {
    const result = sortOffers(mockOffers, 'price-low-to-high');

    expect(result[0].price).toBe(100);
    expect(result[1].price).toBe(200);
    expect(result[2].price).toBe(300);
    expect(result.map((offer) => offer.id)).toEqual(['1', '3', '2']);
  });

  it('should sort offers by price high to low', () => {
    const result = sortOffers(mockOffers, 'price-high-to-low');

    expect(result[0].price).toBe(300);
    expect(result[1].price).toBe(200);
    expect(result[2].price).toBe(100);
    expect(result.map((offer) => offer.id)).toEqual(['2', '3', '1']);
  });

  it('should sort offers by rating top rated first', () => {
    const result = sortOffers(mockOffers, 'top-rated-first');

    expect(result[0].rating).toBe(4.5);
    expect(result[1].rating).toBe(4.0);
    expect(result[2].rating).toBe(3.0);
    expect(result.map((offer) => offer.id)).toEqual(['2', '3', '1']);
  });

  it('should not modify original array', () => {
    const originalOrder = mockOffers.map((offer) => offer.id);
    sortOffers(mockOffers, 'price-low-to-high');

    expect(mockOffers.map((offer) => offer.id)).toEqual(originalOrder);
  });

  it('should return original order for popular sorting', () => {
    const result = sortOffers(mockOffers, 'popular');

    expect(result.map((offer) => offer.id)).toEqual(['1', '2', '3']);
  });

  it('should handle empty array', () => {
    const result = sortOffers([], 'price-low-to-high');

    expect(result).toEqual([]);
  });

  it('should handle single offer array', () => {
    const singleOffer = [mockOffers[0]];
    const result = sortOffers(singleOffer, 'price-low-to-high');

    expect(result).toEqual(singleOffer);
  });

  it('should handle sorting with equal values', () => {
    const offersWithSamePrice = [
      { ...mockOffers[0], price: 150 },
      { ...mockOffers[1], price: 150 },
      { ...mockOffers[2], price: 150 },
    ];
    const result = sortOffers(offersWithSamePrice, 'price-low-to-high');

    expect(result).toHaveLength(3);
    expect(result.every((offer) => offer.price === 150)).toBe(true);
  });
});
