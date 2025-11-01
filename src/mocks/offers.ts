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
    latitude: 52.3909553943508,
    longitude: 4.85309666406198,
    reviews: [
      {
        id: uuid(),
        user: {
          name: 'Max',
          avatar: 'img/avatar-max.jpg',
        },
        rating: 4,
        comment:
          'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
        date: '2019-04-24',
      },
    ],
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
    latitude: 52.3609553943508,
    longitude: 4.85309666406198,
    reviews: [
      {
        id: uuid(),
        user: {
          name: 'Angelina',
          avatar: 'img/avatar-angelina.jpg',
        },
        rating: 5,
        comment:
          'An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.',
        date: '2019-05-15',
      },
    ],
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
    latitude: 52.3909553943508,
    longitude: 4.929309666406198,
    reviews: [],
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
    latitude: 52.3809553943508,
    longitude: 4.939309666406198,
    reviews: [
      {
        id: uuid(),
        user: {
          name: 'Max',
          avatar: 'img/avatar-max.jpg',
        },
        rating: 5,
        comment:
          'The apartment is perfect for a family vacation. Clean, comfortable and very spacious.',
        date: '2019-06-10',
      },
      {
        id: uuid(),
        user: {
          name: 'Angelina',
          avatar: 'img/avatar-angelina.jpg',
        },
        rating: 4,
        comment:
          'Great location and beautiful view. The host was very helpful and responsive.',
        date: '2019-07-02',
      },
    ],
  },
];
