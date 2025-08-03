import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  X,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
} from "lucide-react"; // Added new icons

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    // 'images' will now be populated by uploadedImageUrls, not direct input
    sizes: [""],
    varietyOfProduct: [""],
    colors: [{ name: "", value: "" }],
    category: "",
    isNew: true,
    onSale: false,
    rating: 0,
    reviews: 0,
    features: [""],
    specifications: {
      Material: "",
      Weight: "",
      Fit: "",
      Care: "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]); // <--- NEW: Stores File objects selected from input
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]); // <--- NEW: Stores URLs after Cloudinary upload
  const [isUploadingImages, setIsUploadingImages] = useState(false); // <--- NEW: Loading state for image upload

  const [isLoading, setIsLoading] = useState(false); // Overall form submission loading
  const [errors, setErrors] = useState({}); // For client-side validation errors
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Cloudinary credentials from environment variables (ensure these are set up!)
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  // --- Handlers for regular form fields (unchanged) ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // --- Handlers for dynamic array fields (sizes, varieties, features, but NOT images anymore) ---
  const handleArrayChange = (index, value, fieldName) => {
    setFormData((prevData) => {
      const newArray = [...prevData[fieldName]];
      newArray[index] = value;
      return { ...prevData, [fieldName]: newArray };
    });
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const handleAddArrayItem = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: [...prevData[fieldName], ""],
    }));
  };

  const handleRemoveArrayItem = (index, fieldName) => {
    setFormData((prevData) => {
      const newArray = prevData[fieldName].filter((_, i) => i !== index);
      // Ensure there's always at least one empty field for dynamic input fields if they can't be truly empty
      if (newArray.length === 0) {
        // Images can be truly empty, but sizes/varieties/features usually need at least one
        return { ...prevData, [fieldName]: [""] };
      }
      return { ...prevData, [fieldName]: newArray };
    });
  };

  // --- Handlers for colors (unchanged) ---
  const handleColorChange = (index, colorField, value) => {
    setFormData((prevData) => {
      const newColors = [...prevData.colors];
      newColors[index] = { ...newColors[index], [colorField]: value };
      return { ...prevData, colors: newColors };
    });
  };

  const handleAddColor = () => {
    setFormData((prevData) => ({
      ...prevData,
      colors: [...prevData.colors, { name: "", value: "" }],
    }));
  };

  const handleRemoveColor = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      colors: prevData.colors.filter((_, i) => i !== index),
    }));
  };

  // --- Handlers for specifications (unchanged) ---
  const handleSpecificationChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        [field]: value,
      },
    }));
  };

  // --- NEW: Handle file input change ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    uploadImagesToCloudinary();
    setSelectedFiles(files); // Store selected File objects
    setUploadedImageUrls([]); // Clear previously uploaded URLs when new files are selected
    setErrors((prevErrors) => ({ ...prevErrors, images: "" })); // Clear any image-related errors
  };

  // --- NEW: Handle removing a selected file before upload ---
  const handleRemoveSelectedFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // --- NEW: Upload images to Cloudinary ---
  const uploadImagesToCloudinary = async () => {
    if (!selectedFiles.length) {
      return []; // No files selected, return empty array
    }

    // Basic check for Cloudinary credentials
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      toast({
        title: "Cloudinary Error",
        description:
          "Cloudinary credentials (Cloud Name or Upload Preset) are not set in environment variables.",
        variant: "destructive",
      });
      return []; // Prevent upload if credentials are missing
    }

    setIsUploadingImages(true); // Start image upload loading indicator
    const uploadedUrls = [];
    try {
      for (const file of selectedFiles) {
        console.log(file);
        const formData = new FormData();
        formData.append("file", file); // The actual file
        formData.append("upload_preset", `${CLOUDINARY_UPLOAD_PRESET}`); // Your unsigned upload preset name

        // Make POST request to Cloudinary API
        console.log("printing1");
        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          if (response.ok) {
            // Check if response status is 2xx
            const data = await response.json();
            uploadedUrls.push(data.secure_url); // Return the secure URL on success
          } else {
            const errorText = await response.text(); // Get the raw error response from Cloudinary
            console.error(
              `Failed to upload ${file.name}. Status: ${response.status}`,
              errorText
            );
            // Throw an error with the details to be caught below
            throw new Error(
              `Cloudinary responded with ${response.status}: ${errorText}`
            );
          }
          // console.log(response);
          // uploadedUrls.push(response.data.url); // Store the secure URL provided by Cloudinary
        } catch (error) {
          //   toast.error("Upload Failed");
          console.log(error);
        }
        // console.log(response);
        console.log("printing");
      }
      setUploadedImageUrls(uploadedUrls); // Update state with all uploaded URLs
      return uploadedUrls; // Return the array of URLs
    } catch (error) {
      console.error("Error uploading images to Cloudinary:", error);
      toast({
        title: "Image Upload Failed",
        description:
          error.response?.data?.message ||
          "Failed to upload images. Check console for details.",
        variant: "destructive",
      });
      return []; // Return empty array on error
    } finally {
      setIsUploadingImages(false); // Stop image upload loading indicator
    }
  };

  // --- Validation Logic (Modified for image handling) ---
  const validateForm = () => {
    let newErrors = {};
    // Basic validation for required fields
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.originalPrice || formData.originalPrice <= 0)
      newErrors.originalPrice = "Original price must be a positive number.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";

    // Images: MUST have selected files AND assume they will be successfully uploaded
    if (selectedFiles.length === 0) {
      newErrors.images = "At least one image file is required.";
    }

    // Sizes: At least one size should be provided and not empty
    if (formData.sizes.length === 0 || formData.sizes.every((s) => !s.trim())) {
      newErrors.sizes = "At least one size is required.";
    }

    // Varieties: At least one variety should be provided and not empty
    if (
      formData.varietyOfProduct.length === 0 ||
      formData.varietyOfProduct.every((v) => !v.trim())
    ) {
      newErrors.varietyOfProduct = "At least one variety is required.";
    }

    // Colors: At least one color, and each color must have name and value
    if (
      formData.colors.length === 0 ||
      formData.colors.some((c) => !c.name.trim() || !c.value.trim())
    ) {
      newErrors.colors =
        "At least one color with a name and value is required.";
    }

    // Features: At least one feature should be provided and not empty
    if (
      formData.features.length === 0 ||
      formData.features.every((f) => !f.trim())
    ) {
      newErrors.features = "At least one feature is required.";
    }

    // Specifications: All required specs
    if (!formData.specifications.Material.trim())
      newErrors.Material = "Material is required.";
    if (!formData.specifications.Weight.trim())
      newErrors.Weight = "Weight is required.";
    if (!formData.specifications.Fit.trim()) newErrors.Fit = "Fit is required.";
    if (!formData.specifications.Care.trim())
      newErrors.Care = "Care instructions are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start overall form submission loading

    if (!validateForm()) {
      // Validate basic form fields and file selection
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and correct errors.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // --- NEW: Image Upload Trigger ---
    let finalImageUrls = [];
    if (selectedFiles.length > 0) {
      finalImageUrls = await uploadImagesToCloudinary();
      if (finalImageUrls.length === 0) {
        // If files were selected but upload failed or returned empty
        setIsLoading(false);
        toast({
          title: "Image Upload Failed",
          description:
            "Selected images could not be uploaded. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // If no files selected, but validation passed (which shouldn't happen if validation is strict on images)
      // or if using pre-existing URLs, handle that here. For now, assume fresh upload.
      // If images array is empty and no files selected, validation should catch it.
    }
    // --- END NEW IMAGE UPLOAD LOGIC ---

    try {
      // Clean up empty strings from arrays before sending
      const dataToSend = {
        ...formData,
        images: finalImageUrls, // <--- Use the uploaded Cloudinary URLs
        sizes: formData.sizes.filter((s) => s.trim()),
        varietyOfProduct: formData.varietyOfProduct.filter((v) => v.trim()),
        features: formData.features.filter((f) => f.trim()),
        colors: formData.colors.filter((c) => c.name.trim() && c.value.trim()),
      };

      const response = await axios.post(
        `${API_BASE_URL}/admin/products`,
        dataToSend
      );

      toast({
        title: "Product Added!",
        description: response.data.message,
        variant: "success",
      });
      // Reset form and image states after successful submission
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        description: "",
        sizes: [""],
        varietyOfProduct: [""],
        colors: [{ name: "", value: "" }],
        category: "",
        isNew: true,
        onSale: false,
        rating: 0,
        reviews: 0,
        features: [""],
        specifications: { Material: "", Weight: "", Fit: "", Care: "" },
      });
      setSelectedFiles([]); // Clear selected files
      setUploadedImageUrls([]); // Clear uploaded URLs
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Failed to Add Product",
        description:
          err.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Always stop overall form loading
    }
  };

  return (
    <Card className="bg-card/50 border-border/50 p-6">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Basic Information
            </h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Product Name"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
              >
                Category *
              </label>
              <Input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="e.g., Hoodies, T-Shirts"
              />
              {errors.category && (
                <p className="text-destructive text-sm mt-1">
                  {errors.category}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description *
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Detailed product description"
                rows={4}
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Pricing
            </h3>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price *
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Current price"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="text-destructive text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="originalPrice"
                className="block text-sm font-medium mb-2"
              >
                Original Price *
              </label>
              <Input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Original price (for discounts)"
                min="0"
                step="0.01"
              />
              {errors.originalPrice && (
                <p className="text-destructive text-sm mt-1">
                  {errors.originalPrice}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload Section - NEW */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Product Images *
            </h3>
            <div>
              <label
                htmlFor="imageUpload"
                className="block text-sm font-medium mb-2"
              >
                Upload Images
              </label>
              <Input
                type="file"
                id="imageUpload"
                multiple // Allow multiple file selection
                accept="image/*" // Restrict to image files
                onChange={handleFileChange}
                className="bg-secondary/50 file:text-foreground file:bg-primary file:rounded-md file:border-0 file:px-3 file:py-1.5"
                disabled={isUploadingImages} // Disable while uploading
              />
              {errors.images && (
                <p className="text-destructive text-sm mt-1">{errors.images}</p>
              )}
            </div>

            {/* Loading Indicator for Image Uploads */}
            {isUploadingImages && (
              <div className="flex items-center text-accent">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Uploading images... Please wait.</span>
              </div>
            )}

            {/* Image Previews of selected local files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 border border-border/50 rounded-md p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected Images (Local Preview):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50 flex items-center justify-center bg-card"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${file.name}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
                        onClick={() => handleRemoveSelectedFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previews of uploaded Cloudinary URLs */}
            {uploadedImageUrls.length > 0 && (
              <div className="mt-4 border border-accent/50 rounded-md p-3 bg-card">
                <p className="text-sm text-muted-foreground mb-2">
                  Successfully Uploaded Images:
                </p>
                <div className="flex flex-wrap gap-2">
                  {uploadedImageUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-24 h-24 rounded-md overflow-hidden border border-accent/50 flex items-center justify-center bg-primary/20 text-xs text-accent"
                    >
                      <ImageIcon className="h-8 w-8 absolute z-0 text-accent/50" />
                      <img
                        src={url}
                        alt={`Cloudinary ${index}`}
                        className="w-full h-full object-cover opacity-70"
                      />
                      <span className="absolute bottom-0 bg-background/80 w-full text-center py-0.5 text-ellipsis overflow-hidden whitespace-nowrap px-1">{`Img ${
                        index + 1
                      }`}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Arrays (Sizes, Variety, Colors, Features) - unchanged */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Visuals & Variants
            </h3>
            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Sizes *
              </label>
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    value={size}
                    onChange={(e) =>
                      handleArrayChange(index, e.target.value, "sizes")
                    }
                    className="flex-1 bg-secondary/50"
                    placeholder={`Size ${index + 1} (e.g., S, M, L)`}
                  />
                  {formData.sizes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveArrayItem(index, "sizes")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddArrayItem("sizes")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Size
              </Button>
              {errors.sizes && (
                <p className="text-destructive text-sm mt-1">{errors.sizes}</p>
              )}
            </div>

            {/* Variety of Product */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Varieties *
              </label>
              {formData.varietyOfProduct.map((variety, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    value={variety}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        e.target.value,
                        "varietyOfProduct"
                      )
                    }
                    className="flex-1 bg-secondary/50"
                    placeholder={`Variety ${
                      index + 1
                    } (e.g., Regular, Oversized)`}
                  />
                  {formData.varietyOfProduct.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleRemoveArrayItem(index, "varietyOfProduct")
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddArrayItem("varietyOfProduct")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Variety
              </Button>
              {errors.varietyOfProduct && (
                <p className="text-destructive text-sm mt-1">
                  {errors.varietyOfProduct}
                </p>
              )}
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium mb-2">Colors *</label>
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(index, "name", e.target.value)
                    }
                    className="w-1/2 bg-secondary/50"
                    placeholder="Color Name (e.g., Black)"
                  />
                  <Input
                    type="text"
                    value={color.value}
                    onChange={(e) =>
                      handleColorChange(index, "value", e.target.value)
                    }
                    className="w-1/2 bg-secondary/50"
                    placeholder="Hex/RGB/CSS Value (e.g., #000000)"
                  />
                  {formData.colors.length > 0 && ( // Allow removing only if at least one exists
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveColor(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddColor}>
                <Plus className="h-4 w-4 mr-2" /> Add Color
              </Button>
              {errors.colors && (
                <p className="text-destructive text-sm mt-1">{errors.colors}</p>
              )}
            </div>
          </div>

          {/* Product Flags */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Status & Ratings
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                name="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isNew: checked })
                }
              />
              <label htmlFor="isNew" className="text-sm font-medium">
                New Arrival
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                name="onSale"
                checked={formData.onSale}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, onSale: checked })
                }
              />
              <label htmlFor="onSale" className="text-sm font-medium">
                On Sale
              </label>
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium mb-2"
              >
                Rating
              </label>
              <Input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="bg-secondary/50"
                min="0"
                max="5"
                step="0.1"
              />
              {errors.rating && (
                <p className="text-destructive text-sm mt-1">{errors.rating}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="reviews"
                className="block text-sm font-medium mb-2"
              >
                Number of Reviews
              </label>
              <Input
                type="number"
                id="reviews"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                className="bg-secondary/50"
                min="0"
                step="1"
              />
              {errors.reviews && (
                <p className="text-destructive text-sm mt-1">
                  {errors.reviews}
                </p>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Features *
            </h3>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "features")
                  }
                  className="flex-1 bg-secondary/50"
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArrayItem(index, "features")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddArrayItem("features")}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Feature
            </Button>
            {errors.features && (
              <p className="text-destructive text-sm mt-1">{errors.features}</p>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Specifications *
            </h3>
            <div>
              <label
                htmlFor="specMaterial"
                className="block text-sm font-medium mb-2"
              >
                Material *
              </label>
              <Input
                type="text"
                id="specMaterial"
                name="specifications.Material"
                value={formData.specifications.Material}
                onChange={(e) =>
                  handleSpecificationChange("Material", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., 100% Cotton"
              />
              {errors.Material && (
                <p className="text-destructive text-sm mt-1">
                  {errors.Material}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="specWeight"
                className="block text-sm font-medium mb-2"
              >
                Weight *
              </label>
              <Input
                type="text"
                id="specWeight"
                name="specifications.Weight"
                value={formData.specifications.Weight}
                onChange={(e) =>
                  handleSpecificationChange("Weight", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., 300 GSM"
              />
              {errors.Weight && (
                <p className="text-destructive text-sm mt-1">{errors.Weight}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="specFit"
                className="block text-sm font-medium mb-2"
              >
                Fit *
              </label>
              <Input
                type="text"
                id="specFit"
                name="specifications.Fit"
                value={formData.specifications.Fit}
                onChange={(e) =>
                  handleSpecificationChange("Fit", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., Oversized, Regular"
              />
              {errors.Fit && (
                <p className="text-destructive text-sm mt-1">{errors.Fit}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="specCare"
                className="block text-sm font-medium mb-2"
              >
                Care Instructions *
              </label>
              <Input
                type="text"
                id="specCare"
                name="specifications.Care"
                value={formData.specifications.Care}
                onChange={(e) =>
                  handleSpecificationChange("Care", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., Machine wash cold"
              />
              {errors.Care && (
                <p className="text-destructive text-sm mt-1">{errors.Care}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full"
            disabled={isLoading || isUploadingImages} // Disable if images are uploading
          >
            {isLoading || isUploadingImages ? ( // Show loading text for either
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                {isUploadingImages
                  ? "Uploading Images..."
                  : "Adding Product..."}
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
