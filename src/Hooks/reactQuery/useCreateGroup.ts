import { useMutation } from '@tanstack/react-query';

import { createGroup } from '../../Utils/firebase';
import { Contact, ContactWithAccount } from '../../Types/dataType';
import { AddGroupPayload } from '../../Types/firebaseTypes';

type SelectedContacts = {
  [phoneNumber: string]: boolean; // Using an index signature
};

type Payload = {
  contacts: Contact[] | ContactWithAccount[];
  selectedContacts: SelectedContacts;
  groupName: string;
  currentUserUid: string;
  description?: string;
  groupType: string
  image: string
}

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: (payload: Payload) => createGroup(payload),
  });
};
