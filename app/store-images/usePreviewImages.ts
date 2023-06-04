import { RefObject, useEffect, useState } from "react";

type Item = { file: File; id: number; data: string };

const validTypeFiles = (imageTypes: string[], files: FileList | null) => {
  return files !== null
    ? Array.from(files).every((file) => imageTypes.includes(file.type))
    : true;
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

export const usePreviewImages = ({
  imageTypes = [],
  ref,
  onSucess,
  onError,
}: {
  imageTypes?: string[];
  ref?: RefObject<HTMLInputElement>;
  onSucess?: (items: Item[]) => void;
  onError?: (error: any) => void;
}) => {
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<any>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [testFiles, setTestFiles] = useState<FileList | null>(null);

  const getPreviews = async (files: FileList | null) => {
    try {
      if (!files) return;
      setIsLoadingPreviews(true);
      const promises = Array.from(files).map((file) => readFileAsDataUrl(file));
      const previews = await Promise.all(promises);

      const items = Array.from(files).map((file, i) => ({
        file,
        id: i,
        data: previews[i],
      }));

      setIsLoadingPreviews(false);
      setItems(items);
      onSucess && onSucess(items);
    } catch (error: any) {
      setIsLoadingPreviews(false);
      setError(error);
      onError && onError(error);
    }
  };

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.setAttribute("accept", imageTypes.join(", "));
      ref.current.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        setTestFiles(target.files);
      };
    }
    console.log("testfiles changed");
  }, [testFiles]);

  useEffect(() => {
    setIsError(false);
    setError(null);
    if (!validTypeFiles(imageTypes, testFiles)) {
      setIsError(true);
      setError("Invalid Image types");
      onError && onError(error);
    }
    getPreviews(testFiles);
  }, [testFiles, imageTypes]);

  return { isLoadingPreviews, error, items, isError };
};
