import NearbyOfferCard from '@components/NearbyOfferCard';

type Props = {
  offers: Offer[];
};

function NearbyOffersList({ offers }: Props): JSX.Element {
  return (
    <div className="near-places__list places__list">
      {offers.map((offer) => (
        <NearbyOfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

export default NearbyOffersList;
