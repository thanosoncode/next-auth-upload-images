"use client";

import { useState } from "react";

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const App = () => {
  const [previewItems, setPreviewItems] = useState<
    { file: File; id: number; preview: string }[]
  >([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const promises = Array.from(files).map((f) => readFileAsDataUrl(f));
    const previews = await Promise.all(promises);
    const items = Array.from(files).map((file, i) => ({
      file,
      id: i,
      preview: previews[i],
    }));
    setPreviewItems(items);
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
    console.log(id);
    setPreviewItems(previewItems.filter((item) => item.id !== id));
  };

  const handleUpload = () => {};
  return (
    <div className="flex flex-col gap-10 rounded p-4 border border-neutral-400">
      <h1 className="text-lg mb-4">upload your images</h1>
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
            : null}
        </div>
        <input
          type="file"
          multiple
          onChange={handleInputChange}
          accept={imageMimeTypes.join(", ")}
        />
      </div>
      <button
        onClick={handleUpload}
        className="w-min self-start border border-neutral-400 rounded px-2.5 py-1.5"
      >
        upload
      </button>
    </div>
  );
};
export default App;
