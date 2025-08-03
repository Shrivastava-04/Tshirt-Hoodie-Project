// client/src/components/admin/ProductDetailsModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import {
  Star,
  Tag,
  Layers,
  Palette,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Modal component to display a single product's details
const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  // Use local state to manage the active image in the gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return null; // Don't render if no product is passed
  }

  const nextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  // Render a section with a title and list of items
  const renderListSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={index}
              className="bg-primary/20 text-accent hover:bg-primary/30"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            Detailed view of the product and its specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Product Image Gallery */}
          <div className="relative aspect-square rounded-md overflow-hidden border border-border/50 bg-secondary/50">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6 text-foreground/80" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6 text-foreground/80" />
                    </Button>
                  </>
                )}
                {/* Thumbnails */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-10 h-10 object-cover rounded-sm cursor-pointer border-2 transition-all duration-200 ${
                        index === activeImageIndex
                          ? "border-accent"
                          : "border-transparent opacity-60"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-10 w-10 mr-2" /> No Image
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-accent">
              ₹{product.price.toFixed(2)}
              {product.originalPrice > product.price && (
                <span className="text-base text-muted-foreground line-through ml-2">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </h3>

            <p className="text-sm text-foreground/70">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                  NEW
                </Badge>
              )}
              {product.onSale && (
                <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
                  SALE
                </Badge>
              )}
              {product.rating > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
                  <Star className="h-3 w-3 mr-1" />
                  {product.rating.toFixed(1)}
                </Badge>
              )}
              {product.reviews > 0 && (
                <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20">
                  {product.reviews} Reviews
                </Badge>
              )}
            </div>

            {/* Dynamic Array Details */}
            {renderListSection("Sizes", product.sizes)}
            {renderListSection("Varieties", product.varietyOfProduct)}
            {renderListSection("Features", product.features)}

            {/* Colors */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors &&
                  product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 p-1 px-2 rounded-full bg-primary/20 text-xs text-accent-foreground border border-border/50"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Specifications
              </h4>
              {product.specifications && (
                <CardContent className="space-y-2 p-4 bg-primary/10 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Material:</span>
                    <span className="font-medium text-foreground">
                      {product.specifications.Material}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Weight:</span>
                    <span className="font-medium text-foreground">
                      {product.specifications.Weight}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fit:</span>
                    <span className="font-medium text-foreground">
                      {product.specifications.Fit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Care:</span>
                    <span className="font-medium text-foreground">
                      {product.specifications.Care}
                    </span>
                  </div>
                </CardContent>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
