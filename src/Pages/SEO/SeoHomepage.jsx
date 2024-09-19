import { useState } from 'react';
import Input from "../../Components/Input";
import MultiSelectTextInput from "../../Components/MultiSelectTextInput";

export default function SeoHomepage() {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: [],
  });

  const handleMetaTitleChange = (e) => {
    setSeoData(prevData => ({ ...prevData, metaTitle: e.target.value }));
  };

  const handleMetaDescriptionChange = (e) => {
    setSeoData(prevData => ({ ...prevData, metaDescription: e.target.value }));
  };

  const handleKeywordsChange = (selectedOptions) => {
    setSeoData(prevData => ({ ...prevData, keywords: selectedOptions }));
  };

  return (
    <div className='flex flex-col gap-3'>
      <Input
        label="Meta Title"
        name="title"
        value={seoData.metaTitle}
        onChange={handleMetaTitleChange}
      />
      <Input
        label="Meta Description"
        name="description"
        value={seoData.metaDescription}
        onChange={handleMetaDescriptionChange}
      />
      <MultiSelectTextInput
        id="keywords"
        label="Keywords"
        values={seoData?.keywords}
        placeholder="Type something and press enter..."
        onChange={handleKeywordsChange}
        required
      />
    </div>
  );
}
