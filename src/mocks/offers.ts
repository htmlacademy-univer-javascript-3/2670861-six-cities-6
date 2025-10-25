/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';

export const offers: Offer[] = [
  {
    id: uuid(),
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    image: 'img/apartment-01.jpg',
    ratingPercent: 80,
    isPremium: true,
    isBookmarked: false,
  },
  {
    id: uuid(),
    title: 'Wood and stone place',
    type: 'Room',
    price: 80,
    image: 'img/room.jpg',
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: true,
  },
  {
    id: uuid(),
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    price: 132,
    image: 'img/apartment-02.jpg',
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: false,
  },
  {
    id: uuid(),
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    image: 'img/apartment-03.jpg',
    ratingPercent: 100,
    isPremium: true,
    isBookmarked: false,
  },
];
