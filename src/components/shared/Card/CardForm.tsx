// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { CardContent } from "@/components/ui/card";
// import { Check, X } from "lucide-react";
// import { ImageSelector } from "../ImageSelector";
// import { CardFormProps } from "@/types/card";

// export function CardForm({
//   editedCard,
//   setEditedCard,
//   type,
//   resetCrop,
//   handleSave,
//   setIsEditing,
// }: CardFormProps) {
//   const handleImageSelect = (imagePath: string): void => {
//     setEditedCard({ ...editedCard, imageUrl: imagePath });
//     resetCrop();
//   };

//   return (
//     <CardContent className="p-4">
//       <Input
//         value={editedCard.title || ""}
//         onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
//         className="mb-4"
//         placeholder="Title (optional)"
//       />
//       <Textarea
//         value={editedCard.description || ""}
//         onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
//         className="mb-4"
//         placeholder="Description (optional)"
//       />

//       <div className="mb-4">
//         <ImageSelector
//           folder={`images/${type}`}
//           currentImage={editedCard.imageUrl || ""}
//           onSelect={handleImageSelect}
//           disabled={false}
//         />
//       </div>

//       <div className="flex flex-row justify-center gap-2">
//         <Button onClick={handleSave} className="bg-green-600 hover:bg-green-500" size="sm">
//           <Check className="w-4 h-4 mr-1" /> Sauvegarder
//         </Button>
//         <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
//           <X className="w-4 h-4 mr-1" /> Annuler
//         </Button>
//       </div>
//     </CardContent>
//   );
// }
