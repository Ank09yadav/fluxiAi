"use client"

import React from 'react'
import { Shield, Lock, Eye, FileText, Globe, Scale } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const PrivacyPage = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="w-5 h-5" />,
      content: "We collect information you provide directly to us, such as when you create an account, use our AI generation services, or communicate with us. This may include your name, email address, payment information, and the prompts you provide to our AI models."
    },
    {
      title: "How We Use Your Data",
      icon: <FileText className="w-5 h-5" />,
      content: "We use the information we collect to provide, maintain, and improve our services. This includes processing your AI generation requests, personalizing your experience, and protecting our platform from fraud or abuse."
    },
    {
      title: "AI Model Training",
      icon: <Shield className="w-5 h-5" />,
      content: "By default, we do not use your private project data or proprietary prompts to train our public AI models. For Enterprise customers, we offer additional guarantees and the ability to train custom, isolated models on your specific codebase."
    },
    {
      title: "Data Security",
      icon: <Lock className="w-5 h-5" />,
      content: "We implement industry-standard security measures to protect your personal information. This includes encryption at rest and in transit, regular security audits, and strict access controls for our internal systems."
    },
    {
      title: "International Transfers",
      icon: <Globe className="w-5 h-5" />,
      content: "Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws through standard contractual clauses and other legal mechanisms."
    },
    {
      title: "Your Rights",
      icon: <Scale className="w-5 h-5" />,
      content: "Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information. You can exercise these rights through your account settings or by contacting our support team."
    }
  ]

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center py-24 px-4">
      <div className="max-w-4xl w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="gap-2 px-4 py-1.5 font-bold rounded-full border-primary/20 bg-background/50 backdrop-blur-md uppercase tracking-widest text-[10px]">
            Legal Center
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Privacy <span className="text-primary">Policy</span></h1>
          <p className="text-muted-foreground font-medium text-lg">Last updated: April 23, 2026</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed text-center italic">
              At FluxiAi, we believe in radical transparency. Your privacy is not just a policy; it's a fundamental design principle of our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] border border-border/50 bg-card/30 space-y-6 hover:border-primary/30 transition-all duration-500">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary w-fit">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-bold">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="p-12 rounded-[3rem] bg-muted/30 border border-border/40 text-center space-y-6">
            <h3 className="text-2xl font-bold">Have questions about your privacy?</h3>
            <p className="text-muted-foreground">Our legal team is available to discuss any concerns you may have regarding your data.</p>
            <a href="mailto:ankur.appdev@gmail.com" className="inline-block text-primary font-bold hover:underline">ankur.appdev@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
