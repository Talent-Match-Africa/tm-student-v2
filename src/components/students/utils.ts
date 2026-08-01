export function resolveStudentProfileImage(
  imageUrl: string | null | undefined,
  gender: string | null | undefined,
): string {
  const normalizedImageUrl = imageUrl?.trim();

  if (normalizedImageUrl) return normalizedImageUrl;

  return gender?.trim().toLowerCase() === "female"
    ? "/404woman.png"
    : "/404man.png";
}
