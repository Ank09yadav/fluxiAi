import Image from 'next/image'
import React from 'react'
import ProjectForm from '@/modules/home/components/project-form'
import ProjectList from '@/modules/home/components/project-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingCart, Tv, TrendingUp, ExternalLink, Sparkles, FolderOpen, History, Zap, Shield, Globe, Terminal, Code2, ArrowRight, MousePointer2, Laptop } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { templates } from '@/modules/templates/config'

const getIcon = (id) => {
  switch (id) {
    case 'e-commerce': return <ShoppingCart />;
    case 'netflix-clone': return <Tv />;
    case 'trading-dashboard': return <TrendingUp />;
    case 'saas-landing-page': return <Laptop />;
    default: return <Laptop />;
  }
};

const Page = () => {
  return (
    <div className='w-full min-h-[calc(100vh-5rem)] flex flex-col items-center'>
      
      {/* --- GUEST LANDING VIEW (SIGNED OUT) --- */}
      <SignedOut>
        <div className='w-full max-w-[1400px] px-4 md:px-8 py-12 md:py-24 flex flex-col items-center space-y-24'>
          
          {/* Hero Section */}
          <section className='w-full flex flex-col items-center text-center space-y-10'>
            <div className='flex flex-col items-center relative'>
              <div className="absolute -top-10 -z-10 bg-primary/20 blur-3xl w-60 h-60 rounded-full animate-pulse" />
              <Badge variant="secondary" className="gap-2 px-4 py-1.5 font-bold rounded-full border-primary/20 bg-background/50 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 uppercase tracking-widest text-[10px]">The Future of Development</span>
              </Badge>
            </div>

            <div className="space-y-6 max-w-5xl">
              <h1 className='text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] md:leading-[0.85]'>
                bring your <span className="text-primary italic">vision</span> <br />
                to life with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-indigo-600">pure ai</span>
              </h1>
              <p className='text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed'>
                FluxiAi is the high-performance AI engineer for the next generation of builders. 
                Build production-ready apps from a single prompt.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <SignInButton>
                  <Button size="xl" className="rounded-full shadow-2xl h-16 px-12 text-lg font-bold transition-all hover:scale-105 active:scale-95 group">
                    Start Building Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
                <Button variant="outline" size="xl" className="rounded-full h-16 px-12 text-lg font-bold bg-background/50 backdrop-blur-md border-border/50 hover:bg-muted/50" asChild>
                  <Link href="/templates">Explore Marketplace</Link>
                </Button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
              {[
                { title: "Autonomous Coding", desc: "Our AI writes complex Next.js code including state, effects, and logic.", icon: <Code2 />, color: "bg-blue-500/10 text-blue-500" },
                { title: "Live Sandboxes", desc: "Every project runs in an isolated, secure E2B container automatically.", icon: <Shield />, color: "bg-purple-500/10 text-purple-500" },
                { title: "Instant Previews", desc: "See your app come to life in real-time with hot-reloading previews.", icon: <Zap />, color: "bg-amber-500/10 text-amber-500" }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] border bg-card/40 backdrop-blur-sm space-y-5 hover:border-primary/40 transition-all group text-left">
                    <div className={`p-4 rounded-2xl w-fit ${feature.color} group-hover:scale-110 transition-transform`}>{feature.icon}</div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Templates Showcase */}
          <section className='w-full pt-12 space-y-16'>
            <div className='flex flex-col md:flex-row items-end justify-between gap-6'>
              <div className="space-y-4">
               <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold tracking-widest px-3 py-1">Ready to Deploy</Badge>
               <h2 className='text-4xl md:text-6xl font-extrabold tracking-tight italic'>Ready templates <span className="text-muted-foreground/40 font-normal">for you</span> 🎨</h2>
              </div>
              <Button variant="ghost" className="hover:text-primary transition-colors group px-8 h-14 rounded-full border border-border/50" asChild>
                <Link href={"/templates"} className='flex items-center gap-2 font-bold'>
                  View the full gallery <ExternalLink className='w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
                </Link>
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {templates.slice(0, 4).map((tmpl, i) => (
                <Link href={`/templates/${tmpl.id}`} key={i} className='group relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 bg-card'>
                  <img src={tmpl.previewImg} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-100' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-10'>
                    <div className="flex items-center gap-3 mb-4">
                       <Badge className="bg-white/10 backdrop-blur-md text-white border-none text-[10px] uppercase font-bold">{tmpl.tags[0]}</Badge>
                       <div className="h-px flex-1 bg-white/20" />
                    </div>
                    <div className='flex items-end justify-between'>
                       <div className='space-y-2'>
                          <h3 className='text-white font-bold text-3xl group-hover:text-primary transition-colors'>{tmpl.title}</h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors line-clamp-1">{tmpl.description}</p>
                       </div>
                       <div className='p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white shadow-xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12'>
                         {getIcon(tmpl.id)}
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Call to Action Footer */}
          <section className="w-full py-20 px-8 rounded-[4rem] bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 flex flex-col items-center text-center space-y-8">
             <h3 className="text-3xl md:text-5xl font-black tracking-tight">Ready to build your masterpiece?</h3>
             <p className="text-muted-foreground text-lg max-w-xl">Join thousands of developers building the future with FluxiAi.</p>
             <SignInButton>
                <Button size="xl" className="rounded-full h-16 px-16 text-lg font-bold">Get Started Now</Button>
             </SignInButton>
          </section>
        </div>
      </SignedOut>

      {/* --- AUTHENTICATED DASHBOARD VIEW (SIGNED IN) --- */}
      <SignedIn>
        <div className='w-full max-w-[1700px] px-4 md:px-8 py-8 h-full'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-12'>
            
            {/* Main Builder Area */}
            <div className='lg:col-span-12 xl:col-span-9 flex flex-col items-center space-y-12'>
              
              <section className='w-full space-y-8 flex flex-col'>
                <div className='flex items-center justify-between'>
                  <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 uppercase italic leading-none">
                      Fluxi <span className="text-primary">Studio</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Describe your vision and watch the AI engineer build it.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-bold rounded-lg h-fit bg-primary/10 text-primary border-none">
                      <Zap className="w-3 h-3 fill-primary" /> Active Sandbox
                    </Badge>
                  </div>
                </div>

                <div className='w-full relative'>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2.5rem] blur opacity-25 transition duration-1000" />
                  <div className="relative">
                    <ProjectForm />
                  </div>
                </div>

                {/* Helpful Hints for Builder */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                   {[
                     { title: "Be Specific", desc: "Include features, colors, and layout styles for better results.", icon: <MousePointer2 className="w-4 h-4" /> },
                     { title: "Iterative Build", desc: "You can refine the code with follow-up prompts anytime.", icon: <Terminal className="w-4 h-4" /> },
                     { title: "Instant Sync", desc: "Your live preview updates instantly with every AI edit.", icon: <Zap className="w-4 h-4" /> }
                   ].map((hint, i) => (
                     <div key={i} className="flex gap-4 p-5 rounded-2xl bg-card/40 border border-border/50 transition-colors">
                        <div className="p-2.5 h-fit bg-primary/10 rounded-xl text-primary">{hint.icon}</div>
                        <div className="space-y-1">
                           <h4 className="font-bold text-sm">{hint.title}</h4>
                           <p className="text-xs text-muted-foreground leading-relaxed">{hint.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </section>

              {/* Mobile Project History */}
              <div className="lg:hidden w-full border-t border-border/50 pt-12">
                <div className="flex items-center gap-2 mb-6">
                    <History className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Recent Projects</h2>
                </div>
                <ProjectList />
              </div>
            </div>

            {/* Sidebar for Projects (Desktop) */}
            <aside className='hidden lg:flex xl:col-span-3 lg:col-span-4 flex-col gap-6 sticky top-24 h-[calc(100vh-8rem)]'>
              <div className="flex items-center gap-2 pb-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Projects</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4">
                <ProjectList sidebar />
              </div>

              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 space-y-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                    <Sparkles className="w-20 h-20" />
                 </div>
                 <h3 className="font-bold flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-primary" /> Pro Tips
                 </h3>
                 <p className="text-xs text-muted-foreground leading-relaxed">Try saying &quot;Make it dark mode with glassmorphism&quot; for instant premium effects.</p>
                 <Button variant="secondary" className="w-full h-11 rounded-xl text-xs font-bold shadow-sm" asChild>
                    <Link href="/docs">Read Guide</Link>
                 </Button>
              </div>
            </aside>

          </div>
        </div>
      </SignedIn>

    </div>
  )
}

export default Page


