import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const titleMap = {
  '/account/orders': 'My Orders',
  '/account/wishlist': 'Wishlist',
  '/account/address': 'Address',
  '/account/payments': 'Payments',
  '/account/notifications': 'Notifications',
  '/account/settings': 'Settings',
  '/account/support': 'Support',
};

export default function AccountPlaceholderPage() {
  const location = useLocation();

  const title =
    titleMap[location.pathname] ?? 'Account';

  return (
    <>
      <Helmet>
        <title>{title} | El-D7E7</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-8">
        <h1 className="m-0 text-3xl font-semibold">
          {title}
        </h1>

        <p className="mt-3 text-[var(--secondary-text)]">
          This page will be implemented from the Figma screen you send next.
        </p>
      </section>
    </>
  );
}