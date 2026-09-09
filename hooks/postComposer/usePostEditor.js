"use client";

import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";

const getPlaceholderText = ({ hasPoll, isReply }) => {
  if (hasPoll) return "سوالی بپرسید یا موضوعی را مطرح کنید...";
  return isReply ? "پاسخ خود را ارسال کنید" : "چه خبر؟";
};

const HashtagMention = Extension.create({
  name: "hashtagMention",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("hashtagMention"),
        props: {
          decorations(state) {
            const decorations = [];

            state.doc.descendants((node, pos) => {
              if (!node.isText) return;

              const regex = /([@#])([\w\u0600-\u06FF]+)/g;
              let match;
              while ((match = regex.exec(node.text)) !== null) {
                const start = pos + match.index;
                decorations.push(
                  Decoration.inline(start, start + match[0].length, {
                    class: "text-blue-400",
                  }),
                );
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});

const usePostEditor = ({
  isEdit,
  initialData,
  isReply,
  hasPoll,
  onInitialData,
}) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      HashtagMention,
      Placeholder.configure({
        placeholder: getPlaceholderText({ hasPoll, isReply }),
      }),
    ],
    content: isEdit ? initialData?.textContent || "" : "",
    editorProps: {
      attributes: {
        class: `text-sm sm:text-lg ${!isEdit ? "min-h-12" : "min-h-26 "} pr-1 pt-0.5 bg-transparent focus:outline-none text-lg leading-[1.8] outline-none`,
        dir: "auto",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setIsEmpty(currentEditor.getText().trim() === "");
    },
  });

  useEffect(() => {
    if (!isEdit || !initialData || !editor) return;

    const timer = setTimeout(() => {
      editor.commands.setContent(initialData.textContent || "");
      onInitialData(initialData);
    }, 0);

    return () => clearTimeout(timer);
  }, [editor, initialData, isEdit, onInitialData]);

  const updatePlaceholder = useCallback(() => {
    if (!editor) return;

    editor.extensionManager.extensions
      .find((extension) => extension.name === "placeholder")
      ?.configure({ placeholder: getPlaceholderText({ hasPoll, isReply }) });
  }, [editor, hasPoll, isReply]);

  useEffect(() => {
    updatePlaceholder();
  }, [updatePlaceholder]);

  return {
    editor,
    isEmpty,
    getText: useCallback(() => editor?.getText() || "", [editor]),
    getContent: useCallback(() => editor?.getHTML() || "", [editor]),
    clearEditor: useCallback(() => editor?.commands.clearContent(), [editor]),
  };
};

export default usePostEditor;
