import { User } from "@prisma/client";
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

export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ message: string; user: User | null }> => {
  const userResponse = await fetch("/api/sign-up", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await userResponse.json();
};
