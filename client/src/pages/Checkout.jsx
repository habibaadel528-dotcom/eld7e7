import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, CreditCard, Wallet, Check } from 'lucide-react';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

import { useCart } from '../context/CartContext';

import chevronRightIcon from '../assets/icons/cart/chevron-right.svg';
import visaIcon from '../assets/icons/visa.svg';
import mastercardIcon from '../assets/icons/mastercard.svg';
import paymobIcon from '../assets/icons/paymob.png';

const paymentMethods = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Truck,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa & Mastercard accepted',
    icon: CreditCard,
  },
  {
    id: 'paymob',
    label: 'Paymob Wallet',
    description: 'Pay with your mobile wallet',
    icon: Wallet,
  },
];

function FormField({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--secondary-text)]">
        {label}
      </span>

      <input
        {...inputProps}
        className="h-12 w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 text-sm text-[var(--primary-text)] outline-none transition placeholder:text-[var(--muted-text)] focus:border-[#c53938]"
      />
    </label>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal } = useCart();

  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const discountRate = 0.05;
  const deliveryFee = 50;
  const discount = subtotal * discountRate;
  const total = subtotal - discount + deliveryFee;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    }

    if (!formData.address.trim()) {
      nextErrors.address = 'Address is required.';
    }

    if (!formData.city.trim()) {
      nextErrors.city = 'City is required.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    if (!validate()) {
      return;
    }

    const orderNumber = `D7E7-${Math.floor(100000 + Math.random() * 900000)}`;

    navigate('/order-success', {
      state: {
        orderNumber,
        total,
        fullName: formData.fullName,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--primary-text)]">
      <Helmet>
        <title>Checkout | El-D7E7</title>

        <meta
          name="description"
          content="Confirm your delivery details and payment method to place your order."
        />

        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardHeader />

      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-0">
        <DashboardSidebar />

        <main className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-3 text-base"
          >
            <Link
              to="/"
              className="text-[var(--secondary-text)] transition hover:text-[#c53938]"
            >
              Home
            </Link>

            <img
              src={chevronRightIcon}
              alt=""
              width="16"
              height="16"
              className="h-4 w-4 object-contain"
            />

            <Link
              to="/cart"
              className="text-[var(--secondary-text)] transition hover:text-[#c53938]"
            >
              Cart
            </Link>

            <img
              src={chevronRightIcon}
              alt=""
              width="16"
              height="16"
              className="h-4 w-4 object-contain"
            />

            <span aria-current="page">Checkout</span>
          </nav>

          <h1 className="mb-0 mt-4 text-[40px] font-bold leading-tight text-[var(--primary-text)]">
            Checkout
          </h1>

          <form
            onSubmit={handlePlaceOrder}
            className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
          >
            {/* Left column */}
            <div className="space-y-6">
              {/* Delivery address */}
              <section className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
                  Delivery Address
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Eman Mohamed"
                    autoComplete="name"
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    autoComplete="tel"
                  />

                  <div className="sm:col-span-2">
                    <FormField
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street name, building, floor, apartment"
                      autoComplete="street-address"
                    />
                  </div>

                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Cairo"
                    autoComplete="address-level2"
                  />

                  <FormField
                    label="Notes (optional)"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Delivery instructions"
                  />
                </div>

                {(errors.fullName || errors.phone || errors.address || errors.city) && (
                  <p className="mt-4 text-sm text-[#c53938]">
                    Please fill in all required fields marked above.
                  </p>
                )}
              </section>

              {/* Payment method */}
              <section className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
                  Payment Method
                </h2>

                <div className="mt-5 space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition ${
                          isSelected
                            ? 'border-[#c53938] bg-[#c53938]/5'
                            : 'border-[var(--border-color)] hover:border-[#c53938]/50'
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                            isSelected
                              ? 'bg-[#c53938] text-white'
                              : 'bg-[var(--surface-soft)] text-[var(--secondary-text)]'
                          }`}
                        >
                          <Icon size={20} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[var(--primary-text)]">
                            {method.label}
                          </span>

                          <span className="block text-xs text-[var(--muted-text)]">
                            {method.description}
                          </span>
                        </span>

                        {method.id === 'card' && (
                          <span className="hidden shrink-0 items-center gap-2 sm:flex">
                            <img src={visaIcon} alt="" className="h-5 w-auto object-contain" />
                            <img src={mastercardIcon} alt="" className="h-5 w-auto object-contain" />
                          </span>
                        )}

                        {method.id === 'paymob' && (
                          <img
                            src={paymobIcon}
                            alt=""
                            className="hidden h-5 w-auto object-contain sm:block"
                          />
                        )}

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? 'border-[#c53938] bg-[#c53938]'
                              : 'border-[var(--border-color)]'
                          }`}
                        >
                          {isSelected && <Check size={12} color="#fff" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Order items recap */}
              <section className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6">
                <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
                  Order Items ({cartItems.length})
                </h2>

                <div className="mt-5 divide-y divide-[var(--border-color)]">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-soft)]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-sm font-medium text-[var(--primary-text)]">
                          {item.name}
                        </p>

                        <p className="m-0 text-xs text-[var(--muted-text)]">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="m-0 shrink-0 text-sm font-semibold text-[var(--primary-text)]">
                        EGP {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {cartItems.length === 0 && (
                    <p className="py-4 text-sm text-[var(--muted-text)]">
                      Your cart is empty.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right column - summary */}
            <aside className="h-fit rounded-[20px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 lg:sticky lg:top-8">
              <h2 className="m-0 text-xl font-bold text-[var(--primary-text)]">
                Order Summary
              </h2>

              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-[var(--secondary-text)]">
                    Subtotal
                  </dt>
                  <dd className="m-0 text-sm text-[var(--primary-text)]">
                    EGP {subtotal.toFixed(2)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-[var(--secondary-text)]">
                    Discount (-{discountRate * 100}%)
                  </dt>
                  <dd className="m-0 text-sm text-[#359a03]">
                    -EGP {discount.toFixed(2)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-[var(--secondary-text)]">
                    Delivery Fee
                  </dt>
                  <dd className="m-0 text-sm font-medium text-[var(--primary-text)]">
                    EGP {deliveryFee.toFixed(2)}
                  </dd>
                </div>

                <div className="h-px bg-[var(--border-color)]" />

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-base font-semibold text-[var(--primary-text)]">
                    Total
                  </dt>
                  <dd className="m-0 text-xl font-bold text-[var(--primary-text)]">
                    EGP {total.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full bg-[#c94545] text-base font-bold text-white transition hover:bg-[#ef5350] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Place Order
              </button>

              <Link
                to="/cart"
                className="mt-3 block text-center text-sm text-[var(--secondary-text)] transition hover:text-[#c53938]"
              >
                Back to Cart
              </Link>
            </aside>
          </form>
        </main>
      </div>
    </div>
  );
}