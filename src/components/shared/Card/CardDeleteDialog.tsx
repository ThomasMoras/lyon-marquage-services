// import { Button } from "@/components/ui/button";
// import { Trash2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { CardDeleteDialogProps } from "@/types/card";

// export function CardDeleteDialog({ onDelete }: CardDeleteDialogProps) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button
//           onClick={(e: React.MouseEvent) => e.stopPropagation()}
//           variant="outline"
//           size="sm"
//           className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
//         >
//           <Trash2 className="w-4 h-4" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
//         <DialogHeader>
//           <DialogTitle>Confirm Deletion</DialogTitle>
//           <DialogDescription>
//             Are you sure you want to delete this card? This action cannot be undone.
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button variant="outline" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
//             Cancel
//           </Button>
//           <Button variant="destructive" onClick={onDelete}>
//             Delete
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
