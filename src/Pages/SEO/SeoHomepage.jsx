import { useEffect, useState } from "react";
import Input from "../../Components/Input";
import MultiSelectTextInput from "../../Components/MultiSelectTextInput";
import api from "../../api/api";
import Button from "../../Components/Button";

export default function SeoHomepage() {
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: [],
  });

  useEffect(() => {
    api
      .get("/api/admin/meta/1")
      .then((res) => {
        const data = res.data.data;
        setSeoData({
          title: data.title || "",
          description: data.description || "",
          keywords: data.keywords
            ? data.keywords.split(",").map((kw) => kw.trim())
            : [],
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleMetaTitleChange = (e) => {
    setSeoData((prevData) => ({ ...prevData, title: e.target.value }));
  };

  const handleMetaDescriptionChange = (e) => {
    setSeoData((prevData) => ({
      ...prevData,
      description: e.target.value,
    }));
  };

  const handleKeywordsChange = (selectedOptions) => {
    setSeoData((prevData) => ({ ...prevData, keywords: selectedOptions }));
  };

  const handleSubmit = () => {
    const updatedData = {
      ...seoData,
      keywords: seoData.keywords.join(", "), 
    };
    api
      .put("/api/admin/meta/1", updatedData)
      .then((res) => console.log("Updated SEO data:", res.data))
      .catch((err) => console.error(err));
  };


  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Meta Title"
        name="title"
        value={seoData.title}
        onChange={handleMetaTitleChange}
      />
      <Input
        label="Meta Description"
        name="description"
        value={seoData.description}
        onChange={handleMetaDescriptionChange}
      />
      <MultiSelectTextInput
        id="keywords"
        label="Keywords"
        values={seoData.keywords}
        placeholder="Type something and press enter..."
        onChange={handleKeywordsChange}
        required
      />
      <Button
        color="bg-green-500"
        text="Submit"
        onClick={handleSubmit}
      />
    </div>
  );
}
