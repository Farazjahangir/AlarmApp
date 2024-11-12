import axiosReq, {processAxiosResponse} from '../Config/axios';

import {
  UploadImage,
  UploadImageResponse,
  CreateUser,
  CreateUserResponse,
  RingAlarm,
  RingAlarmResponse,
} from '../Types/apiTypes';

export const uploadImage: UploadImage = async body => {
  return processAxiosResponse(
    axiosReq.post<UploadImageResponse>(`image/upload`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

export const createUser: CreateUser = async body => {
  return processAxiosResponse(
    axiosReq.post<CreateUserResponse>(`user/create`, body),
  );
};

export const ringAlarm: RingAlarm = async body => {
  return processAxiosResponse(
    axiosReq.post<RingAlarmResponse>(`send-notifications`, body),
  );
};
