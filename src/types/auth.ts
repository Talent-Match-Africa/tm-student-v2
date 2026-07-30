export type TalentMatchRole =
  "ADMIN" | "STUDENT" | "UNIVERSITY" | "EMPLOYER" | "TRAINER" | "COUNSELOR";

export interface RedirectTarget {
  app: "admin" | "student" | "university" | "employer";
  path: string;
}

export interface AuthTokenPair {
  access: string;
  refresh: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
}

export interface PublicAuthProfile {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  phoneNumber: string | null;
  role: TalentMatchRole;
  image: string | null;
  createdAt: string;
  redirect?: RedirectTarget;
  profile?: {
    type: string;
    displayName: string;
    redirect: RedirectTarget;
    details: Record<string, unknown>;
  };
}
