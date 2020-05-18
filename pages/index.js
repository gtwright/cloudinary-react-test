import { useState, useRef, useEffect } from "react";
import { CloudinaryContext, Image } from "cloudinary-react";
import { fetchPhotos, openUploadWidget } from "../utils/CloudinaryService";
export default function IndexPage() {
  const [images, setImages] = useState([]);

  function loadScript(src, position, id) {
    if (!position) {
      return;
    }
    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
  }

  const beginUpload = tag => {
    const uploadOptions = {
      cloudName: "opusaffair",
      tags: [tag],
      uploadPreset: "jhtlnckh",
      sources: ["local", "image_search", "url"],
      googleApiKey: process.env.GOOGLE_API_KEY
    };

    openUploadWidget(uploadOptions, (error, photos) => {
      if (!error) {
        console.log(photos);
        if (photos.event === "success") {
          setImages([...images, photos.info.public_id]);
        }
      } else {
        console.log(error);
      }
    });
  };

  const loaded = useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#cloudinary")) {
      loadScript(
        "https://widget.cloudinary.com/v2.0/global/all.js",
        document.querySelector("head"),
        "cloudinary"
      );
    }

    loaded.current = true;
  }

  useEffect(() => {
    fetchPhotos("image", setImages);
  }, []);

  return (
    <CloudinaryContext cloudName="opusaffair">
      <div className="App">
        {console.log(images)}
        <section>
          <button onClick={() => beginUpload("image")}>Upload Image</button>
          {images.map(i => (
            <Image key={i} publicId={i} fetch-format="auto" quality="auto" />
          ))}
        </section>
      </div>
    </CloudinaryContext>
  );
}
