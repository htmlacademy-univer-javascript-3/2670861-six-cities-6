import OfferCard from '@/components/offer-card';
import { memo } from 'react';

type Props = {
  offers: Offer[];
  handleSetActiveOffer: (offer: Offer | null) => void;
};

function OffersList({ offers, handleSetActiveOffer }: Props): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard
          offer={offer}
          handleSetActiveOffer={handleSetActiveOffer}
          key={offer.id}
        />
      ))}
    </div>
  );
}

const MemoisedOffersList = memo(OffersList);

export default MemoisedOffersList;
