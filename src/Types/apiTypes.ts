import { CountryCode } from "libphonenumber-js";

export type UploadFileBody = {
  file: {
    uri: string,
    name: string,
    type: string,
  },
  folder: string
}

export type UploadFileResponse = {
 asset_id: string,
    public_id: string,
    version: number,
    version_id: string,
    signature: string,
    width: number,
    height: number,
    format: string,
    resource_type: string,
    created_at: string,
    tags: [],
    bytes: number,
    type: string,
    etag: string,
    placeholder: boolean,
    url: string,
    secure_url: string,
    folder: string,
    original_filename: string,
    api_key: number
};

export type UploadFile = (body: UploadFileBody) => Promise<UploadFileResponse>;


export type CreateUserBody = {
  email: string;
  password: string;
  name: string;
  number: string;
  uid: string;
  countryCode: CountryCode
}

export type CreateUserResponse = {
  message: string
};

export type CreateUser = (body: CreateUserBody) => Promise<CreateUserResponse>;

export type RingAlarmBody = {
  tokens: string[];
  payload: {
    name: string,
    coords: {
      latitude: number,
      longitude: number,
    },
  }
}

export type RingAlarmResponse = {
  message: string,
  tokensProcessed: number,
};

export type RingAlarm = (body: RingAlarmBody) => Promise<RingAlarmResponse>;

export type GenerateFileUploadUrlBody = {
  folder: string
}

export type GenerateFileUploadUrlResponse = {
  success: boolean;
  data: {
    api_key: string;
    timestamp: number;
    signature: string;
    folder: string
  },
};

export type GenerateFileUploadUrl = (body: GenerateFileUploadUrlBody) => Promise<GenerateFileUploadUrlResponse>;
