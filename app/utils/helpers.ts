import {
  StorageReference,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

export const uploadFile = async ({
  imagesRef,
  file,
}: {
  imagesRef: StorageReference;
  file: File;
}) => {
  try {
    const uploadResult = await uploadBytes(imagesRef, file);
    const result = await getDownloadURL(uploadResult.ref);
    if (!result) return;
    return result;
  } catch (error) {
    console.log(error);
  }
};
