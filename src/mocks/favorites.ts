/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';

export const favorites: FavoriteOffer[] = [
  {
    id: uuid(),
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    image: 'img/apartment-small-03.jpg',
    ratingPercent: 100,
    isPremium: true,
    city: 'Amsterdam',
    latitude: 52.3909553943508,
    longitude: 4.85309666406198,
  },
  {
    id: uuid(),
    title: 'Wood and stone place',
    type: 'Room',
    price: 80,
    image: 'img/room-small.jpg',
    ratingPercent: 80,
    isPremium: false,
    city: 'Amsterdam',
    latitude: 52.3609553943508,
    longitude: 4.85309666406198,
  },
  {
    id: uuid(),
    title: 'White castle',
    type: 'Apartment',
    price: 180,
    image: 'img/apartment-small-04.jpg',
    ratingPercent: 100,
    isPremium: false,
    city: 'Cologne',
    latitude: 52.3909553943508,
    longitude: 4.929309666406198,
  },
];
