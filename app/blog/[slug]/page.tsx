import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  category: string
  readTime: string
  publishDate: string
  slug: string
  author: string
  tags: string[]
}

const blogPosts: Record<string, BlogPost> = {
  "ai-presets-vs-traditional-presets": {
    id: "ai-presets-vs-traditional",
    title: "AI-Generated Presets vs Traditional Presets: Which is Better?",
    description: "Compare the benefits of AI-powered custom presets versus traditional preset packs for your photo and video editing workflow.",
    category: "AI Technology",
    readTime: "5 min read",
    publishDate: "2024-12-15",
    slug: "ai-presets-vs-traditional-presets",
    author: "PresetLab Team",
    tags: ["AI", "Presets", "Photography", "Comparison"],
    content: `
# AI-Generated Presets vs Traditional Presets: Which is Better?

The world of photo and video editing has been revolutionized by AI technology. But how do AI-generated presets stack up against traditional preset packs? Let's dive deep into this comparison.

## What Are Traditional Presets?

Traditional presets are pre-configured settings created by photographers and editors, packaged and sold as collections. They're designed to work across various images but often require manual adjustments.

### Pros of Traditional Presets:
- **Proven Results**: Created by experienced professionals
- **Variety**: Large collections with multiple styles
- **Immediate Use**: Ready to apply right away
- **Community**: Often come with tutorials and support

### Cons of Traditional Presets:
- **Generic**: One-size-fits-all approach
- **Limited Customization**: May not match your specific vision
- **Inconsistent Results**: Work better on some images than others
- **Expensive**: Quality packs can cost $50-200+

## What Are AI-Generated Presets?

AI-generated presets are custom-created based on your specific image and style description. They're tailored to your exact needs using machine learning algorithms.

### Pros of AI-Generated Presets:
- **Personalized**: Created specifically for your image and vision
- **Consistent**: Designed to work perfectly with your content
- **Adaptive**: Can be fine-tuned based on feedback
- **Cost-Effective**: Generate unlimited presets for a monthly fee

### Cons of AI-Generated Presets:
- **Learning Curve**: Requires good style descriptions
- **Technology Dependent**: Relies on AI accuracy
- **Newer Technology**: Less established than traditional methods

## The Verdict

For most creators, AI-generated presets offer superior value and results. They provide the personalization that traditional presets can't match, ensuring your content has a unique, consistent look that's truly yours.

**Best for AI Presets:**
- Content creators seeking unique aesthetics
- Photographers wanting consistent results
- Anyone tired of generic preset packs
- Creators on a budget

**Best for Traditional Presets:**
- Beginners learning different styles
- Editors who prefer manual control
- Those working with diverse content types

## Getting Started with AI Presets

Ready to try AI-generated presets? Here's how to get the best results:

1. **Upload a representative image** from your typical work
2. **Describe your vision clearly** - be specific about mood, colors, and style
3. **Test and refine** - use the generated preset and provide feedback
4. **Build your library** - create presets for different scenarios

The future of photo editing is personalized, and AI presets are leading the way.
    `
  },
  "complete-lightroom-preset-guide": {
    id: "lightroom-preset-guide",
    title: "Complete Guide to Using Custom Lightroom Presets",
    description: "Learn how to install, customize, and get the most out of your Lightroom presets for consistent photo editing results.",
    category: "Lightroom",
    readTime: "8 min read",
    publishDate: "2024-12-10",
    slug: "complete-lightroom-preset-guide",
    author: "PresetLab Team",
    tags: ["Lightroom", "Presets", "Tutorial", "Photography"],
    content: `
# Complete Guide to Using Custom Lightroom Presets

Lightroom presets are one of the most powerful tools for achieving consistent, professional-looking photos. This comprehensive guide will teach you everything you need to know.

## What Are Lightroom Presets?

Lightroom presets are saved combinations of editing adjustments that can be applied to photos with a single click. They include settings for exposure, contrast, highlights, shadows, colors, and more.

## Installing Presets in Lightroom

### For Lightroom Classic:
1. Open Lightroom Classic
2. Go to the Develop module
3. Right-click on "User Presets" in the Presets panel
4. Select "Import Presets"
5. Navigate to your .xmp files and select them
6. Click "Import"

### For Lightroom CC:
1. Open Lightroom CC
2. Go to the Edit panel
3. Click on "Presets"
4. Click the three dots menu
5. Select "Import Presets"
6. Choose your .xmp files

## Best Practices for Using Presets

### 1. Start with Similar Images
Presets work best on images with similar lighting conditions and color profiles to the original image they were created for.

### 2. Fine-Tune After Applying
No preset is perfect out of the box. Always make minor adjustments:
- **Exposure**: Adjust brightness to match your image
- **Highlights/Shadows**: Balance the light and dark areas
- **Vibrance/Saturation**: Fine-tune color intensity
- **Clarity/Texture**: Adjust detail enhancement

### 3. Create Preset Variations
Save different versions of your favorite presets:
- Light version (reduced intensity)
- High contrast version
- Warm/cool variations

## Organizing Your Presets

### Create Folders by Style:
- Portrait Presets
- Landscape Presets
- Street Photography
- Wedding Presets
- Social Media Presets

### Naming Convention:
Use descriptive names like:
- "Warm Golden Hour - Light"
- "Moody Portrait - High Contrast"
- "Clean Minimal - Bright"

## Common Preset Mistakes to Avoid

1. **Over-Processing**: Don't push adjustments too far
2. **Ignoring White Balance**: Always check color temperature
3. **Forgetting Local Adjustments**: Use masks for specific areas
4. **Not Backing Up**: Save your custom presets regularly

## Creating Your Own Presets

Once you've edited a photo you love:
1. Go to the Presets panel
2. Click the "+" icon
3. Choose "Create Preset"
4. Name your preset
5. Select which settings to include
6. Save to your desired folder

## Advanced Preset Techniques

### Conditional Presets
Create presets that work well in specific conditions:
- Indoor vs. outdoor lighting
- Different camera models
- Various ISO ranges

### Preset Stacking
Layer multiple presets for complex looks:
1. Apply base color grading preset
2. Add film grain preset
3. Apply vignette preset

## Troubleshooting Common Issues

**Preset looks different on my photo:**
- Check white balance settings
- Adjust exposure compensation
- Consider the original lighting conditions

**Colors look unnatural:**
- Reduce saturation/vibrance
- Adjust individual color channels
- Check the HSL panel settings

**Too much contrast:**
- Reduce highlights and shadows
- Lower the contrast slider
- Use tone curve adjustments

## Maintaining Preset Quality

1. **Regular Updates**: Refine presets based on usage
2. **Backup System**: Keep presets in cloud storage
3. **Version Control**: Save different versions as you improve
4. **Documentation**: Note what each preset works best for

## Conclusion

Mastering Lightroom presets takes practice, but the time investment pays off with faster editing and more consistent results. Remember, presets are starting points, not final destinations. Always fine-tune to match your vision.

Ready to create custom presets tailored specifically to your style? Try AI-generated presets that understand your unique aesthetic.
    `
  }
}

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug]
  
  if (!post) {
    return {
      title: "Post Not Found | PresetLab Blog"
    }
  }

  return {
    title: `${post.title} | PresetLab Blog`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    }
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

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
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <header className="mb-12">
            <Link 
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {post.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-b border-border/20 py-4">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
                <div>
                  By {post.author}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border/20">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Create Your Perfect Presets?</h3>
            <p className="text-muted-foreground mb-6">
              Stop struggling with generic presets. Create custom presets tailored to your unique style with AI.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}