import { CountryCode } from "libphonenumber-js";

export type UploadImageBody = FormData

export type UploadImageResponse = {
  imageUrl: string;
  message: string
};

export type UploadImage = (body: UploadImageBody) => Promise<UploadImageResponse>;


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
