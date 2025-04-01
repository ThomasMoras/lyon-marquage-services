import { SectionType } from "@prisma/client";

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  type: SectionType;
}

export interface EditableCarouselProps {
  pageSection: SectionType;
  isAdmin?: boolean;
}
