import { listAll, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../utils/firebaseConfig";
import ImageList from "./ImageList";
import { revalidatePath } from "next/cache";
import UploadImages from "./UploadImages";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const StoreImages = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

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
export default StoreImages;
