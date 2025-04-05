// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Pencil,
//   Check,
//   X,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   X as Close,
//   Move,
//   ZoomIn,
//   ZoomOut,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";
// import { ImageSelector } from "../ImageSelector";
// import { CardItem, EditableCardProps } from "@/types/cardTypes";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import React from "react";

// // Interface pour la position et le cadre de l'image
// interface ImageCropOptions {
//   scale: number;
//   position: {
//     x: number;
//     y: number;
//   };
// }

// export function EditableCard({
//   card,
//   onSave,
//   onDelete,
//   type,
//   isAdmin = false,
//   isNewCard = false,
//   allCards = [],
//   onNavigate = () => {},
// }: EditableCardProps & {
//   allCards?: CardItem[];
//   onNavigate?: (cardId: string) => void;
//   chevronOffset?: number;
// }) {
//   const [isEditing, setIsEditing] = useState(isNewCard);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [editedCard, setEditedCard] = useState<CardItem>(structuredClone(card));
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageRect, setImageRect] = useState<DOMRect | null>(null);
//   const imageRef = useRef<HTMLImageElement>(null);

//   // États pour le mode crop
//   const [showCropMode, setShowCropMode] = useState(false);
//   const [cropOptions, setCropOptions] = useState<ImageCropOptions>({
//     scale: card.cropOptions?.scale || 1,
//     position: card.cropOptions?.position || { x: 0, y: 0 },
//   });

//   // Références pour la manipulation de l'image
//   const cropperRef = useRef<HTMLDivElement>(null);
//   const cropImageRef = useRef<HTMLImageElement>(null);
//   const cropFrameRef = useRef<HTMLDivElement>(null);
//   const isDraggingRef = useRef(false);
//   const startDragPosRef = useRef({ x: 0, y: 0 });
//   const startCropPosRef = useRef({ x: 0, y: 0 });

//   // Nouvelle variable d'état pour le mode visualisation
//   const [visualCards, setVisualCards] = useState<CardItem[]>([]);
//   const [visualCurrentCard, setVisualCurrentCard] = useState<CardItem | null>(null);

//   // Constantes pour les limites de zoom
//   const MIN_ZOOM = 0.5; // Dézoom plus important (50% de la taille originale)
//   const MAX_ZOOM = 3.0; // Zoom jusqu'à 3x la taille originale (augmenté pour plus de flexibilité)
//   const ZOOM_STEP = 0.1; // Pas de zoom

//   // Gestion des raccourcis clavier
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!isExpanded) return;

//       if (e.key === "Escape") {
//         setIsExpanded(false);
//         document.body.style.overflow = "auto";
//       } else if (e.key === "ArrowRight") {
//         navigateToCard("next");
//       } else if (e.key === "ArrowLeft") {
//         navigateToCard("prev");
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isExpanded, currentIndex]);

//   // Initialiser l'état visuel quand on ouvre le modal
//   useEffect(() => {
//     if (isExpanded) {
//       // Créer des copies profondes pour isoler l'état visuel
//       try {
//         const cards = JSON.parse(JSON.stringify(allCards));
//         setVisualCards(cards);

//         const index = cards.findIndex((c: CardItem) => c.id === card.id);
//         if (index !== -1) {
//           setCurrentIndex(index);
//           setVisualCurrentCard(cards[index]);
//         }
//       } catch (error) {
//         console.error("Erreur lors de l'initialisation de l'état visuel:", error);
//       }
//     }
//   }, [isExpanded, card.id, allCards]);

//   // Mettre à jour editedCard quand card change (hors du mode visualisation)
//   useEffect(() => {
//     if (!isExpanded) {
//       try {
//         const cardClone = JSON.parse(JSON.stringify(card));
//         setEditedCard(cardClone);

//         // Initialiser les options de crop si disponibles
//         if (card.cropOptions) {
//           setCropOptions(card.cropOptions);
//         } else {
//           setCropOptions({
//             scale: 1,
//             position: { x: 0, y: 0 },
//           });
//         }
//       } catch (error) {
//         console.error("Erreur lors de la copie de la carte:", error);
//         // Fallback
//         setEditedCard({ ...card });
//       }

//       // Trouver l'index correct dans la collection
//       if (allCards && allCards.length > 0) {
//         const index = allCards.findIndex((c) => c.id === card.id);
//         if (index !== -1) {
//           setCurrentIndex(index);
//         }
//       }
//     }
//   }, [card, allCards, isExpanded]);

//   const handleSave = async () => {
//     // Sauvegarder également les options de crop
//     const updatedCard = {
//       ...editedCard,
//       cropOptions: cropOptions,
//     };
//     await onSave(updatedCard);
//     setIsEditing(false);
//   };

//   const handleDelete = async () => {
//     if (onDelete) {
//       await onDelete(card.id);
//     }
//   };

//   const toggleExpand = (e: React.MouseEvent) => {
//     e.stopPropagation();

//     // Empêcher le scroll de la page quand l'image est agrandie
//     if (!isExpanded) {
//       document.body.style.overflow = "hidden";
//       setIsExpanded(true);
//       setImageRect(null);

//       // Initialiser l'état visuel ici aussi par sécurité
//       try {
//         const cards = JSON.parse(JSON.stringify(allCards));
//         setVisualCards(cards);

//         const index = cards.findIndex((c: CardItem) => c.id === card.id);
//         if (index !== -1) {
//           setCurrentIndex(index);
//           setVisualCurrentCard(cards[index]);
//         }
//       } catch (error) {
//         console.error("Erreur lors de l'initialisation de l'état visuel:", error);
//       }
//     } else {
//       document.body.style.overflow = "auto";
//       setIsExpanded(false);

//       // Réinitialiser l'état visuel
//       setVisualCurrentCard(null);
//       setVisualCards([]);
//     }
//   };

//   useEffect(() => {
//     const updateImageRect = () => {
//       if (isExpanded && imageRef.current) {
//         setTimeout(() => {
//           if (imageRef.current) {
//             const rect = imageRef.current.getBoundingClientRect();
//             setImageRect(rect);
//           }
//         }, 150);
//       }
//     };

//     if (isExpanded) {
//       updateImageRect();
//       window.addEventListener("resize", updateImageRect);
//       return () => {
//         window.removeEventListener("resize", updateImageRect);
//       };
//     }
//   }, [isExpanded, visualCurrentCard]);

//   const navigateToCard = (direction: "next" | "prev") => {
//     if (!visualCards || visualCards.length <= 1) return;

//     let newIndex = currentIndex;
//     if (direction === "next") {
//       newIndex = (currentIndex + 1) % visualCards.length;
//     } else {
//       newIndex = (currentIndex - 1 + visualCards.length) % visualCards.length;
//     }

//     // Informer le parent du changement pour le logging uniquement
//     if (visualCards[newIndex]) {
//       onNavigate(visualCards[newIndex].id);
//       setCurrentIndex(newIndex);
//       setVisualCurrentCard(visualCards[newIndex]);
//     }
//   };

//   // Calculer les limites de position en fonction du zoom et des dimensions
//   // Cette fonction calcule jusqu'où l'image peut être déplacée à un niveau de zoom donné
//   const calculatePositionLimits = () => {
//     if (!cropperRef.current || !cropImageRef.current) {
//       return { maxX: 50, maxY: 50 }; // Valeurs par défaut
//     }

//     const containerRect = cropperRef.current.getBoundingClientRect();

//     // On utilise les dimensions naturelles de l'image
//     // Ces valeurs représentent la taille réelle de l'image
//     const naturalWidth = cropImageRef.current.naturalWidth;
//     const naturalHeight = cropImageRef.current.naturalHeight;

//     // Calculer le ratio de l'image par rapport au conteneur
//     const containerRatio = containerRect.width / containerRect.height;
//     const imageRatio = naturalWidth / naturalHeight;

//     // Déterminer comment l'image s'ajuste naturellement (sans zoom)
//     let baseWidth, baseHeight;
//     if (containerRatio > imageRatio) {
//       // L'image est plus haute que large par rapport au conteneur
//       baseHeight = containerRect.height;
//       baseWidth = baseHeight * imageRatio;
//     } else {
//       // L'image est plus large que haute par rapport au conteneur
//       baseWidth = containerRect.width;
//       baseHeight = baseWidth / imageRatio;
//     }

//     // Calculer les dimensions effectives avec le zoom appliqué
//     const effectiveWidth = baseWidth * cropOptions.scale;
//     const effectiveHeight = baseHeight * cropOptions.scale;

//     // Calculer de combien l'image peut être déplacée dans chaque direction
//     // Formule: (dimension_avec_zoom - dimension_du_conteneur) / 2 / dimension_du_conteneur * 100
//     const horizontalOverflow = Math.max(0, (effectiveWidth - containerRect.width) / 2);
//     const verticalOverflow = Math.max(0, (effectiveHeight - containerRect.height) / 2);

//     // Convertir en pourcentage du conteneur pour la propriété objectPosition
//     const maxX = (horizontalOverflow / containerRect.width) * 100;
//     const maxY = (verticalOverflow / containerRect.height) * 100;

//     return { maxX, maxY };
//   };

//   // Fonction pour déplacer l'image dans une direction
//   const moveImage = (direction: "up" | "down" | "left" | "right") => {
//     if (!cropperRef.current || !cropImageRef.current) return;

//     // Déterminer le pourcentage de déplacement
//     const movePercentage = 5; // 5% de déplacement à chaque clic (réduit pour plus de précision)

//     // Calculer les nouvelles positions
//     let newX = cropOptions.position.x;
//     let newY = cropOptions.position.y;

//     switch (direction) {
//       case "up":
//         newY = cropOptions.position.y - movePercentage; // Inversé pour une logique plus intuitive
//         break;
//       case "down":
//         newY = cropOptions.position.y + movePercentage; // Inversé pour une logique plus intuitive
//         break;
//       case "left":
//         newX = cropOptions.position.x - movePercentage; // Inversé pour une logique plus intuitive
//         break;
//       case "right":
//         newX = cropOptions.position.x + movePercentage; // Inversé pour une logique plus intuitive
//         break;
//     }

//     // Calculer et appliquer les limites
//     const { maxX, maxY } = calculatePositionLimits();

//     newX = Math.min(maxX, Math.max(-maxX, newX));
//     newY = Math.min(maxY, Math.max(-maxY, newY));

//     setCropOptions({
//       ...cropOptions,
//       position: { x: newX, y: newY },
//     });
//   };

//   // Fonction pour réinitialiser le cadrage
//   const resetCrop = () => {
//     setCropOptions({
//       scale: 1,
//       position: { x: 0, y: 0 },
//     });
//   };

//   // Setup les gestionnaires d'événements pour le mode crop
//   useEffect(() => {
//     if (!showCropMode) return;

//     const handleMouseDown = (e: MouseEvent) => {
//       if (!cropFrameRef.current) return;

//       // Vérifier si le clic est sur le cadre
//       const frameRect = cropFrameRef.current.getBoundingClientRect();
//       const isInFrame =
//         e.clientX >= frameRect.left &&
//         e.clientX <= frameRect.right &&
//         e.clientY >= frameRect.top &&
//         e.clientY <= frameRect.bottom;

//       if (isInFrame) {
//         isDraggingRef.current = true;
//         startDragPosRef.current = { x: e.clientX, y: e.clientY };
//         startCropPosRef.current = { ...cropOptions.position };
//         e.preventDefault();
//       }
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDraggingRef.current || !cropImageRef.current || !cropperRef.current) return;

//       // Calculer le déplacement en pixels
//       const deltaX = e.clientX - startDragPosRef.current.x;
//       const deltaY = e.clientY - startDragPosRef.current.y;

//       // Obtenir les dimensions du conteneur
//       const containerRect = cropperRef.current.getBoundingClientRect();

//       // Convertir le déplacement en pourcentage par rapport au conteneur
//       const moveXPercent = (deltaX / containerRect.width) * 100;
//       const moveYPercent = (deltaY / containerRect.height) * 100;

//       // Calculer les nouvelles positions (inverser pour que le déplacement soit intuitif)
//       const newX = startCropPosRef.current.x - moveXPercent;
//       const newY = startCropPosRef.current.y - moveYPercent;

//       // Appliquer les limites
//       const { maxX, maxY } = calculatePositionLimits();

//       setCropOptions({
//         ...cropOptions,
//         position: {
//           x: Math.min(maxX, Math.max(-maxX, newX)),
//           y: Math.min(maxY, Math.max(-maxY, newY)),
//         },
//       });
//     };

//     const handleMouseUp = () => {
//       isDraggingRef.current = false;
//     };

//     const handleWheel = (e: WheelEvent) => {
//       if (!cropperRef.current) return;

//       // Zoom avec la molette de la souris
//       e.preventDefault();

//       const delta = -Math.sign(e.deltaY) * ZOOM_STEP;
//       const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cropOptions.scale + delta));

//       setCropOptions({
//         ...cropOptions,
//         scale: newScale,
//       });
//     };

//     document.addEventListener("mousedown", handleMouseDown);
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);

//     // Ajouter l'événement de molette au conteneur de crop
//     const cropperElement = cropperRef.current;
//     if (cropperElement) {
//       cropperElement.addEventListener("wheel", handleWheel, { passive: false });
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleMouseDown);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);

//       if (cropperElement) {
//         cropperElement.removeEventListener("wheel", handleWheel);
//       }
//     };
//   }, [showCropMode, cropOptions]);

//   // Déterminer quelle carte afficher dans le modal
//   const cardToShow = isExpanded && visualCurrentCard ? visualCurrentCard : editedCard;

//   // Fonction pour générer les styles CSS pour l'image croppée
//   const getCropStyles = () => {
//     if (!editedCard.cropOptions && !cropOptions) {
//       return {
//         objectFit: "cover" as const,
//         width: "100%",
//         height: "100%",
//       };
//     }

//     const options = editedCard.cropOptions || cropOptions;

//     return {
//       // Nous utilisons objectFit "cover" pour l'aperçu final car c'est ce que nous voulons pour la carte
//       // mais en mode édition nous utilisons "contain" pour voir toute l'image
//       objectFit: "cover" as const,
//       width: "100%",
//       height: "100%",
//       transform: `scale(${options.scale})`,
//       objectPosition: `calc(50% + ${options.position.x}%) calc(50% + ${options.position.y}%)`,
//     };
//   };

//   return (
//     <div className="relative">
//       <Card
//         className={`w-full max-w-sm transition-all duration-300 overflow-hidden ${
//           isExpanded ? "z-10" : ""
//         }`}
//       >
//         <div className="relative w-full h-full">
//           {isEditing ? (
//             <CardContent className="p-4">
//               <Input
//                 value={editedCard.title || ""}
//                 onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
//                 className="mb-4"
//                 placeholder="Title (optional)"
//               />
//               <Textarea
//                 value={editedCard.description || ""}
//                 onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
//                 className="mb-4"
//                 placeholder="Description (optional)"
//               />

//               {/* Mode normal ou mode de cadrage/crop */}
//               {!showCropMode ? (
//                 <>
//                   <div className="mb-4">
//                     <ImageSelector
//                       folder={`images/${type}`}
//                       currentImage={editedCard.imageUrl || ""}
//                       onSelect={(imagePath) => {
//                         setEditedCard({ ...editedCard, imageUrl: imagePath });
//                         // Réinitialiser les options de crop pour une nouvelle image
//                         resetCrop();
//                       }}
//                       disabled={false}
//                     />
//                   </div>

//                   {editedCard.imageUrl && (
//                     <div className="flex justify-center mb-4">
//                       <Button
//                         variant="outline"
//                         onClick={() => setShowCropMode(true)}
//                         className="flex items-center gap-2"
//                       >
//                         <Move className="w-4 h-4" />
//                         Ajuster le cadrage
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="mb-4 space-y-4">
//                   <div className="flex justify-between items-center">
//                     <div className="text-sm font-medium">Mode de cadrage</div>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" onClick={resetCrop}>
//                         Réinitialiser
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={() => setShowCropMode(false)}>
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Contrôles de zoom */}
//                   <div className="flex justify-center gap-4 mb-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setCropOptions({
//                           ...cropOptions,
//                           scale: Math.max(MIN_ZOOM, cropOptions.scale - ZOOM_STEP),
//                         });
//                       }}
//                     >
//                       <ZoomOut className="w-4 h-4" />
//                     </Button>
//                     <div className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
//                       {Math.round(cropOptions.scale * 100)}%
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setCropOptions({
//                           ...cropOptions,
//                           scale: Math.min(MAX_ZOOM, cropOptions.scale + ZOOM_STEP),
//                         });
//                       }}
//                     >
//                       <ZoomIn className="w-4 h-4" />
//                     </Button>
//                   </div>

//                   {/* Contrôles directionnels */}
//                   <div className="grid grid-cols-3 gap-2 place-items-center mb-2">
//                     <div></div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => moveImage("up")}
//                       className="p-2 h-8 w-8"
//                     >
//                       <ChevronUp className="w-4 h-4" />
//                     </Button>
//                     <div></div>

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => moveImage("left")}
//                       className="p-2 h-8 w-8"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </Button>
//                     <div className="text-xs text-gray-500">Position</div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => moveImage("right")}
//                       className="p-2 h-8 w-8"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </Button>

//                     <div></div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => moveImage("down")}
//                       className="p-2 h-8 w-8"
//                     >
//                       <ChevronDown className="w-4 h-4" />
//                     </Button>
//                     <div></div>
//                   </div>

//                   {/* Conteneur de l'image avec cadre de sélection */}
//                   <div
//                     ref={cropperRef}
//                     className="h-64 bg-black/10 relative overflow-hidden border rounded-lg"
//                     style={{ cursor: isDraggingRef.current ? "grabbing" : "grab" }}
//                   >
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <img
//                         ref={cropImageRef}
//                         src={editedCard.imageUrl || "/api/placeholder/400/400"}
//                         alt="Image à cadrer"
//                         className="max-w-full max-h-full transition-all duration-200"
//                         style={{
//                           // Nous utilisons objectFit "contain" pour voir l'image complète
//                           // puis nous appliquons le zoom avec scale
//                           objectFit: "contain",
//                           transformOrigin: "center",
//                           transform: `scale(${cropOptions.scale})`,
//                           objectPosition: `calc(50% + ${cropOptions.position.x}%) calc(50% + ${cropOptions.position.y}%)`,
//                         }}
//                         draggable="false"
//                         onLoad={() => {
//                           // Réajuster les limites quand l'image est chargée
//                           if (cropImageRef.current && cropperRef.current) {
//                             console.log("Image chargée - dimensions naturelles:", {
//                               width: cropImageRef.current.naturalWidth,
//                               height: cropImageRef.current.naturalHeight,
//                             });

//                             // Bref délai pour permettre au navigateur de calculer les dimensions
//                             setTimeout(() => {
//                               // Réinitialiser le crop si c'est une nouvelle image
//                               if (
//                                 cropOptions.scale === 1 &&
//                                 cropOptions.position.x === 0 &&
//                                 cropOptions.position.y === 0
//                               ) {
//                                 resetCrop();
//                               } else {
//                                 // Force la mise à jour des cropOptions pour réappliquer les limites
//                                 setCropOptions({ ...cropOptions });
//                               }
//                             }, 100);
//                           }
//                         }}
//                       />
//                     </div>

//                     {/* Cadre de sélection - représente la zone visible finale */}
//                     <div
//                       ref={cropFrameRef}
//                       className="absolute inset-0 border-2 border-primary pointer-events-none"
//                     />

//                     {/* Instructions */}
//                     <div className="absolute bottom-2 left-0 right-0 text-center text-xs bg-black/50 text-white p-1 pointer-events-none">
//                       Déplacez l'image pour ajuster le cadrage • Utilisez la molette pour zoomer
//                     </div>
//                   </div>

//                   {/* Aperçu du résultat */}
//                   <div>
//                     <div className="text-sm font-medium mb-2">Aperçu</div>
//                     <div className="border rounded-lg overflow-hidden h-32">
//                       <div className="w-full h-full relative">
//                         <img
//                           src={editedCard.imageUrl || "/api/placeholder/400/400"}
//                           alt="Aperçu du cadrage"
//                           className="absolute w-full h-full object-cover"
//                           style={{
//                             // Ici on applique les mêmes transformations qu'en mode édition
//                             // mais avec "cover" pour simuler l'affichage final
//                             objectFit: "cover",
//                             transform: `scale(${cropOptions.scale})`,
//                             transformOrigin: "center",
//                             objectPosition: `calc(50% + ${cropOptions.position.x}%) calc(50% + ${cropOptions.position.y}%)`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-2">
//                 <Button onClick={handleSave} size="sm">
//                   <Check className="w-4 h-4 mr-1" /> Save
//                 </Button>
//                 <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
//                   <X className="w-4 h-4 mr-1" /> Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           ) : (
//             <div className="w-full h-full">
//               <div className="cursor-pointer overflow-hidden" onClick={toggleExpand}>
//                 <div className="w-full h-64 relative">
//                   <img
//                     src={editedCard.imageUrl || "/api/placeholder/400/400"}
//                     alt="Card image"
//                     className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
//                     style={getCropStyles()}
//                   />
//                 </div>
//               </div>

//               {isAdmin && (
//                 <div className="absolute bottom-2 right-2 flex gap-2">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         onClick={(e) => e.stopPropagation()}
//                         variant="outline"
//                         size="sm"
//                         className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent onClick={(e) => e.stopPropagation()}>
//                       <DialogHeader>
//                         <DialogTitle>Confirm Deletion</DialogTitle>
//                         <DialogDescription>
//                           Are you sure you want to delete this card? This action cannot be undone.
//                         </DialogDescription>
//                       </DialogHeader>
//                       <DialogFooter>
//                         <Button variant="outline" onClick={(e) => e.stopPropagation()}>
//                           Cancel
//                         </Button>
//                         <Button variant="destructive" onClick={handleDelete}>
//                           Delete
//                         </Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>

//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsEditing(true);
//                     }}
//                     variant="outline"
//                     size="sm"
//                     className="bg-white/80 hover:bg-white"
//                   >
//                     <Pencil className="w-4 h-4" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Modal pour l'image agrandie avec navigation */}
//       {isExpanded && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300"
//           onClick={toggleExpand}
//         >
//           {/* Conteneur principal qui regroupe l'image et les chevrons */}
//           <div
//             className="relative flex items-center justify-center w-full max-w-7xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Conteneur de l'image */}
//             <div className="relative max-w-5xl max-h-screen transition-transform duration-300 transform scale-100 animate-in fade-in">
//               <Button
//                 onClick={toggleExpand}
//                 variant="outline"
//                 size="sm"
//                 className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-2 h-8 w-8"
//               >
//                 <Close className="w-4 h-4" />
//               </Button>

//               <img
//                 ref={imageRef}
//                 src={
//                   visualCurrentCard?.imageUrl || cardToShow.imageUrl || "/api/placeholder/800/800"
//                 }
//                 alt="Card image expanded"
//                 className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
//                 onLoad={() => {
//                   if (imageRef.current) {
//                     setTimeout(() => {
//                       if (imageRef.current) {
//                         const rect = imageRef.current.getBoundingClientRect();
//                         setImageRect(rect);
//                       }
//                     }, 50);
//                   }
//                 }}
//               />

//               {(visualCurrentCard?.title || cardToShow.title) && (
//                 <div className="absolute bottom-0 left-0 right-0 text-center bg-black/50 p-2 text-white rounded-b-md">
//                   <h3 className="font-semibold">{visualCurrentCard?.title || cardToShow.title}</h3>
//                   {(visualCurrentCard?.description || cardToShow.description) && (
//                     <p className="text-sm mt-1">
//                       {visualCurrentCard?.description || cardToShow.description}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Flèches de navigation positionnées relativement à l'image */}
//             {visualCards && visualCards.length > 1 && (
//               <>
//                 <Button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigateToCard("prev");
//                   }}
//                   variant="outline"
//                   size="icon"
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 h-12 w-12 shadow-md z-20"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </Button>

//                 <Button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigateToCard("next");
//                   }}
//                   variant="outline"
//                   size="icon"
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 h-12 w-12 shadow-md z-20"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
