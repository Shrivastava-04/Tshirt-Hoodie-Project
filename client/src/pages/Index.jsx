import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";

const Index = () => {
  // Mock featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Urban Essential Hoodie",
      price: 89,
      originalPrice: 120,
      image: hoodieImage,
      category: "Hoodies",
      isNew: true,
      onSale: true,
    },
    {
      id: "2",
      name: "Street Culture Tee",
      price: 45,
      image: tshirtImage,
      category: "T-Shirts",
      isNew: true,
    },
    {
      id: "3",
      name: "Midnight Black Hoodie",
      price: 95,
      image: hoodieImage,
      category: "Hoodies",
    },
    {
      id: "4",
      name: "Graphic Statement Tee",
      price: 39,
      originalPrice: 55,
      image: tshirtImage,
      category: "T-Shirts",
      onSale: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Featured Products
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Discover our most popular pieces, carefully selected to elevate
              your streetwear game
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/explore">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Explore Collections
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Find your perfect style in our curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Hoodies Card */}
            <Card className="group overflow-hidden border-border/50 bg-gradient-card">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={hoodieImage}
                  alt="Hoodies Collection"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Explore Hoodies
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Premium comfort meets street style
                  </p>
                  <Button variant="cta" asChild>
                    <Link to="/explore?category=hoodies">
                      Shop Hoodies
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* T-Shirts Card */}
            <Card className="group overflow-hidden border-border/50 bg-gradient-card">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={tshirtImage}
                  alt="T-Shirts Collection"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Explore T-Shirts
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Express yourself with bold graphics
                  </p>
                  <Button variant="cta" asChild>
                    <Link to="/explore?category=tshirts">
                      Shop T-Shirts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Stay in the Loop
            </h2>
            <p className="text-foreground/70 text-lg">
              Be the first to know about new drops, exclusive offers, and street
              style inspiration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="cta" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
