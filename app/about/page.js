import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "About - SJMedSpace",
  description: "Learn about SJMedSpace and our mission to advance USMLE knowledge",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">About SJMedSpace</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Dedicated to advancing USMLE education and research through collaborative knowledge sharing.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[450px] w-full overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=450&width=600"
                  alt="SJMedSpace team"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SJMedSpace is dedicated to creating a collaborative platform for medical professionals and students to
                share and access cutting-edge USMLE-focused research and educational resources.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Excellence in Education</h3>
                <p className="text-muted-foreground">
                  Providing high-quality, evidence-based educational resources for USMLE preparation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                    <path d="M12 13v8" />
                    <path d="M5 13v6a2 2 0 0 0 2 2h8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Research Innovation</h3>
                <p className="text-muted-foreground">
                  Advancing medical education through innovative research methodologies and findings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Community Collaboration</h3>
                <p className="text-muted-foreground">
                  Building a supportive community of medical professionals and students to share knowledge and
                  experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Dr. Sailaja Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex items-center justify-center">
              <div className="relative h-[450px] w-full overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=450&width=600"
                  alt="Dr. Sailaja Sanikommu"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Dr. Sailaja Sanikommu</h2>
                <p className="text-xl text-muted-foreground">Founder & CEO</p>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Dr. Sailaja Sanikommu is a distinguished medical educator and researcher with over 15 years of
                  experience in USMLE preparation and medical education. As the founder and CEO of SJMedSpace, she has
                  dedicated her career to improving how medical students prepare for their licensing examinations.
                </p>
                <p>
                  With a background in both clinical medicine and educational research, Dr. Sanikommu has developed
                  innovative methodologies that have helped thousands of students achieve success in their USMLE
                  examinations. Her approach combines evidence-based learning techniques with practical clinical
                  applications.
                </p>
                <p>
                  Dr. Sanikommu continues to lead research initiatives focused on improving medical education
                  methodologies and creating accessible resources for students worldwide. Her work has been recognized
                  in numerous medical education conferences and publications.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="https://www.researchgate.net/profile/Sailaja-Sanikommu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-1.5">
                    ResearchGate Profile
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/publications?author=dr-sailaja-sanikommu">
                  <Button variant="ghost">View Publications</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Team</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Meet the dedicated professionals behind SJMedSpace who are committed to advancing medical education.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. John Smith",
                role: "Research Director",
                bio: "Specializes in USMLE Step 1 preparation strategies and basic science integration.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Dr. Emily Johnson",
                role: "Educational Content Lead",
                bio: "Expert in clinical case development and USMLE Step 2 CK preparation.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Dr. Michael Chen",
                role: "Clinical Skills Advisor",
                bio: "Focuses on clinical skills assessment and USMLE Step 2 CS preparation.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Dr. Sarah Williams",
                role: "Technology Integration Specialist",
                bio: "Develops innovative digital learning tools for medical education.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Dr. Robert Garcia",
                role: "Community Engagement Director",
                bio: "Builds partnerships with medical schools and student organizations.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Dr. Lisa Patel",
                role: "Research Methodology Expert",
                bio: "Specializes in evidence-based education and assessment methodologies.",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Become part of our growing community of medical professionals and students dedicated to advancing USMLE
                education.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

