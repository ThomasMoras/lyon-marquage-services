import { PageSectionType } from "./commonTypes";

export interface Section {
  id: string;
  title?: string;
  content?: string;
  description?: string;
  image?: string;
  imageLeft?: boolean;
}

export interface EditableSectionCardProps {
  pageSection: PageSectionType;
  section: Section;
  isAdmin?: boolean;
  onSave: (updated: Section) => Promise<void>;
}
