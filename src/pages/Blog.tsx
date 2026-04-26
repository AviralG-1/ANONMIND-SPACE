import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Clock, Search, ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blogCategories, blogPosts } from "@/data/blog";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Blog = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const normalizedQuery = query.trim().toLowerCase();
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const leadPost = featuredPosts[0];
  const supportingFeaturedPosts = featuredPosts.slice(1);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-support/10 p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_40%)]" />
        <div className="relative space-y-8">
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Editorial Library
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Clear, supportive reading for hard mental health days
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Browse clinically reviewed explainers, gentle coping guides, and community-focused reads. The goal is not to overwhelm you with content, but to help you find the next useful thing.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
              <label htmlFor="blog-search" className="mb-2 block text-sm font-medium">
                Search by topic or tag
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="blog-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Depression, boundaries, grounding..."
                  className="pl-9"
                />
              </div>
            </div>

            <Card className="border-border/60 bg-background/80">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{blogPosts.length} curated articles</p>
                  <p className="mt-1">Each piece links onward to help, not just more reading.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Alert className="mt-8 border-emergency/30 bg-emergency/5">
        <ShieldAlert className="h-4 w-4 text-emergency" />
        <AlertTitle>Reading support is not crisis care</AlertTitle>
        <AlertDescription>
          If you feel unsafe or are thinking about harming yourself, move to urgent human support first.
          <Link to="/helplines" className="ml-1 font-medium text-primary underline-offset-4 hover:underline">
            Go to helplines
          </Link>
        </AlertDescription>
      </Alert>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {leadPost ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Link to={`/blog/${leadPost.slug}`} className="group block">
            <Card className="h-full overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Featured
                  </Badge>
                  <Badge variant="outline">{leadPost.category}</Badge>
                </div>
                <CardTitle className="text-3xl leading-tight group-hover:text-primary">
                  {leadPost.title}
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-relaxed">
                  {leadPost.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{leadPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(leadPost.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{leadPost.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {leadPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-border/70">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center text-sm font-medium text-primary">
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="grid gap-6">
            {supportingFeaturedPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
                <Card className="h-full border-border/60 bg-card/80 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>{formatDate(post.date)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Browse articles</h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"} for your current filters.
            </p>
          </div>
          {selectedCategory !== "All" || normalizedQuery ? (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedCategory("All");
                setQuery("");
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </div>

        {filteredPosts.length === 0 ? (
          <Card className="border-border/60 bg-card/80">
            <CardContent className="py-12 text-center">
              <p className="text-lg font-medium">No articles match that search yet.</p>
              <p className="mt-2 text-muted-foreground">
                Try a broader keyword like "anxiety", "support", or "grounding".
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
                <Card className="flex h-full flex-col border-border/60 bg-card/80 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.featured ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-xl leading-snug group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">{post.excerpt}</CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-border/70 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between gap-3">
                        <span>{post.author}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Published {formatDate(post.date)}</span>
                        <span>Reviewed {formatDate(post.reviewedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm font-medium text-primary">
                      Read article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
