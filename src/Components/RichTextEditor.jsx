import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichtextEditor = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  containerClass = "",
  needUploaderButton = true,
}) => {
  const handleEditorChange = (content, editor) => {
    onChange({ target: { name, value: content } });
  };

  const handleInit = (editor) => {
    editor.on("init", () => {});
  };

  return (
    <div className={containerClass}>
      <label className="text-gray-700 text-sm font-medium">{label}</label>
      <Editor
        apiKey="u5w7okd4632v5wu5nhpxopid09wlp0gda4mtjfty6fzmena8"
        value={value}
        init={{
          height: 500,
          menubar: false,
          statusbar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "textcolor",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "paste",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | fullscreen preview print | media link image table code help",
          toolbar_mode: "floating", // Optional: Use 'floating' mode for toolbar
          placeholder: placeholder,
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: !needUploaderButton
            ? null
            : (cb, value, meta) => {
                if (meta.filetype === "image") {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function (event) {
                    const target = event.target;
                    const file = target?.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = function () {
                        if (typeof reader.result === "string") {
                          const id = "blobid" + new Date().getTime();
                          const editor = window.tinymce.activeEditor; // Получите активный редактор
                          if (editor) {
                            const blobCache = editor.editorUpload.blobCache;
                            const base64 = reader.result.split(",")[1];
                            const blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                            cb(blobInfo.blobUri(), { title: file.name });
                          }
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }
              },
          setup: handleInit,
        }}
        onEditorChange={handleEditorChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default RichtextEditor;
