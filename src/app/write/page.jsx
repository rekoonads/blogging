"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dynamic from "next/dynamic";
import styles from "./WritePage.module.css";

const DynamicTiptap = dynamic(() => import("./Tiptap"), {
  loading: () => <p>Loading editor...</p>,
  ssr: false,
});

export default function WritePage() {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editorContent) {
      editor.commands.setContent(editorContent);
    }
  }, [editor, editorContent]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
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
    console.log("Submitting post with image URL:", media);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        desc: editorContent,
        img: media,
        slug: slugify(title),
        catSlug: catSlug || "style",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Post created successfully:", data);
      router.push(`/posts/${data.slug}`);
    } else {
      console.error("Error creating post:", await res.text());
    }
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
            onChange={(e) => setCatSlug(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="style">Style</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="culture">Culture</option>
            <option value="travel">Travel</option>
            <option value="coding">Coding</option>
          </select>
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
          <DynamicTiptap editor={editor} />
          <button className={styles.publish} onClick={handleSubmit}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
