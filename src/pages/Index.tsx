import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Phone, BookOpen, Shield, Users, Clock } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Anonymous Chat Rooms",
      description: "Connect with others facing similar challenges in moderated, safe spaces",
      link: "/chat-rooms",
      color: "primary"
    },
    {
      icon: Phone,
      title: "Emergency Helplines",
      description: "24/7 crisis support with trained professionals across India",
      link: "/helplines",
      color: "emergency"
    },
    {
      icon: BookOpen,
      title: "Mental Health Blog",
      description: "Evidence-based articles and personal stories from the community",
      link: "/blog",
      color: "support"
    }
  ];

  const stats = [
    { icon: Users, label: "Active Support Members", value: "2,300+" },
    { icon: MessageCircle, label: "Support Messages Sent", value: "45,000+" },
    { icon: Clock, label: "Hours of Peer Support", value: "12,000+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-support/5 to-healing/10" />
        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-support rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-support to-healing bg-clip-text text-transparent">
              SafeSpace
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Anonymous peer support for mental health. Connect, share, and heal together in a safe, 
              moderated environment where your story matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="px-8">
                <Link to="/chat-rooms">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Join Support Rooms
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link to="/helplines">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Help
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Support You</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to find the support and resources you need for your mental health journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-${feature.color}/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" asChild className="w-full">
                    <Link to={feature.link}>
                      Explore {feature.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Privacy Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-safe/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-safe" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Safety Is Our Priority</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Complete Anonymity</h3>
                <p className="text-muted-foreground">
                  No personal information required. Share only what you're comfortable with. 
                  Your identity remains completely private.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">24/7 Moderation</h3>
                <p className="text-muted-foreground">
                  Trained volunteers and AI systems monitor all interactions to ensure a safe, 
                  supportive environment free from harmful content.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Crisis Intervention</h3>
                <p className="text-muted-foreground">
                  Immediate access to professional crisis helplines and emergency resources 
                  when you need urgent support.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Community Guidelines</h3>
                <p className="text-muted-foreground">
                  Clear, enforced guidelines ensure respectful interactions and create 
                  a healing environment for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              You Don't Have to Face This Alone
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of others who have found support, understanding, and hope in our community. 
              Take the first step towards healing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="px-8">
                <Link to="/chat-rooms">
                  Start Your Journey
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link to="/blog">
                  Read Stories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
