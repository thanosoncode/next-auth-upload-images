"use client";

import { ref, deleteObject } from "firebase/storage";
import Image from "next/image";
import { storage } from "../utils/firebaseConfig";

const ImageItem = ({
  path,
  url,
  onDelete,
}: {
  path: string;
  url: string;
  onDelete: () => void;
}) => {
  const handleItemDelete = (path: string) => {
    const itemRef = ref(storage, path);
    deleteObject(itemRef)
      .then(() => {
        onDelete();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="w-24 h-24 relative" onClick={() => handleItemDelete(path)}>
      <Image src={url} fill alt="" />
    </div>
  );
};
export default ImageItem;
