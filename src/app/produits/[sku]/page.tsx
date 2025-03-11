// app/produits/[sku]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTopTex } from "@/hooks/useTopTex";
import { notFound } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const identifier = params.sku as string;

  const { isLoading: apiLoading, error: apiError, getProductByCatalogReference } = useTopTex();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [isPartialSku, setIsPartialSku] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Déterminer si l'identifiant est un SKU ou une référence catalogue
        // Un SKU contient généralement des underscores (ex: FL6606RT_71027_71026)
        // Une référence catalogue est plus courte et sans underscore (ex: FL6606RT)
        const isSku = identifier.includes("_");
        console.log(
          `Identifiant détecté comme ${isSku ? "SKU" : "référence catalogue"}: ${identifier}`
        );

        let result;

        if (isSku) {
          // C'est un SKU, utiliser l'API SKU
          console.log("Récupération par SKU");
          // On pourrait implémenter l'appel à l'API SKU ici, mais pour la simplicité
          // nous utilisons l'API référence catalogue en extrayant la référence du SKU
          const catalogReference = identifier.split("_")[0];
          result = await getProductByCatalogReference(catalogReference, {
            lang: "fr,en",
            usageRight: "b2b_uniquement",
          });

          // Si le SKU ne correspond pas exactement au SKU du produit retourné
          if (result.product && result.product.sku !== identifier) {
            setIsPartialSku(true);
          }
        } else {
          // C'est une référence catalogue, utiliser l'API référence catalogue
          console.log("Récupération par référence catalogue");
          result = await getProductByCatalogReference(identifier, {
            lang: "fr,en",
            usageRight: "b2b_uniquement",
          });
        }

        if (!result.product) {
          throw new Error("Produit introuvable");
        }

        console.log("Données du produit reçues:", result.product);
        setProduct(result.product);

        // Si nous avons des produits associés
        if (result.relatedProducts && Array.isArray(result.relatedProducts)) {
          setRelatedProducts(result.relatedProducts);
        }

        // Initialiser les sélections par défaut
        if (result.product?.colors && result.product.colors.length > 0) {
          setSelectedColor(result.product.colors[0].code);
        }
        if (result.product?.sizes && result.product.sizes.length > 0) {
          setSelectedSize(result.product.sizes[0].code);
        }
        if (result.product?.images && result.product.images.length > 0) {
          setSelectedImage(
            typeof result.product.images[0] === "string"
              ? result.product.images[0]
              : result.product.images[0].url
          );
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des détails du produit:", err);
        const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
        setError(errorMessage);

        // Si l'erreur semble être liée à l'authentification et que nous n'avons pas dépassé le nombre max de tentatives
        if (errorMessage.includes("401") || errorMessage.includes("authentification")) {
          if (retryCount < 2) {
            console.log(
              `Tentative de réessai (${retryCount + 1}/3) après une erreur d'authentification...`
            );
            setRetryCount((prev) => prev + 1);
            // Attendre 1 seconde avant de réessayer
            setTimeout(() => fetchProductDetails(), 1000);
            return;
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchProductDetails();
    }
  }, [identifier, retryCount, getProductByCatalogReference]);

  const handleRetry = () => {
    setRetryCount(0); // Réinitialiser le compteur de tentatives
    setLoading(true); // Indiquer le rechargement
  };

  // Si produit non trouvé
  if (!loading && !product && !error) {
    return notFound();
  }

  // Si chargement en cours
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/4 mt-8"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="p-6 bg-red-50 text-red-600 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="mb-4">{error}</p>
          <div className="flex gap-4 mt-6">
            <Button onClick={handleRetry} variant="default">
              Réessayer
            </Button>
            <Button asChild variant="outline">
              <Link href="/catalogue">Retour au catalogue</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Extraire les informations du produit
  const productName =
    typeof product.designation === "object"
      ? product.designation.fr || product.designation.en || "Produit sans titre"
      : product.designation || "Produit sans titre";

  const productDescription =
    typeof product.description === "object"
      ? product.description.fr || product.description.en || ""
      : product.description || "";

  const productComposition =
    typeof product.composition === "object"
      ? product.composition.fr || product.composition.en || ""
      : product.composition || "";

  const mainImageUrl = selectedImage || product.mainImage || "/images/product-placeholder.jpg";

  const price = product.price || product.publicPrice || null;

  // Images du produit
  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => (typeof img === "string" ? img : img.url))
      : [mainImageUrl];

  // Couleurs disponibles
  const colors = Array.isArray(product.colors) ? product.colors : [];

  // Tailles disponibles
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  const handleAddToCart = () => {
    // Logique d'ajout au panier
    alert(
      `Produit ajouté au panier: ${productName} - Couleur: ${selectedColor} - Taille: ${selectedSize} - Quantité: ${quantity}`
    );
  };

  // Incrémenter/décrémenter la quantité
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:underline">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalogue" className="hover:underline">
          Catalogue
        </Link>
        <span className="mx-2">/</span>
        {product.family && (
          <>
            <Link
              href={`/catalogue/${
                typeof product.family === "object"
                  ? (product.family.fr || product.family.en || "")
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                  : product.family.toLowerCase().replace(/\s+/g, "-")
              }`}
              className="hover:underline"
            >
              {typeof product.family === "object"
                ? product.family.fr || product.family.en || ""
                : product.family}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-800">{productName}</span>
      </div>

      {/* Message d'information si référence partielle */}
      {isPartialSku && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
          <h2 className="font-bold mb-1">Information</h2>
          <p>
            Vous consultez un produit de la gamme <strong>{identifier}</strong> mais pas la variante
            spécifique demandée. Nous vous présentons une variante disponible de ce produit.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Colonne de gauche : Images */}
        <div className="space-y-4">
          {/* Image principale */}
          <div className="aspect-square relative rounded-lg overflow-hidden border bg-white">
            <Image
              src={mainImageUrl}
              alt={productName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2"
              priority
            />
          </div>

          {/* Galerie d'images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((imageUrl, index) => (
                <button
                  key={index}
                  className={`aspect-square relative rounded border overflow-hidden ${
                    imageUrl === selectedImage ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <Image
                    src={imageUrl}
                    alt={`${productName} - Vue ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Colonne de droite : Informations produit */}
        <div className="space-y-6">
          {/* Marque */}
          {product.brand && (
            <div className="mb-2">
              <p className="text-sm font-medium uppercase text-gray-500">{product.brand}</p>
            </div>
          )}

          {/* Nom du produit */}
          <h1 className="text-3xl font-bold">{productName}</h1>

          {/* Référence */}
          <div className="flex items-center">
            <p className="text-sm text-gray-500">
              Réf: {product.catalogReference || product.sku || identifier}
            </p>
          </div>

          {/* Prix */}
          {price !== null && (
            <div className="text-2xl font-bold">
              {typeof price === "number" ? `${price.toFixed(2)} €` : price}
              <span className="text-sm text-gray-500 ml-2">HT</span>
            </div>
          )}

          {/* Description courte */}
          <div className="prose max-w-none text-gray-600">
            <p>{productDescription.split(".")[0]}.</p>
          </div>

          {/* Sélection de couleur */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <p className="font-medium">
                Couleur:{" "}
                {selectedColor
                  ? colors.find((c) => c.code === selectedColor)?.name || selectedColor
                  : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full transition-all border ${
                      selectedColor === color.code
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "ring-1 ring-gray-200"
                    }`}
                    style={{ backgroundColor: color.hexaCode ? `#${color.hexaCode}` : "#ccc" }}
                    title={color.name || `Couleur ${index + 1}`}
                    onClick={() => setSelectedColor(color.code)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sélection de taille */}
          {sizes.length > 0 && (
            <div className="space-y-3">
              <p className="font-medium">Taille</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`h-10 min-w-16 px-3 border rounded-md transition-all ${
                      selectedSize === size.code
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-800 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedSize(size.code)}
                  >
                    {size.name || size.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sélection de quantité */}
          <div className="space-y-3">
            <p className="font-medium">Quantité</p>
            <div className="flex items-center">
              <button
                className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center"
                onClick={decrementQuantity}
              >
                -
              </button>
              <input
                type="number"
                className="h-10 w-16 text-center border-t border-b border-gray-300"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
              />
              <button
                className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center"
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="flex-1 h-12"
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize}
            >
              Ajouter au panier
            </Button>
            <Button variant="outline" className="flex-1 h-12">
              Demander un devis
            </Button>
          </div>

          {/* Informations supplémentaires */}
          <div className="pt-6">
            <Tabs defaultValue="description">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="technical">Infos techniques</TabsTrigger>
                <TabsTrigger value="sizes">Guide des tailles</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="prose max-w-none pt-4">
                <p className="whitespace-pre-line">{productDescription}</p>
              </TabsContent>
              <TabsContent value="technical" className="pt-4">
                <div className="space-y-3">
                  {productComposition && (
                    <div>
                      <p className="font-medium">Composition:</p>
                      <p>{productComposition}</p>
                    </div>
                  )}

                  {product.weight && (
                    <div>
                      <p className="font-medium">Poids:</p>
                      <p>{product.weight}</p>
                    </div>
                  )}

                  {product.labelType && (
                    <div>
                      <p className="font-medium">Type d'étiquette:</p>
                      <p>{product.labelType}</p>
                    </div>
                  )}

                  {/* Caractéristiques supplémentaires si disponibles */}
                  {product.style && (
                    <div>
                      <p className="font-medium">Style:</p>
                      <p>
                        {Array.isArray(product.style)
                          ? typeof product.style[0] === "object"
                            ? product.style[0].fr || product.style[0].en || ""
                            : product.style[0]
                          : product.style}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="sizes" className="pt-4">
                <p>Guide des tailles à venir</p>
                {/* Vous pourriez ajouter un tableau des tailles ici */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 8).map((relatedProduct, index) => (
              <div key={relatedProduct.sku || index} className="group">
                <Link href={`/produits/${relatedProduct.sku || relatedProduct.catalogReference}`}>
                  <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 mb-3">
                    <Image
                      src={relatedProduct.mainImage || "/images/product-placeholder.jpg"}
                      alt={
                        typeof relatedProduct.designation === "object"
                          ? relatedProduct.designation.fr ||
                            relatedProduct.designation.en ||
                            "Produit similaire"
                          : relatedProduct.designation || "Produit similaire"
                      }
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2">
                    {typeof relatedProduct.designation === "object"
                      ? relatedProduct.designation.fr ||
                        relatedProduct.designation.en ||
                        "Produit similaire"
                      : relatedProduct.designation || "Produit similaire"}
                  </h3>
                  {relatedProduct.price || relatedProduct.publicPrice ? (
                    <p className="mt-1 text-sm font-bold">
                      {typeof (relatedProduct.price || relatedProduct.publicPrice) === "number"
                        ? `${(relatedProduct.price || relatedProduct.publicPrice).toFixed(2)} €`
                        : relatedProduct.price || relatedProduct.publicPrice}
                    </p>
                  ) : null}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
