'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, GraduationCap, Users, Award, Zap, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    (<div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <HeroSection />
        <FeaturesSection />
        <ProgramsSection />
        <WhyChooseUsSection />
        <CommunitySection />
      </main>
    </div>)
  );
}

function HeroSection() {
  return (
    (<section className="text-center mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Badge variant="secondary" className="mb-4">Revolutionizing Medical Education</Badge>
      </motion.div>
      <motion.h1
        className="text-5xl font-extrabold text-teal-600 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        Welcome to <span
        className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">MedSpace</span>
      </motion.h1>
      <motion.p
        className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}>
        Empowering the next generation of healthcare professionals through cutting-edge technology and innovative learning experiences.
      </motion.p>
      <motion.div
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}>
        <Button className="bg-teal-600 hover:bg-teal-700">Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </motion.div>
    </section>)
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-teal-600" />,
      title: "Interactive Courses",
      description: "Engage with our cutting-edge interactive medical courses designed to enhance your learning experience."
    },
    {
      icon: <Users className="h-10 w-10 text-teal-600" />,
      title: "Expert Instructors",
      description: "Learn from leading professionals in the medical field, bringing real-world expertise to your education."
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-teal-600" />,
      title: "Certified Programs",
      description: "Earn recognized certifications to advance your career in the healthcare industry."
    }
  ]

  return (
    (<section className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>
    </section>)
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    (<Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>)
  );
}

function ProgramsSection() {
  const programs = [
    {
      title: "Medical Imaging Fundamentals",
      description: "Master the basics of medical imaging techniques and interpretation.",
      duration: "8 weeks",
      price: "$499"
    },
    {
      title: "Advanced Clinical Research",
      description: "Dive deep into clinical research methodologies and practices.",
      duration: "12 weeks",
      price: "$699"
    },
    {
      title: "Healthcare Management Essentials",
      description: "Develop key skills for managing healthcare organizations effectively.",
      duration: "10 weeks",
      price: "$599"
    }
  ]

  return (
    (<section className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-10">Featured Programs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <ProgramCard {...program} />
          </motion.div>
        ))}
      </div>
    </section>)
  );
}

function ProgramCard({ title, description, duration, price }) {
  return (
    (<Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <p className="text-sm text-muted-foreground mb-2">Duration: {duration}</p>
        <p className="text-lg font-bold text-teal-600">{price}</p>
        <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-4">Enroll Now</Button>
      </CardContent>
    </Card>)
  );
}

function WhyChooseUsSection() {
  const reasons = [
    {
      icon: <Award className="h-8 w-8 text-teal-600" />,
      title: "Accredited Programs",
      description: "Our programs are accredited by leading medical institutions, ensuring the highest quality education."
    },
    {
      icon: <Zap className="h-8 w-8 text-teal-600" />,
      title: "Cutting-edge Technology",
      description: "Experience learning through state-of-the-art simulations and interactive content."
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-600" />,
      title: "Global Community",
      description: "Connect with a diverse community of medical professionals and students from around the world."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      title: "Lifelong Learning",
      description: "Access to continuous professional development resources to keep your skills up-to-date."
    }
  ]

  return (
    (<section className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-10">Why Choose MedSpace?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <WhyChooseUsCard {...reason} />
          </motion.div>
        ))}
      </div>
    </section>)
  );
}

function WhyChooseUsCard({ icon, title, description }) {
  return (
    (<Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>)
  );
}

function CommunitySection() {
  return (
    (<section
      className="text-center bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Connect with peers, share knowledge, and stay updated with the latest in medical education.
        </p>
        <Button className="bg-white text-teal-600 hover:bg-teal-100">
          Join Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </section>)
  );
}

