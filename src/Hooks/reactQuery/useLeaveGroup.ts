import { useMutation } from '@tanstack/react-query';

import { leaveGroup } from '../../Utils/firebase';
import { Contact, ContactWithAccount } from '../../Types/dataType';
import { LeaveGroupPayload } from '../../Types/firebaseTypes';

export const useLeaveGroup = () => {
  return useMutation({
    mutationFn: (payload: LeaveGroupPayload) => leaveGroup(payload),
  });
};
