"use client";

import { useRef, useState } from "react";
import { ref } from "firebase/storage";
import { storage } from "../utils/firebaseConfig";
import { uploadFile } from "../utils/helpers";

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const UploadImages = ({
  onUploadComplete,
}: {
  onUploadComplete: () => void;
}) => {
  const [previewItems, setPreviewItems] = useState<
    { file: File; id: number; preview: string }[]
  >([]);
  const [imagesFiles, setImageFiles] = useState<FileList | null>(null);
  const [isPreviewingImages, setIsPreviewImages] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    setIsPreviewImages(true);
    setImageFiles(files);
    const promises = Array.from(files).map((file) => readFileAsDataUrl(file));
    const previews = await Promise.all(promises);
    const items = Array.from(files).map((file, i) => ({
      file,
      id: i,
      preview: previews[i],
    }));
    setPreviewItems(items);
    setIsPreviewImages(false);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  };

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
            {previewItems.length > 0
              ? previewItems.map((item) => (
                  <img
                    key={item.id}
                    src={item.preview}
                    className="w-16 h-16"
                    onClick={() => handlePreviewImageClick(item.id)}
                  />
                ))
              : isPreviewingImages
              ? "previewing images..."
              : null}
          </div>
          <input
            type="file"
            multiple
            onChange={handleInputChange}
            accept={imageMimeTypes.join(", ")}
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
