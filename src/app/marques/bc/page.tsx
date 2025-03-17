
import { Suspense } from "react";

export const metadata = {
  title: "B&C | Lyon Marquage Service",
  description: "Découvrez notre sélection de vêtements B&C, reconnus pour leur qualité et leur durabilité",
};

export default function BcPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">B&C</h1>
      <p className="mb-8 text-gray-700">
        Découvrez notre collection de vêtements B&C, reconnus pour leur qualité et leur durabilité.
      </p>
      
      {/* Add your brand-specific content here */}
    </>
  );
}
