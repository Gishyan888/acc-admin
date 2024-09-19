import { useEffect, useState, useMemo } from "react";
import Input from "../../Components/Input";
import MultiSelectTextInput from "../../Components/MultiSelectTextInput";
import api from "../../api/api";

export default function SeoCategoriesSubcategories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  });
  const [selected, setSelected] = useState({
    categoryId: '',
    subcategoryId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("api/site/categories");
        setCategories(res.data.data);
      } catch (err) {
        setError("Error fetching categories.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMetaTitleChange = (e) => {
    setSeoData((prevData) => ({ ...prevData, metaTitle: e.target.value }));
  };

  const handleMetaDescriptionChange = (e) => {
    setSeoData((prevData) => ({ ...prevData, metaDescription: e.target.value }));
  };

  const handleKeywordsChange = (selectedOptions) => {
    setSeoData((prevData) => ({ ...prevData, keywords: selectedOptions }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId === "") {
      setSelected((prevSelected) => ({
        ...prevSelected,
        categoryId: '',
        subcategoryId: ''
      }));
      setSeoData({
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      });
    } else {
      setSelected((prevSelected) => ({
        ...prevSelected,
        categoryId,
        subcategoryId: ''
      }));

      const category = categories.find(cat => cat.id === parseInt(categoryId));
      setSubcategories(category ? category.subcategories : []);

      if (category) {
        setSeoData(prevData => ({
          ...prevData,
          metaTitle: category.metadata?.title || "",
          metaDescription: category.metadata?.description || "",
          keywords: category.metadata?.keywords?.split(",") || ""
        }));
      }
    }
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;

    if (subcategoryId === "") {
      setSeoData({
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      });

      setSelected((prevSelected) => ({
        ...prevSelected,
        subcategoryId: '', categoryId: ''
      }));
    } else {
      setSelected((prevSelected) => ({
        ...prevSelected,
        subcategoryId,
      }));

      const category = categories.find(cat => cat.id === parseInt(selected.categoryId));
      const subcategory = category?.subcategories.find(sub => sub.id === parseInt(subcategoryId));

      setSeoData(prevData => ({
        metaTitle: subcategory?.metadata?.title || "",
        metaDescription: subcategory?.metadata?.description || "",
        keywords: subcategory?.metadata?.keywords ? subcategory.metadata.keywords.split(",") : ""
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='flex flex-col gap-3'>
      <div className="flex gap-4">
        <select
          value={selected.categoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selected.subcategoryId}
          onChange={handleSubcategoryChange}
          disabled={!selected.categoryId}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map(subcategory => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
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
        values={seoData.keywords ?? ""}
        placeholder="Type something and press enter..."
        onChange={handleKeywordsChange}
        required
      />
    </div>
  );
}
