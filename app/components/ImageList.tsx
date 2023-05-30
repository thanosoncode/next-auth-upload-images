"use client";

import { useState } from "react";
import ImageItem from "./ImageItem";

const ImageList = ({
  imageUrls,
  paths,
  onDelete,
}: {
  imageUrls: string[];
  paths: string[];
  onDelete: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleting = (deleting: boolean) => setIsDeleting(deleting);

  return (
    <>
      <h1 className="mb-4">{isDeleting ? "Deleting..." : "Your images"}</h1>
      <section className="flex flex-wrap gap-2">
        {imageUrls.map((url, index) => (
          <ImageItem
            key={index}
            url={url}
            path={paths[index]}
            onDelete={onDelete}
            handleDeleting={handleDeleting}
          />
        ))}
      </section>
    </>
  );
};
export default ImageList;
