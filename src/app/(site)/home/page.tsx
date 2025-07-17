import { HomeComponent } from "@/components/home/home";
import { getFirebase } from "@/lib/use-firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export default async function Home(){ 

    const { storage } = await getFirebase();

    const listRef = ref(storage, 'hero_images/');

    const res = await listAll(listRef)
    .then((res) => {
        const references = res.items.map(items => getDownloadURL(items))

        return Promise.all(references);
    })

    return (
        <div className="min-h-screen py-25! sm:py-28! container-xl">
            <HomeComponent heroImages={res} />
        </div>
    )
    
}