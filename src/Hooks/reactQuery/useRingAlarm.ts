import { useMutation } from '@tanstack/react-query';

import { ringAlarm } from '../../Utils/api';
import { RingAlarmBody } from '../../Types/apiTypes';

export const useRingAlarm = () => {
  return useMutation({
    mutationFn: (payload: RingAlarmBody) => ringAlarm(payload),
  });
};
