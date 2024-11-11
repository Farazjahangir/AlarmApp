import axiosReq, { processAxiosResponse } from "../Config/axios";

import { UploadImage, UploadImageResponse, CreateUser, CreateUserResponse } from "../Types/apiTypes";

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
    console.log("createUser ========>", body)
    return processAxiosResponse(
        axiosReq.post<CreateUserResponse>(`user/create`, body),
    );
};