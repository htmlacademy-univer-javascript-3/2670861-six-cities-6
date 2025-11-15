import OfferCard from '@/components/offer-card';

type Props = {
  offers: Offer[];
  setActiveOffer: (offer: Offer | null) => void;
};

function OffersList({ offers, setActiveOffer }: Props): JSX.Element {
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
