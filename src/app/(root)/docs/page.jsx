"use client"

import React from 'react'
import { Book, Code, Zap, Shield, Rocket, Terminal, Settings, Globe, Search, ArrowRight, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const DocsPage = () => {
  const categories = [
    {
      title: "Getting Started",
      icon: <Rocket className="w-5 h-5 text-blue-500" />,
      items: ["Introduction", "Quick Start Guide", "Architecture Overview", "Installation"]
    },
    {
      title: "Core Concepts",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      items: ["AI Generation", "Project Structure", "Sandbox Environments", "Live Previews"]
    },
    {
      title: "API Reference",
      icon: <Terminal className="w-5 h-5 text-purple-500" />,
      items: ["Authentication", "Endpoints", "Webhooks", "Rate Limits"]
    },
    {
      title: "Advanced",
      icon: <Settings className="w-5 h-5 text-emerald-500" />,
      items: ["Custom Templates", "CI/CD Integration", "Enterprise Security", "Team Collaboration"]
    }
  ]

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/40">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="gap-2 px-4 py-1.5 font-bold rounded-full border-primary/20 bg-background/50 backdrop-blur-md uppercase tracking-widest text-[10px]">
            FluxiAi Documentation
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85]">
            Knowledge <span className="text-primary italic">Base</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl">
            Everything you need to build, deploy, and scale with the world's most advanced AI engineer.
          </p>
          
          <div className="w-full max-w-2xl relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="w-full h-16 pl-16 pr-8 rounded-3xl bg-card/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
            />
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-10 sticky top-24 h-fit">
          {categories.map((cat, i) => (cat.title === "Getting Started" && (
            <div key={i} className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary/60">{cat.title}</h4>
              <ul className="space-y-1">
                {cat.items.map((item, j) => (
                  <li key={j}>
                    <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${j === 0 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )))}

          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 space-y-4">
            <h5 className="font-bold text-sm">Need help?</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">Our community is here to support you in every step.</p>
            <Button size="sm" variant="secondary" className="w-full rounded-xl font-bold">Join Discord</Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-20">
          {/* Section: Introduction */}
          <article className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Introduction</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                FluxiAi is a revolutionary platform that leverages large language models to automate the entire software development lifecycle. 
                From ideation to deployment, FluxiAi acts as your autonomous technical partner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Autonomous Engineering", desc: "AI that doesn't just suggest, but actually builds and refactors code.", icon: <Shield className="text-blue-500" /> },
                { title: "Real-time Iteration", desc: "Instant visual feedback as you chat with the AI about your design.", icon: <Zap className="text-amber-500" /> },
                { title: "Enterprise Grade", desc: "Secure sandboxes, isolated environments, and production-ready code.", icon: <Shield className="text-purple-500" /> },
                { title: "Scalable Architecture", desc: "Built on Next.js 15, React 19, and Tailwind CSS 4 for maximum performance.", icon: <Globe className="text-emerald-500" /> }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[2rem] border border-border/50 bg-card/20 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="p-3 rounded-2xl bg-background/50 w-fit border border-border/30">{feature.icon}</div>
                  <h4 className="text-xl font-bold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Section: Categories Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] border border-border/50 bg-card/40 hover:border-primary/40 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-background border border-border/40 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">{cat.title}</h3>
                </div>
                <ul className="space-y-4 mb-8">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-primary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Explore {cat.title} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Call to Action Documentation */}
          <div className="p-12 md:p-16 rounded-[3.5rem]  from-primary to-indigo-700 text-white space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                <Terminal className="w-64 h-64" />
             </div>
             <div className="relative z-10 space-y-6">
                <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none">Ready to start <br />developing?</h3>
                <p className="text-white/80 text-lg max-w-xl font-medium">Follow our quick start guide to get your first AI-generated app running in less than 60 seconds.</p>
                <Button size="xl" className="bg-white text-primary hover:bg-white/90 rounded-full h-16 px-12 text-lg font-bold">Get Started Now</Button>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DocsPage
