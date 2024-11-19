import { useMutation } from '@tanstack/react-query';

import { sendForgotPasswordEmail } from '../../Utils/firebase';
import { SendForgotPasswordEmailPayload } from '../../Types/firebaseTypes';


export const useSendForgotPasswordEmail = () => {
  return useMutation({
    mutationFn: (payload: SendForgotPasswordEmailPayload) => sendForgotPasswordEmail(payload),
  });
};
