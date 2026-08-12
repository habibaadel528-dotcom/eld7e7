import { Gift, ArrowRight } from "lucide-react";

export default function LoyaltyCard() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#c53938] via-[#d94747] to-[#ef5350] p-7 text-white shadow-lg">

      {/* Icon */}

      <div className="flex h-[62px] w-[62px] items-center justify-center rounded-2xl bg-white/15 backdrop-blur">

        <Gift size={30} />

      </div>

      {/* Title */}

      <p className="mt-6 text-sm uppercase tracking-[3px] text-white/70">
        Loyalty Program
      </p>

      <h2 className="mt-2 text-[34px] font-bold">
        1,250 Points
      </h2>

      <p className="mt-4 text-[15px] leading-7 text-white/85">
        You're only <strong>250 points</strong> away from your next reward.
      </p>

      {/* Progress */}

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-xs">

          <span>Current</span>

          <span>1500</span>

        </div>

        <div className="h-[10px] overflow-hidden rounded-full bg-white/20">

          <div className="h-full w-[83%] rounded-full bg-white" />

        </div>

      </div>

      {/* Button */}

      <button className="mt-8 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#c53938] transition hover:gap-3 hover:shadow-lg">

        Redeem Rewards

        <ArrowRight size={18} />

      </button>

      {/* Bottom */}

      <div className="mt-10 border-t border-white/20 pt-5">

        <p className="text-sm text-white/80">
          Member since <strong>2023</strong>
        </p>

      </div>

    </section>
  );
}