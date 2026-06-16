"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useRef, useCallback } from "react";

/* ─── toolbar button ─── */
function Btn({
    active,
    onClick,
    title,
    children,
}: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`rounded px-2 py-1.5 text-xs font-semibold transition-colors ${
                active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-200"
            }`}
        >
            {children}
        </button>
    );
}

function Sep() {
    return <span className="mx-0.5 h-5 w-px bg-slate-200" />;
}

/* ─── toolbar ─── */
function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("URL", prev ?? "https://");
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt("Image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 rounded-t-lg">
            <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                <strong>B</strong>
            </Btn>
            <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                <em>I</em>
            </Btn>
            <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
                <span className="underline">U</span>
            </Btn>
            <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
                <s>S</s>
            </Btn>

            <Sep />

            <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
                H2
            </Btn>
            <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
                H3
            </Btn>

            <Sep />

            <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
                • List
            </Btn>
            <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
                1. List
            </Btn>
            <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
                &ldquo; Quote
            </Btn>
            <Btn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block">
                {"</>"}
            </Btn>

            <Sep />

            <Btn active={editor.isActive("link")} onClick={setLink} title="Insert link">
                🔗 Link
            </Btn>
            <Btn onClick={addImage} title="Insert image">
                🖼 Image
            </Btn>
            <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
                ― HR
            </Btn>

            <Sep />

            <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</Btn>
            <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</Btn>
        </div>
    );
}

/* ─── editor component ─── */
export default function RichTextEditor({
    name,
    defaultValue,
}: {
    name: string;
    defaultValue?: string;
}) {
    const hiddenRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
            Image.configure({ inline: false, allowBase64: true }),
            Underline,
        ],
        content: defaultValue ?? "",
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none min-h-[320px] px-4 py-3 outline-none focus:outline-none",
            },
        },
        onUpdate: ({ editor: e }) => {
            if (hiddenRef.current) hiddenRef.current.value = e.getHTML();
        },
    });

    return (
        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
            <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue ?? ""} />
        </div>
    );
}
