import axiosReq, { processAxiosResponse } from "../Config/axios";

import { UploadImage, UploadImageResponse } from "../Types/apiTypes";

export const uploadImage: UploadImage = async body => {
    return processAxiosResponse(
        axiosReq.post<UploadImageResponse>(`image/upload`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
    );
};