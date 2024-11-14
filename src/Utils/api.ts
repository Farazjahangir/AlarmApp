import axiosReq, { processAxiosResponse } from '../Config/axios';
import { CLOUDNARY_UPLOAD_URL } from '../Constants';

import {
  UploadFile,
  UploadFileResponse,
  CreateUser,
  CreateUserResponse,
  RingAlarm,
  RingAlarmResponse,
  GenerateFileUploadUrl,
  GenerateFileUploadUrlResponse
} from '../Types/apiTypes';

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

export const generateFileUploadUrl: GenerateFileUploadUrl = async (body) => {
  return processAxiosResponse(
    axiosReq.post<GenerateFileUploadUrlResponse>(`upload/url`, body),
  );
}

export const uploadFile: UploadFile = async body => {
  const data = await generateFileUploadUrl({ folder: body.folder })
  const formData = new FormData();
  (Object.keys(data.data) as Array<keyof typeof data.data>).forEach((key) => {
    formData.append(key, data.data[key]);
  });
  formData.append('file', {
    uri: body.file.uri, // Replace with the actual file URI
    type: body.file.type, // Set the MIME type for the file
    name: body.file.name // Fi
  })
  return processAxiosResponse(
    axiosReq.post<UploadFileResponse>(CLOUDNARY_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),
  );
};
