import { Role } from "@prisma/client";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  institution: string | null;
  profileImageUrl: string | null;
  role: Role;
};

export type GetUserProfileResponse = {
  success: boolean;
  message: string;
  data: UserProfile | null;
  error?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  message: string;
  error?: string;
  data?: UserProfile;
};
