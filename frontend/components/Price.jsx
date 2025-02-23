import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const tiers = [
  {
    name: "Basic",
    price: "1.99",
    description: "Perfect for getting started",
    features: ["10 daily prompts", "Basic summaries", "Standard response time", "Email support"],
    featured: false,
  },
  {
    name: "Pro",
    price: "5.99",
    description: "Most popular for professionals",
    features: [
      "25 + daily prompts ",
      "Advanced summaries & insights",
      "Priority response time",
      "24/7 priority support",
      "Custom AI fine-tuning",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "12.99",
    description: "For teams and organizations",
    features: [
      "Unlimited audio processing",
      "Advanced analytics & reporting",
      "Real-time processing",
      "Dedicated support team",
      "Custom AI models",
    ],
    featured: false,
  },
]

export default function PricingCards() {
  return (
    <div className="relative w-full bg-black py-20 px-4">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative group rounded-xl backdrop-blur-sm ${
                tier.featured ? "border border-blue-500/50 bg-black/60" : "border border-white/10 bg-black/40"
              }`}
            >
              {/* Chromatic aberration effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-transparent via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card content */}
              <div className="relative p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                  <p className="text-sm text-white/60">{tier.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="ml-2 text-white/60">/month</span>
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-6 text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                    tier.featured
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Get Started
                </Button>
              </div>

              {/* Highlight for featured tier */}
              {tier.featured && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <div className="px-4 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">Most Popular</div>
                </div>
              )}

              {/* Glow effect on hover */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}