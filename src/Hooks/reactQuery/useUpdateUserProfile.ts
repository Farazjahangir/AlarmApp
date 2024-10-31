import { useMutation } from "@tanstack/react-query";

import { updateUserProfile } from "../../Utils/firebase";
import { UpdateUserProfilePayload } from "../../Types/firebaseTypes";

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: ({ data, uid }: { data: UpdateUserProfilePayload; uid: string }) => updateUserProfile(data, uid),  });
};
