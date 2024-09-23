import { useEffect, useState } from "react";
import Input from "../../Components/Input";
import MultiSelectTextInput from "../../Components/MultiSelectTextInput";
import api from "../../api/api";
import Button from "../../Components/Button";
import useModal from "../../store/useModal";

export default function SeoBlog() {
  const { setModalDetails, resetModalDetails } = useModal();

  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: [],
  });
  const [selected, setSelected] = useState("");
  const [pages, setPages] = useState([]);
  const [metaId, setMetaId] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/contents?type=news")
      .then((res) => {
        setPages(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handlePageChange = (e) => {
    const selectedPageId = e.target.value;
    setSelected(selectedPageId);

    const selectedPage = pages.find(
      (page) => page.id == parseInt(selectedPageId)
    );
    console.log("🚀 ~ handlePageChange ~ selectedPage:", selectedPage);

    if (selectedPage) {
      setSeoData({
        title: selectedPage.meta.title || "",
        description: selectedPage.meta.description || "",
        keywords: selectedPage.meta.keywords
          ? selectedPage.meta.keywords.split(",").map((kw) => kw.trim())
          : [],
      });

      setMetaId(selectedPage.meta.id);
    }
  };

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
    if (!metaId) {
      console.error("Meta ID not found for the selected page");
      return;
    }

    const updatedData = {
      ...seoData,
      keywords: seoData.keywords.join(", "),
    };

    api
      .put(`/api/admin/meta/${metaId}`, updatedData)
      .then((res) => {
        setModalDetails({
          isVisible: true,
          image: "success",
          successMessage: res?.data?.message,
          onClose: () => {
            resetModalDetails();
          },
        });
      })
      .catch((err) => {
        resetModalDetails();
        setModalDetails({
          isVisible: true,
          image: "fail",
          errorMessage: err.response?.data?.message || "An error occurred",
          onClose: () => {
            resetModalDetails();
          },
        });
      });
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        className="max-w-80 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        value={selected || ""}
        onChange={handlePageChange}
      >
        <option value="">Select Page</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.title}
          </option>
        ))}
      </select>
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
