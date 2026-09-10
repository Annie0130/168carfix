import { CUSTOMER_STEPS } from "@/lib/board";

export default function StepperProgress({ currentIndex }) {
  return (
    <div className="flex items-center">
      {CUSTOMER_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : done
                    ? "bg-steel border-steel text-white"
                    : "bg-white border-line text-ink/30"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[11px] mt-1 ${active ? "text-orange-600 font-medium" : "text-ink/40"}`}>
                {step}
              </span>
            </div>
            {i < CUSTOMER_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-steel" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
