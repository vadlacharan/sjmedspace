'use client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, BookOpen } from 'lucide-react'

export default function Programs() {
  const programs = [
    { 
      title: "Medical Imaging Fundamentals", 
      description: "Learn the basics of medical imaging techniques and interpretation.",
      duration: "8 weeks",
      price: "$499",
      level: "Beginner"
    },
    { 
      title: "Advanced Clinical Research", 
      description: "Dive deep into clinical research methodologies and practices.",
      duration: "12 weeks",
      price: "$699",
      level: "Advanced"
    },
    { 
      title: "Healthcare Management Essentials", 
      description: "Develop key skills for managing healthcare organizations effectively.",
      duration: "10 weeks",
      price: "$599",
      level: "Intermediate"
    },
    { 
      title: "Emergency Medicine Practices", 
      description: "Master the latest techniques and protocols in emergency medical care.",
      duration: "6 weeks",
      price: "$449",
      level: "Intermediate"
    },
    { 
      title: "Bioethics in Modern Medicine", 
      description: "Explore ethical considerations in contemporary medical practices.",
      duration: "8 weeks",
      price: "$399",
      level: "All Levels"
    },
    { 
      title: "Digital Health Technologies", 
      description: "Understand and implement cutting-edge digital health solutions.",
      duration: "10 weeks",
      price: "$649",
      level: "Intermediate"
    },
  ]

  return (
    (<div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-4xl font-bold text-teal-600 mb-8">Our Programs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                  <Badge variant="secondary">{program.level}</Badge>
                </div>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Duration: {program.duration}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground ">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Price: {program.price}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>)
  );
}

