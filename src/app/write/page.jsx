"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import styles from "./writePage.module.css";

export default function WritePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: styles.tiptapEditor,
      },
    },
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress(0);
    setUploadError(null);

    const upload = async () => {
      if (!file) return;

      try {
        console.log("Starting upload...");
        setUploadProgress(0);
        setUploadError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        console.log("Upload response:", data);
        setMedia(data.secure_url);
        setUploadProgress(100);
        console.log("Upload complete. Media URL:", data.secure_url);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadError(error.message || String(error));
      }
    };
    upload();
  };

  const handleSubmit = async () => {
    if (!editor || !title || !catSlug) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc: editor.getHTML(),
          img: media,
          slug: slugify(title),
          catSlug,
          subcategorySlug: subcategorySlug || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
      } else {
        const errorData = await res.json();
        setError(
          errorData.message || "An error occurred while creating the post"
        );
        if (errorData.message === "Subcategory not found") {
          console.error(
            "Subcategory not found. Available subcategories:",
            subcategories[catSlug]
          );
        }
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const subcategories = {
    gaming: ["PC", "PlayStation", "Xbox", "Mobile", "Esports", "Nintendo"],
    reviews: ["Game", "Tech", "Movie", "Comic", "TV"],
    tech: [],
    videos: [],
    movies: [],
    tv: [],
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <input
            type="text"
            placeholder="Title"
            className={styles.input}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className={styles.select}
            onChange={(e) => {
              setCatSlug(e.target.value);
              setSubcategorySlug("");
            }}
          >
            <option value="">Select a category</option>
            <option value="gaming">Gaming</option>
            <option value="reviews">Reviews</option>
            <option value="tech">Tech</option>
            <option value="videos">Videos</option>
            <option value="movies">Movies</option>
            <option value="tv">TV</option>
          </select>
          {subcategories[catSlug] && subcategories[catSlug].length > 0 && (
            <select
              className={styles.select}
              onChange={(e) => setSubcategorySlug(e.target.value.toLowerCase())}
              value={subcategorySlug}
            >
              <option value="">Select a subcategory</option>
              {subcategories[catSlug].map((sub) => (
                <option key={sub} value={sub.toLowerCase()}>
                  {sub}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.editorWrapper}>
          <div className={styles.editorToolbar}>
            <button
              className={styles.addMediaButton}
              onClick={() => setOpen(!open)}
            >
              <Image src="/plus.png" alt="Add media" width={20} height={20} />
              Add Media
            </button>
            {open && (
              <div className={styles.mediaOptions}>
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button
                  className={styles.mediaButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image
                    src="/image.png"
                    alt="Add image"
                    width={20}
                    height={20}
                  />
                  Image
                </button>
                <button className={styles.mediaButton}>
                  <Image
                    src="/external.png"
                    alt="Add link"
                    width={20}
                    height={20}
                  />
                  Link
                </button>
                <button className={styles.mediaButton}>
                  <Image
                    src="/video.png"
                    alt="Add video"
                    width={20}
                    height={20}
                  />
                  Video
                </button>
              </div>
            )}
          </div>
          {previewUrl && (
            <div className={styles.imagePreview}>
              <Image
                src={previewUrl}
                alt="Preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className={styles.uploadStatus}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {uploadError && (
            <div className={styles.errorMessage}>
              Error uploading image: {uploadError}
            </div>
          )}
          {media && (
            <div className={styles.successMessage}>
              Image uploaded successfully!
            </div>
          )}
          <EditorContent editor={editor} />
          <button className={styles.publish} onClick={handleSubmit}>
            Publish
          </button>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
