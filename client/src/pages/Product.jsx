import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Share,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Star,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("Round Neck");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data
  const product = {
    id: "1",
    name: "Urban Essential Hoodie",
    price: 89,
    originalPrice: 120,
    description:
      "Elevate your street style with our premium Urban Essential Hoodie. Crafted from high-quality cotton blend for maximum comfort and durability. Features a minimalist design that speaks volumes about your refined taste in streetwear.",
    images: [hoodieImage, hoodieImage, hoodieImage],
    sizes: ["S", "M", "L", "XL", "XXL"],
    // typeOfProduct: "Hoodie",
    varietyOfProduct: ["Round Neck", "Over Size", "Polo", "Hoodie", "Zipper"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray", value: "#808080" },
    ],
    category: "Hoodies",
    isNew: true,
    onSale: true,
    rating: 4.8,
    reviews: 127,
    features: [
      "Premium cotton blend fabric",
      "Reinforced kangaroo pocket",
      "Adjustable drawstring hood",
      "Ribbed cuffs and hem",
      "Machine washable",
    ],
    specifications: {
      Material: "80% Cotton, 20% Polyester",
      Weight: "350 GSM",
      Fit: "Regular",
      "Model Height": "6'0\" wearing size M",
      Care: "Machine wash cold, tumble dry low",
    },
  };

  // Related products
  const relatedProducts = [
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose your preferred size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose your preferred size before purchasing.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Redirecting to checkout",
      description: "Taking you to secure checkout...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-foreground/70 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-card/50 border border-border/50">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-accent"
                      : "border-border/50 hover:border-accent/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                {product.isNew && (
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    NEW
                  </Badge>
                )}
                {product.onSale && (
                  <Badge variant="destructive" className="text-xs">
                    SALE
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-accent">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <p className="text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variety Details */}
            <div>
              <h3 className="font-semibold mb-3">Type</h3>
              <div className="gap-6 flex">
                {product.varietyOfProduct.map((variety, index) => (
                  <>
                    <Button
                      key={index}
                      // onClick={() => setSelectedVariety(variety)}
                      className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                        selectedVariety === variety
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border hover:border-accent/50 hover:bg-accent/10"
                      }
                          ${
                            variety !== "Round Neck"
                              ? "opacity-80 cursor-not-allowed"
                              : "opacity-100"
                          } 
                      
                      `}
                    >
                      {variety}
                    </Button>
                  </>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="gap-6 flex">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent/50 hover:bg-accent/10"
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-accent scale-110"
                        : "border-border hover:border-accent/50"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center border border-border rounded-md w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="cta" size="lg" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Truck className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">
                        On orders over $75
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <RotateCcw className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-muted-foreground">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">
                        256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Product Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-foreground/80"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-border/30 last:border-b-0"
                        >
                          <span className="font-medium">{key}:</span>
                          <span className="text-foreground/80">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <h3 className="font-semibold text-lg mb-2">
                      Customer Reviews
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      {product.rating} out of 5 stars ({product.reviews}{" "}
                      reviews)
                    </p>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-8 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <>
                <ProductCard key={product.id} product={product} />
                {/* <div>Hello</div> */}
              </>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
