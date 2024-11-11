import { useMutation } from '@tanstack/react-query';

import { signupFirebase } from '../../Utils/firebase';
import { SignupFirebasePayload } from '../../Types/firebaseTypes';

export const useSignupFirebase = () => {
  return useMutation({
    mutationFn: (payload: SignupFirebasePayload) => signupFirebase(payload),
  });
};
