import { useMutation } from '@tanstack/react-query';

import { processUpdateGroup } from '../../Utils/firebase';
import { ProcessUpdateGroupPayload } from '../../Types/firebaseTypes';


export const useUpdateGroup = () => {
  return useMutation({
    mutationFn: (payload: ProcessUpdateGroupPayload) => processUpdateGroup(payload),
  });
};
