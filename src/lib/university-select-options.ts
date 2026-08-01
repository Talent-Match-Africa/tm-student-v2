import type {
  UniversityListItem,
  UniversitySelectOption,
} from "@/types/universities";

export function toUniversitySelectOption(
  university: UniversityListItem,
): UniversitySelectOption {
  return {
    email: university.email,
    imageUrl: university.image,
    isActive: university.is_active,
    name: university.school_name?.trim() || "Unnamed university",
    value: university.id,
  };
}

export function toUniversitySelectOptions(
  universities: UniversityListItem[],
): UniversitySelectOption[] {
  return universities.map(toUniversitySelectOption);
}
