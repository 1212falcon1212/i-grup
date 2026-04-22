"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TipTapImage from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "./MediaPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value = "", onChange, className }: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TipTapImage.configure({ HTMLAttributes: { class: "rounded-md" } }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-content max-w-none min-h-[240px] p-4 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // External value → editor sync (e.g. when form resets)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const button = (
    active: boolean,
    onClick: () => void,
    Icon: React.ComponentType<{ className?: string }>,
    title: string
  ) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn("h-8 w-8 p-0", active && "bg-muted")}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <>
      <div
        className={cn(
          "border border-border rounded-md overflow-hidden bg-background",
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-1 py-1">
          {button(
            editor.isActive("bold"),
            () => editor.chain().focus().toggleBold().run(),
            Bold,
            "Kalın"
          )}
          {button(
            editor.isActive("italic"),
            () => editor.chain().focus().toggleItalic().run(),
            Italic,
            "İtalik"
          )}
          {button(
            editor.isActive("underline"),
            () => editor.chain().focus().toggleUnderline().run(),
            UnderlineIcon,
            "Altı çizili"
          )}
          <div className="w-px h-5 bg-border mx-1" />
          {button(
            editor.isActive("heading", { level: 2 }),
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            Heading2,
            "Başlık 2"
          )}
          {button(
            editor.isActive("heading", { level: 3 }),
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            Heading3,
            "Başlık 3"
          )}
          <div className="w-px h-5 bg-border mx-1" />
          {button(
            editor.isActive("bulletList"),
            () => editor.chain().focus().toggleBulletList().run(),
            List,
            "Madde listesi"
          )}
          {button(
            editor.isActive("orderedList"),
            () => editor.chain().focus().toggleOrderedList().run(),
            ListOrdered,
            "Numaralı liste"
          )}
          <div className="w-px h-5 bg-border mx-1" />
          {button(
            editor.isActive("link"),
            () => {
              setLinkUrl(editor.getAttributes("link").href ?? "");
              setLinkOpen(true);
            },
            Link2,
            "Bağlantı"
          )}
          {button(
            false,
            () => setMediaOpen(true),
            ImageIcon,
            "Görsel ekle"
          )}
          <div className="w-px h-5 bg-border mx-1" />
          {button(
            false,
            () => editor.chain().focus().undo().run(),
            Undo2,
            "Geri al"
          )}
          {button(
            false,
            () => editor.chain().focus().redo().run(),
            Redo2,
            "Yinele"
          )}
        </div>
        <EditorContent editor={editor} />
      </div>

      <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Görsel Seç</DialogTitle>
          </DialogHeader>
          <MediaPicker
            onChange={(url) => {
              if (url) editor.chain().focus().setImage({ src: url }).run();
              setMediaOpen(false);
            }}
            triggerLabel="Seç"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bağlantı ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                setLinkOpen(false);
              }}
            >
              Kaldır
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!linkUrl) {
                  setLinkOpen(false);
                  return;
                }
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: linkUrl })
                  .run();
                setLinkOpen(false);
              }}
            >
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
