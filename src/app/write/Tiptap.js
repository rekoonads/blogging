import { useCallback } from "react";
import { EditorContent } from "@tiptap/react";
import styles from "./writePage.module.css";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? styles["is-active"] : ""}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? styles["is-active"] : ""}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? styles["is-active"] : ""}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? styles["is-active"] : ""}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? styles["is-active"] : ""
        }
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 }) ? styles["is-active"] : ""
        }
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? styles["is-active"] : ""}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? styles["is-active"] : ""}
      >
        Ordered List
      </button>
    </div>
  );
};

const Tiptap = ({ editor }) => {
  return (
    <div className={styles.tiptapEditor}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
