import { Helmet } from 'react-helmet-async';

import WishlistToolbar from '../../components/dashboard/wishlist/WishlistToolbar';
import WishlistGrid from '../../components/dashboard/wishlist/WishlistGrid';
import { wishlistProducts } from '../../data/wishlistProducts';

export default function Wishlist() {
  return (
    <>
      <Helmet>
        <title>My Wishlist | El-D7E7</title>

        <meta
          name="description"
          content="Manage your saved products."
        />
      </Helmet>

      <section className="space-y-7">

        <WishlistToolbar totalItems={wishlistProducts.length} />

        <WishlistGrid />

      </section>
    </>
  );
}