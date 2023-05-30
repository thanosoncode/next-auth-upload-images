import { listAll, getDownloadURL, ref } from "firebase/storage";
import { storage } from "./utils/firebaseConfig";
import UploadImages from "./components/UploadImages";
import { revalidatePath } from "next/cache";
import ImageItem from "./components/ImageItem";

const Home = async () => {
  const response = (await listAll(ref(storage, "images/"))).items;
  const paths = response.map((item) => item.fullPath);
  console.log("response", response[0].fullPath);
  const urlPromises = response.map(async (item) => {
    return await getDownloadURL(item);
  });
  const imageUrls = (await Promise.all(urlPromises)) as string[];

  return (
    <div>
      <div className="p-4 border border-neutral-400 rounded mb-16">
        <h1 className="text-lg mb-4">Your images</h1>
        <section className="flex flex-wrap gap-2">
          {imageUrls.map((url, index) => (
            <ImageItem
              key={index}
              url={url}
              path={paths[index]}
              onDelete={async () => {
                "use server";
                revalidatePath("/");
              }}
            />
          ))}
        </section>
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
