import {useMutation} from '@tanstack/react-query';

import {createGroup} from '../../Utils/firebase';
import {Contact, ContactWithAccount} from '../../Types/dataType';
import { uploadImage } from '../../Utils/api';

type SelectedContacts = {
  [phoneNumber: string]: boolean; // Using an index signature
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (image: FormData) => uploadImage(image),
  });
};
