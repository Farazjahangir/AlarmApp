import {useMutation} from '@tanstack/react-query';

import {createGroup} from '../../Utils/firebase';
import {Contact, ContactWithAccount} from '../../Types/dataType';
import { uploadFile } from '../../Utils/api';
import { UploadFileBody } from '../../Types/apiTypes';


export const useUploadFile = () => {
  return useMutation({
    mutationFn: (image: UploadFileBody) => uploadFile(image),
  });
};
