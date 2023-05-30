"use client";

import { ref, deleteObject } from "firebase/storage";
import Image from "next/image";
import { storage } from "../utils/firebaseConfig";

const ImageItem = ({
  path,
  url,
  onDelete,
  handleDeleting,
}: {
  path: string;
  url: string;
  onDelete: () => void;
  handleDeleting: (loading: boolean) => void;
}) => {
  const handleItemDelete = (path: string) => {
    const itemRef = ref(storage, path);
    handleDeleting(true);
    deleteObject(itemRef)
      .then(() => {
        onDelete();
        handleDeleting(false);
      })
      .catch((error: any) => {
        console.log(error);
        handleDeleting(false);
      });
  };

  return (
    <div className="w-24 h-24 relative" onClick={() => handleItemDelete(path)}>
      <Image
        src={url}
        fill
        alt=""
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8WA8AAmcBcgw8D2oAAAAASUVORK5CYII="
      />
    </div>
  );
};
export default ImageItem;
