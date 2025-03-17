import { Suspense } from "react";

export const metadata = {
  title: "Beechfield | Lyon Marquage Service",
  description:
    "Découvrez notre sélection de vêtements Beechfield, reconnus pour leur qualité et leur durabilité",
};

export default function BeechfieldPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Beechfield</h1>
      <p className="mb-8 text-gray-700">
        Découvrez notre collection de vêtements Beechfield, reconnus pour leur qualité et leur
        durabilité.
      </p>

      {/* Add your brand-specific content here */}
    </>
  );
}
