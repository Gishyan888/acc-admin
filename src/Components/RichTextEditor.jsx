import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichtextEditor = ({ label, name, value, onChange, placeholder, error }) => {
  const handleEditorChange = (content, editor) => {
    onChange({ target: { name, value: content } });
  };

  return (
    <div>
      <label className="text-gray-700 text-sm font-medium">{label}</label>
      <Editor
      apiKey="u5w7okd4632v5wu5nhpxopid09wlp0gda4mtjfty6fzmena8"
      value={value}
      init={{
        height: 500,
        menubar: false,
        statusbar: false,
        plugins: 'advlist autolink lists link image charmap preview anchor textcolor fullscreen insertdatetime media table paste code help wordcount',
        toolbar: 'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | fullscreen preview print | media link image table code help',
        toolbar_mode: 'floating', // Optional: Use 'floating' mode for toolbar
        placeholder: placeholder,
      }}
      onEditorChange={handleEditorChange}

      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default RichtextEditor;
