"use client"

import React from 'react'
import { Check, Sparkles, Zap, Shield, Globe, Terminal, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const PricingPage = () => {
  const router = useRouter();
  const RAZORPAY_LINK = "https://razorpay.me/@ank09yadav";

  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for exploring the power of AI-driven development.",
      features: [
        "4 Projects Total (Free Forever)",
        "Standard AI generation",
        "Public Sandboxes",
        "Basic Templates access",
        "Community Support"
      ],
      cta: "Start for Free",
      popular: false,
      gradient: "from-blue-500/10 to-transparent"
    },
    {
      name: "Pro",
      price: "99",
      description: "Best for professional developers and small teams.",
      features: [
        "Unlimited Projects",
        "Advanced AI (GPT-4o/Claude 3.5)",
        "Persistent E2B Sandboxes",
        "Premium Templates access",
        "Custom Inngest Workflows",
        "Custom Domain Export"
      ],
      cta: "Upgrade to Pro",
      popular: true,
      gradient: "from-primary/20 via-purple-500/10 to-transparent"
    },
    {
      name: "Enterprise",
      price: "299",
      description: "Custom solutions for large organizations and high-scale apps.",
      features: [
        "Everything in Pro",
        "Dedicated E2B Infrastructure",
        "White-label AI Builder",
        "Private Inngest Clusters",
        "SLA & Premium Security",
        "On-premise deployment"
      ],
      cta: "Upgrade to Enterprise",
      popular: false,
      gradient: "from-amber-500/10 to-transparent"
    }
  ]

  const handlePayment = (planName) => {
    if (planName === "Starter") {
      router.push("/");
      return;
    }
    toast("Redirecting to Razorpay Secure Payment...");
    window.location.href = RAZORPAY_LINK;
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center py-20 px-4">
      {/* Header */}
      <div className="text-center space-y-6 max-w-3xl mb-20">
        <Badge variant="secondary" className="gap-2 px-4 py-1.5 font-bold rounded-full border-primary/20 bg-background/50 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 uppercase tracking-widest text-[10px]">Simple Transparent Pricing</span>
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
          Build more, <span className="text-primary italic">spend less</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Choose the plan that fits your vision. Scale as you grow with FluxiAi.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-[2.5rem] border bg-card/40 backdrop-blur-sm flex flex-col h-full transition-all hover:scale-[1.02] duration-300 ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-border/50'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest">Most Popular</Badge>
              </div>
            )}

            <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-b ${plan.gradient} -z-10`} />

            <div className="space-y-4 mb-8">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price === 'Custom' ? '' : '₹'}</span>
                <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                {plan.price !== 'Custom' && plan.price !== '0' && <span className="text-muted-foreground font-medium">/mo</span>}
              </div>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="space-y-4 flex-1 mb-10">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10 text-primary">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              variant={plan.popular ? "default" : "outline"}
              className={`w-full h-14 rounded-2xl font-bold text-lg ${plan.popular ? 'shadow-lg shadow-primary/20' : 'bg-background/50 hover:bg-muted/50'}`}
              onClick={() => handlePayment(plan.name)}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <section className="w-full max-w-4xl mt-32 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight italic">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-muted-foreground">Everything you need to know about FluxiAi pricing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time. Your Pro status will be maintained until the end of the period." },
            { q: "How many free projects do I get?", a: "Every new user gets 4 free projects to test the power of FluxiAi. After that, you'll need to upgrade to Pro." },
            { q: "What is your payment process?", a: "We use Razorpay for secure payments. After payment, your account will be upgraded to Pro within a few hours (manual verification)." },
            { q: "Can I export my code?", a: "Absolutely. FluxiAi allows you to download the full source code of your projects at any time." }
          ].map((faq, i) => (
            <div key={i} className="p-8 rounded-3xl border border-border/50 bg-card/20 space-y-3">
              <h4 className="font-bold text-lg">{faq.q}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-7xl mt-32 p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-black tracking-tight">Still have questions?</h3>
          <p className="text-muted-foreground text-lg max-w-xl">Our team is here to help you choose the best plan for your needs.</p>
        </div>
        <Button onClick={() => {
          toast("Please wait while we redirect you to your email client")
          const subject = encodeURIComponent("Pricing Question");
          const emailId = "ankur.appdev@gmail.com"
          window.location.href = `mailto:${emailId}?subject=${subject}`;
        }} size="xl" className="rounded-full h-16 px-12 text-lg font-bold group">
          Contact Support <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </section>
    </div>
  )
}

export default PricingPage
