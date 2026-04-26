import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Clock, Phone, ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts } from "@/data/blog";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const BlogArticle = () => {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="mx-auto max-w-2xl border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Article not found</CardTitle>
            <CardDescription>
              The article you were looking for may have moved or is no longer available.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild>
              <Link to="/blog">Back to blog</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/helplines">Need urgent support?</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="-ml-3">
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </Button>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-support/10 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_45%)]" />
        <div className="relative max-w-4xl space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
            <Badge variant="outline" className="border-border/70">
              {post.audience}
            </Badge>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Published {formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} read</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {post.reviewedBy}. Last reviewed {formatDate(post.reviewedAt)}.
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <article className="space-y-8 lg:col-span-2">
          <Alert className="border-emergency/30 bg-emergency/5">
            <ShieldAlert className="h-4 w-4 text-emergency" />
            <AlertTitle>If this brings up urgent thoughts</AlertTitle>
            <AlertDescription>
              Articles can help with language and reflection, but they are not a substitute for immediate care. If you feel unsafe right now, reach out to a crisis line or emergency service first.
            </AlertDescription>
          </Alert>

          {post.content.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets ? (
                <ul className="mt-5 space-y-3 text-sm text-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <aside className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Key Takeaways</CardTitle>
              <CardDescription>Keep these points in mind as you read and reflect.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {post.takeaways.map((takeaway) => (
                <div key={takeaway} className="flex gap-3 text-sm">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-emergency/20 bg-card/80">
            <CardHeader>
              <CardTitle className="text-xl">Need human support?</CardTitle>
              <CardDescription>
                Use the resource that matches the urgency of what you are feeling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link to="/helplines">
                  <Phone className="w-4 h-4" />
                  View helplines
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/chat-rooms">Join peer support chat</Link>
              </Button>
            </CardContent>
          </Card>

          {relatedPosts.length > 0 ? (
            <Card className="border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle className="text-xl">Related Reads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="block rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <p className="font-medium">{relatedPost.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default BlogArticle;
