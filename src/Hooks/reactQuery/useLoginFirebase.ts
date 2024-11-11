import { useMutation } from '@tanstack/react-query';

import { loginFirebase } from '../../Utils/firebase';
import { Contact, ContactWithAccount } from '../../Types/dataType';
import { LoginFirebasePayload } from '../../Types/firebaseTypes';


export const useLoginFirebase = () => {
  return useMutation({
    mutationFn: (payload: LoginFirebasePayload) => loginFirebase(payload),
  });
};
