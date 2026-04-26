import { useState } from "react";
import { ExternalLink, Filter, MapPin, Phone, Search, Shield, Siren, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  emergencyResource,
  helplineLanguages,
  helplineResources,
  helplineTypeMeta,
  type HelplineType,
} from "@/data/helplines";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const typeFilters: Array<{ label: string; value: "all" | HelplineType }> = [
  { label: "All", value: "all" },
  { label: "Crisis", value: "crisis" },
  { label: "Support", value: "support" },
  { label: "Specialized", value: "specialized" },
];

const Helplines = () => {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | HelplineType>("all");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredHelplines = helplineResources.filter((helpline) => {
    const matchesType = selectedType === "all" || helpline.type === selectedType;
    const matchesLanguage =
      selectedLanguage === "All" || helpline.languages.includes(selectedLanguage);
    const matchesQuery =
      normalizedQuery.length === 0 ||
      helpline.name.toLowerCase().includes(normalizedQuery) ||
      helpline.location.toLowerCase().includes(normalizedQuery) ||
      helpline.bestFor.toLowerCase().includes(normalizedQuery) ||
      helpline.specialization.some((item) =>
        item.toLowerCase().includes(normalizedQuery),
      );

    return matchesType && matchesLanguage && matchesQuery;
  });

  const quickActions = [
    {
      title: "Immediate danger",
      description: "Call the national emergency response system first.",
      actionLabel: `Call ${emergencyResource.number}`,
      href: `tel:${emergencyResource.number}`,
    },
    {
      title: "Need 24/7 listening",
      description: "Start with a crisis line that is available at any hour.",
      actionLabel: "Call Vandrevala",
      href: "tel:+919999666555",
    },
    {
      title: "Want professional tele-counselling",
      description: "Use a service built for guided phone support.",
      actionLabel: "Call Mann Talks",
      href: "tel:8686139139",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-emergency/10 via-card to-primary/10 p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--emergency)/0.18),transparent_38%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <Badge className="w-fit border-emergency/30 bg-emergency/10 text-emergency" variant="outline">
              Verified resource directory
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Find the fastest path to human support
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              This page is designed for action, not scrolling fatigue. Start with the option that matches the urgency of what you are feeling, then move to the directory if you need something more specific.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href={`tel:${emergencyResource.number}`}>
                  <Siren className="w-4 h-4" />
                  Call {emergencyResource.number}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+919999666555">Call Vandrevala 24/7</a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Resource details reviewed against organization sites on {formatDate("2026-03-24")}.
            </p>
          </div>

          <Card className="border-emergency/20 bg-background/85">
            <CardHeader>
              <CardTitle className="text-xl">When seconds matter</CardTitle>
              <CardDescription>
                Use emergency support first if there is immediate danger, a suicide attempt, or a medical emergency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-emergency/20 bg-emergency/5 p-4">
                <p className="text-sm font-medium text-emergency">{emergencyResource.name}</p>
                <p className="mt-1 text-3xl font-bold">{emergencyResource.number}</p>
                <p className="mt-2 text-sm text-muted-foreground">{emergencyResource.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">{emergencyResource.hours}</p>
              </div>
              <a
                href={emergencyResource.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                View official source
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="border-border/60 bg-card/80">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href={action.href}>{action.actionLabel}</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border/60 bg-card/80 p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-4">
            <label htmlFor="helpline-search" className="block text-sm font-medium">
              Search by need, city, or service
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="helpline-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Suicide prevention, Goa, tele-counselling..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Filter className="h-4 w-4" />
              {filteredHelplines.length} matching resources
            </div>
            <p className="mt-1">Filter by urgency and language below.</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedType === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {helplineLanguages.map((language) => (
            <Button
              key={language}
              variant={selectedLanguage === language ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedLanguage(language)}
            >
              {language}
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredHelplines.map((helpline) => {
          const typeMeta = helplineTypeMeta[helpline.type];

          return (
            <Card
              key={helpline.id}
              className={`border-border/60 bg-card/80 transition-all duration-300 hover:shadow-lg ${typeMeta.borderClassName}`}
            >
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{helpline.name}</CardTitle>
                    <Badge variant="outline" className={typeMeta.badgeClassName}>
                      {typeMeta.label}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-border/70">
                    Verified {formatDate(helpline.verifiedAt)}
                  </Badge>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {helpline.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Best for</p>
                  <p className="mt-2 text-sm">{helpline.bestFor}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
                    <Phone className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Call</p>
                      <p className="mt-1 font-medium">{helpline.number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
                    <TimerReset className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hours</p>
                      <p className="mt-1 font-medium">{helpline.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/50 p-3 sm:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                      <p className="mt-1 font-medium">{helpline.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Languages</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {helpline.languages.map((language) => (
                        <Badge key={language} variant="secondary" className="bg-secondary/60">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Useful for</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {helpline.specialization.map((item) => (
                        <Badge key={item} variant="outline" className="border-border/70">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1" asChild>
                    <a href={`tel:${helpline.number.replace(/[^\d+]/g, "")}`}>Call now</a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 ${typeMeta.buttonClassName}`}
                    asChild
                  >
                    <a href={helpline.sourceUrl} target="_blank" rel="noreferrer">
                      View source
                    </a>
                  </Button>
                </div>

                <div className="rounded-xl border border-border/50 bg-background/70 p-3 text-xs text-muted-foreground">
                  Source checked against <span className="font-medium text-foreground">{helpline.sourceLabel}</span>.
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {filteredHelplines.length === 0 ? (
        <Card className="mt-8 border-border/60 bg-card/80">
          <CardContent className="py-10 text-center">
            <p className="text-lg font-medium">No helplines match that filter.</p>
            <p className="mt-2 text-muted-foreground">
              Try a broader search or reset your language and urgency filters.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-5 h-5 text-safe" />
              What to expect on a helpline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Trained listeners or professionals will usually start by helping you slow the moment down.</p>
            <p>You can share as much or as little as you want, and you do not need a polished explanation.</p>
            <p>If the situation is immediately unsafe, they may guide you toward emergency support right away.</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-xl">Before public launch</CardTitle>
            <CardDescription>
              Keep this directory trustworthy by treating it like critical product content, not static copy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Re-verify every number and schedule on a regular review cadence.</p>
            <p>Add ownership for content maintenance so expired numbers do not linger.</p>
            <p>Keep a fallback emergency path visible even if a specialist helpline changes hours.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Helplines;
