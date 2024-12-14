import { endpoints } from "@/api/constants";
import { POST_API } from "@/api/request";

export const handleConvertBasedOnContentType = (data: any, fileType: string | undefined) => {
    if (fileType === "image/*") {
        return {
            image_url: data.url,
            image_id: data.image_id,
        };
    } else if (fileType === "video/*") {
        return {
            video_url: data.url,
            video_id: data.image_id,
        };
    } else if (fileType === "application/*") {
        return {
            document_url: data.url,
            document_id: data.image_id,
        };
    }
    return data;
};

export const getFileData = async (file: File) => {
    let formData = new FormData();
    formData.append("image", file);
    const response = await POST_API(endpoints.common("media_uploader"), formData);
    return response.data;
};
