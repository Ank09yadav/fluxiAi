import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Instagram, Phone, Mail, Sparkles, Code2, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-card/30 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-black tracking-tighter">Fluxi<span className="text-primary italic">Ai</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The next generation of AI-powered software development. Build, preview, and ship at the speed of thought.
            </p>
            <div className="flex gap-4 pt-2">
               <a href="https://github.com/Ank09yadav" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
               </a>
               <a href="https://linkedin.com/in/ank09yadav" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
               </a>
               <a href="https://instagram.com/ank09yadav" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">AI Builder</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Developer Contact */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
               <div className="space-y-4">
                   <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Core Developers</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500" />
                         <div>
                            <p className="text-sm font-bold">Ankur Yadav</p>
                            <p className="text-[10px] text-muted-foreground">Full stack Developer</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                         <div>
                            <p className="text-sm font-bold">Taufique Umar</p>
                            <p className="text-[10px] text-muted-foreground">Full stack Developer </p>
                         </div>
                      </div>
                   </div>
               </div>

               <div className="space-y-4">
                   <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Contact Details</h4>
                   <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>+91 9452087100</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>ankury114112118@gmail.com</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" />
                        <span>Prayagraj,Uttar Pradesh, India</span>
                      </li>
                   </ul>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FluxiAi. Designed with <Heart className="inline size-3 text-red-500 fill-red-500" /> by Ankur Yadav.
          </p>
          <div className="flex items-center gap-6">
             <Link href="/terms" className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">Terms</Link>
             <Link href="/privacy" className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
