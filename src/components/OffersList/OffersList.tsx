import OfferCard from '@components/OfferCard';
import { useState } from 'react';

type Props = {
  offers: Offer[];
};

function OffersList({ offers }: Props): JSX.Element {
  const [, setActiveOffer] = useState<Offer | null>(null);

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard
          offer={offer}
          setActiveOffer={setActiveOffer}
          key={offer.id}
        />
      ))}
    </div>
  );
}

export default OffersList;
