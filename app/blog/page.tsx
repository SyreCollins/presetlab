import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - Photo & Video Editing Tips | PresetLab",
  description: "Learn photo editing techniques, video color grading tips, and how to create stunning presets with AI. Expert tutorials for Lightroom, Premiere Pro, and more.",
  keywords: [
    "photo editing tips",
    "video editing tutorials",
    "Lightroom presets guide",
    "color grading techniques",
    "AI preset creation",
    "photography tutorials",
    "video editing tips",
    "preset creation guide"
  ],
  openGraph: {
    title: "Photo & Video Editing Blog | PresetLab",
    description: "Expert tutorials on photo editing, video color grading, and AI-powered preset creation.",
    type: "website",
  },
}

const blogPosts = [
  {
    id: "ai-presets-vs-traditional",
    title: "AI-Generated Presets vs Traditional Presets: Which is Better?",
    description: "Compare the benefits of AI-powered custom presets versus traditional preset packs for your photo and video editing workflow.",
    category: "AI Technology",
    readTime: "5 min read",
    publishDate: "2024-12-15",
    slug: "ai-presets-vs-traditional-presets"
  },
  {
    id: "lightroom-preset-guide",
    title: "Complete Guide to Using Custom Lightroom Presets",
    description: "Learn how to install, customize, and get the most out of your Lightroom presets for consistent photo editing results.",
    category: "Lightroom",
    readTime: "8 min read",
    publishDate: "2024-12-10",
    slug: "complete-lightroom-preset-guide"
  },
  {
    id: "video-lut-basics",
    title: "Video LUTs Explained: Color Grading for Beginners",
    description: "Understanding LUTs (Look-Up Tables) and how to use them in Premiere Pro, Final Cut Pro, and DaVinci Resolve.",
    category: "Video Editing",
    readTime: "6 min read",
    publishDate: "2024-12-05",
    slug: "video-luts-explained-beginners-guide"
  },
  {
    id: "consistent-instagram-aesthetic",
    title: "How to Create a Consistent Instagram Aesthetic with Custom Presets",
    description: "Build a recognizable brand on Instagram using AI-generated presets tailored to your unique style and content.",
    category: "Social Media",
    readTime: "7 min read",
    publishDate: "2024-12-01",
    slug: "consistent-instagram-aesthetic-custom-presets"
  },
  {
    id: "wedding-photography-presets",
    title: "Best Preset Styles for Wedding Photography",
    description: "Discover the most popular preset styles for wedding photography and how to create custom presets for your signature look.",
    category: "Photography",
    readTime: "9 min read",
    publishDate: "2024-11-28",
    slug: "best-preset-styles-wedding-photography"
  },
  {
    id: "mobile-editing-presets",
    title: "Mobile Photo Editing: Using Presets on Your Phone",
    description: "How to use and adapt your custom presets for mobile editing apps like Lightroom Mobile and VSCO.",
    category: "Mobile Editing",
    readTime: "4 min read",
    publishDate: "2024-11-25",
    slug: "mobile-photo-editing-presets-guide"
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">P</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
              PresetLab
            </h1>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-orange-950/20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Photo & Video Editing
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              {" "}Blog
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert tutorials, tips, and insights on photo editing, video color grading, and AI-powered preset creation.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-orange-600/5">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect Presets?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stop reading about presets and start creating them with AI-powered precision.
          </p>
          <Link 
            href="/auth/signup"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            Start Creating Presets
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}