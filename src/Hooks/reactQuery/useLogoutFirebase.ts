import { useMutation } from '@tanstack/react-query';

import { logoutFirebase } from '../../Utils/firebase';

export const useLogoutFirebase = () => {
  return useMutation({
    mutationFn: () => logoutFirebase(),
  });
};
