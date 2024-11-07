export type UploadImageBody = FormData
  
  export type UploadImageResponse = {
    imageUrl: string;
    message: string
  };
  
  export type UploadImage = (body: UploadImageBody) => Promise<UploadImageResponse>;
  