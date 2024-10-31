import { User } from "./dataType";

export type UpdateUserProfilePayload = {
    name?: string;
    address?: string;
    isActive?: boolean;
    isProfileComplete?: boolean;
}


export type UpdateUserProfile = (payload: UpdateUserProfilePayload, uid: string) => Promise<User>;