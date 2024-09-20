import { useEffect, useState } from "react";
import Input from "../../Components/Input";
import MultiSelectTextInput from "../../Components/MultiSelectTextInput";
import api from "../../api/api";
import Button from "../../Components/Button";

export default function SeoCategoriesSubcategories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: [],
  });

  const [selected, setSelected] = useState({
    categoryId: "",
    subcategoryId: "",
    metadataID: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("api/site/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleMetaTitleChange = (e) => {
    setSeoData((prevData) => ({ ...prevData, title: e.target.value }));
  };

  const handleMetaDescriptionChange = (e) => {
    setSeoData((prevData) => ({ ...prevData, description: e.target.value }));
  };

  const handleKeywordsChange = (selectedOptions) => {
    setSeoData((prevData) => ({ ...prevData, keywords: selectedOptions }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    if (categoryId === "") {
      setSelected({
        categoryId: "",
        subcategoryId: "",
        metadataID: "",
      });
      setSeoData({
        title: "",
        description: "",
        keywords: [],
      });
    } else {
      const category = categories.find(
        (cat) => cat.id === parseInt(categoryId)
      );
      setSubcategories(category ? category.subcategories : []);
      
      setSelected({
        categoryId,
        subcategoryId: "",
        metadataID: category?.metadata?.id || "",
      });

      setSeoData({
        title: category?.metadata?.title || "",
        description: category?.metadata?.description || "",
        keywords: category?.metadata?.keywords
          ? category.metadata.keywords.split(",")
          : [],
      });
    }
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;

    if (subcategoryId === "") {
      setSeoData({
        title: "",
        description: "",
        keywords: [],
      });

      setSelected((prevSelected) => ({
        ...prevSelected,
        subcategoryId: "",
        metadataID: "",
      }));
    } else {
      const category = categories.find(
        (cat) => cat.id === parseInt(selected.categoryId)
      );
      const subcategory = category?.subcategories.find(
        (sub) => sub.id === parseInt(subcategoryId)
      );

      setSelected((prevSelected) => ({
        ...prevSelected,
        subcategoryId,
        metadataID: subcategory?.metadata?.id || "",
      }));

      setSeoData({
        title: subcategory?.metadata?.title || "",
        description: subcategory?.metadata?.description || "",
        keywords: subcategory?.metadata?.keywords
          ? subcategory.metadata.keywords.split(",")
          : [],
      });
    }
  };

  const handleSubmit = () => {
    const updatedData = {
      ...seoData,
      keywords: seoData.keywords.join(", "),
    };

    const id = selected.metadataID; // Use metadataID for the API call
    if (!id) {
      return;
    }

    api
      .put(`api/admin/meta/${id}`, updatedData)
      .then((res) => console.log("Updated SEO data:", res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <select
          className="max-w-80 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          value={selected.categoryId || ""}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="max-w-80 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          value={selected.subcategoryId || ""}
          onChange={handleSubcategoryChange}
          disabled={!selected.categoryId}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
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
      <Button color="bg-green-500" text="Submit" onClick={handleSubmit} />
    </div>
  );
}
