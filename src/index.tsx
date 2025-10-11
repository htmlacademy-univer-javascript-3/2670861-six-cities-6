import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const offers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    image: 'img/apartment-01.jpg',
    ratingPercent: 80,
    isPremium: true,
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'Wood and stone place',
    type: 'Room',
    price: 80,
    image: 'img/room.jpg',
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    price: 132,
    image: 'img/apartment-02.jpg',
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    image: 'img/apartment-03.jpg',
    ratingPercent: 100,
    isPremium: true,
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Wood and stone place',
    type: 'Room',
    price: 80,
    image: 'img/room.jpg',
    ratingPercent: 80,
    isPremium: false,
    isBookmarked: true,
  },
];

root.render(
  <React.StrictMode>
    <App offers={offers} />
  </React.StrictMode>
);
