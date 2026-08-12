import OrderRow from "./OrderRow";

export default function RecentOrders() {
  return (
    <section className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-bg)] p-7 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--primary-text)]">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            Your latest purchases
          </p>
        </div>

        <button className="rounded-full border border-[var(--border-color)] px-5 py-2 text-sm font-medium text-[var(--secondary-text)] transition hover:border-[#c53938] hover:text-[#c53938]">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="text-left text-[13px] uppercase tracking-wide text-[var(--secondary-text)]">
              <th>Product</th>
              <th>Status</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <OrderRow
              image="order-headphones.png"
              title="Sony WH-1000XM5"
              status="Delivered"
              price="$320"
            />
            <OrderRow
              image="order-watch.png"
              title="Apple Watch Series 9"
              status="Processing"
              price="$550"
            />
            <OrderRow
              image="order-camera.png"
              title="Canon EOS R50"
              status="Pending"
              price="$899"
            />
          </tbody>
        </table>
      </div>

    </section>
  );
}