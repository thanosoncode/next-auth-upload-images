import { listAll, getDownloadURL, StorageReference } from "firebase/storage";
import { useEffect, useState } from "react";

export const useImageUrls = ({
  imagesRef,
  refetch,
}: {
  imagesRef: StorageReference;
  refetch: (string | undefined)[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const getUrls = async () => {
    setIsLoading(true);
    try {
      const response = (await listAll(imagesRef)).items;
      const urlPromises = response.map(async (item) => {
        return await getDownloadURL(item);
      });
      const result = await Promise.all(urlPromises);
      setIsLoading(false);
      setUrls(result);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUrls();
  }, [refetch]);

  return { isLoading, urls };
};
