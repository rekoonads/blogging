import React, { useCallback } from "react";
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
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? styles["is-active"] : ""}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? styles["is-active"] : ""}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? styles["is-active"] : ""}
        title="Paragraph"
      >
        ¶
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? styles["is-active"] : ""
        }
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 }) ? styles["is-active"] : ""
        }
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? styles["is-active"] : ""}
        title="Bullet List"
      >
        •
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? styles["is-active"] : ""}
        title="Ordered List"
      >
        1.
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? styles["is-active"] : ""}
        title="Code Block"
      >
        {"</>"}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? styles["is-active"] : ""}
        title="Blockquote"
      >
        &apos;
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} title="Undo">
        ↩
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} title="Redo">
        ↪
      </button>
    </div>
  );
};

const Tiptap = ({ editor }) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        editor.chain().focus().insertContent("    ").run();
      }
    },
    [editor]
  );

  return (
    <div className={styles.tiptapEditor}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} onKeyDown={handleKeyDown} />
    </div>
  );
};

export default Tiptap;
