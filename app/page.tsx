import { listAll, getDownloadURL, ref } from "firebase/storage";
import { storage } from "./utils/firebaseConfig";
import UploadImages from "./components/UploadImages";
import { revalidatePath } from "next/cache";
import ImageList from "./components/ImageList";

const Home = async () => {
  const response = (await listAll(ref(storage, "images/"))).items;
  const paths = response.map((item) => item.fullPath);
  const urlPromises = response.map(async (item) => {
    return await getDownloadURL(item);
  });
  const imageUrls = (await Promise.all(urlPromises)) as string[];

  return (
    <div>
      <div className="p-4 border border-neutral-400 rounded mb-16">
        <ImageList
          imageUrls={imageUrls}
          paths={paths}
          onDelete={async () => {
            "use server";
            revalidatePath("/");
          }}
        />
      </div>
      <UploadImages
        onUploadComplete={async () => {
          "use server";
          revalidatePath("/");
        }}
      />
    </div>
  );
};
export default Home;
