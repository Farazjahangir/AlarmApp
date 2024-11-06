import {useMutation} from '@tanstack/react-query';

import {createGroup} from '../../Utils/firebase';
import {Contact, ContactWithAccount} from '../../Types/dataType';
import {AddGroupPayload} from '../../Types/firebaseTypes';

type SelectedContacts = {
  [phoneNumber: string]: boolean; // Using an index signature
};

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: ({
      contacts,
      selectedContacts,
      groupName,
      currentUserUid,
    }: {
      contacts: Contact[] | ContactWithAccount[];
      selectedContacts: SelectedContacts;
      groupName: string;
      currentUserUid: string;
    }) => createGroup(contacts, selectedContacts, groupName, currentUserUid),
  });
};
