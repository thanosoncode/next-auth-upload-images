"use client";

import { useRef, useState } from "react";
import { ref } from "firebase/storage";
import { storage } from "../utils/firebaseConfig";
import { uploadFile } from "../utils/helpers";
import Image from "next/image";
import { usePreviewImages } from "./usePreviewImages";

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const UploadImages = ({
  onUploadComplete,
}: {
  onUploadComplete: () => void;
}) => {
  const [previewItems, setPreviewItems] = useState<
    { file: File; id: number; data: string }[]
  >([]);
  const [imagesFiles, setImageFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isLoadingPreviews, error, isError, items } = usePreviewImages({
    imageTypes: imageMimeTypes,
    ref: inputRef,
    onSucess: (items) => setPreviewItems(items),
  });

  const handlePreviewImageClick = (id: number) => {
    setPreviewItems(previewItems.filter((item) => item.id !== id));
  };

  const handleUpload = async () => {
    if (!imagesFiles) return;
    try {
      setIsUploading(true);
      const uploadPromises = Array.from(imagesFiles).map(async (file) => {
        const imagesRef = ref(storage, `images/${file.name}`);
        return await uploadFile({ imagesRef, file });
      });
      await Promise.all(uploadPromises);

      setPreviewItems([]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setImageFiles(null);
      setIsUploading(false);
      onUploadComplete();
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 rounded p-4 border border-neutral-400">
        <p>
          {isUploading
            ? "uploading... this might take a few seconds"
            : "Upload more"}
        </p>
        <div>
          <div className="flex gap-4 mb-4 flex-wrap">
            {isLoadingPreviews
              ? "previewing images..."
              : previewItems?.length > 0
              ? previewItems.map((item) => (
                  <div className="w-16 h-16 relative" key={item.id}>
                    <Image
                      fill
                      src={item.data}
                      alt=""
                      onClick={() => handlePreviewImageClick(item.id)}
                    />
                  </div>
                ))
              : null}
          </div>
          <input
            type="file"
            multiple
            // accept={imageMimeTypes.join(", ")}
            ref={inputRef}
          />
        </div>
        <button
          onClick={handleUpload}
          className="w-min self-start border border-neutral-400 rounded px-2.5 py-1.5"
          disabled={isUploading}
        >
          upload
        </button>
      </div>
    </div>
  );
};
export default UploadImages;
