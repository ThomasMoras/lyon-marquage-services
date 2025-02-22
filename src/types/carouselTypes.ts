import { PageSectionType } from "./commonTypes";

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  type: PageSectionType;
}

export interface EditableCarouselProps {
  pageSection: PageSectionType;
  isAdmin?: boolean;
}
