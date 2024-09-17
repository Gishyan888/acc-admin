import React, { useState, useEffect } from "react";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import Textarea from "../../Components/Textarea";
import api from "../../api/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FileUpload from "../../Components/FileUpload";
import useModal from "../../store/useModal";
import RichtextEditor from "../../Components/RichTextEditor";

export default function CreateEditPages() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [errors, setErrors] = useState({});
  let title = location.pathname.includes("custom")
    ? "Custom Page"
    : "Blog Page";
  const { setModalDetails, resetModalDetails } = useModal();

  useEffect(() => {
    if (slug) {
      api
        .get(`api/site/contents/${slug}`)
        .then((res) => {
          setCredentials(res.data.data);
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
    }
  }, [slug]);

  const [credentials, setCredentials] = useState({
    title: "",
    text: "",
    image: null,
    image_src: "",
    type: location.pathname.includes("custom") ? "1" : "0",
    status: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (file) => {
    setCredentials((prev) => ({
      ...prev,
      image: file,
      image_src: URL.createObjectURL(file),
    }));
  };

  const handleFileRemove = () => {
    setCredentials((prev) => ({
      ...prev,
      image: null,
      image_src: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", credentials.title);
    formData.append("text", credentials.text);
    if (!slug) {
      formData.append("type", credentials.type);
    }
    formData.append("status", credentials.status);
    if (typeof credentials.image !== "string") {
      formData.append("image", credentials.image);
    }
    let apiURL = "api/admin/contents";
    if (slug) {
      formData.append("_method", "PUT");
      apiURL = `api/admin/contents/${credentials.id}`;
    }

    api
      .post(apiURL, formData)
      .then((res) => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            navigate(-1);
          },
        });
      })
      .catch((err) => {
        setErrors(err.response.data.errors);
      });
  };

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 w-full">
          <div className="w-full flex justify-between gap-3 max-w-4xl">
            <div className="flex flex-col gap-3 w-full">
              {slug && (
                <div className="flex flex-col mx-2 text-sm font-medium w-80">
                  <label className="text-gray-700 font-medium">Status</label>
                  <select
                    name="status"
                    value={credentials.status}
                    onChange={handleChange}
                    className="border rounded p-2 mt-2 bg-white"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              )}
              <div className="my-2 mx-2">
                <Input
                  label="Title"
                  type="text"
                  name="title"
                  value={credentials.title}
                  onChange={handleChange}
                  error={errors.title}
                />
              </div>

              <div className="w-80">
                <FileUpload
                  file={credentials.image}
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  buttonText="Upload Image"
                  imageSize="w-full h-64"
                />
                {errors.image && <p className="text-red-500">{errors.image}</p>}
              </div>
              <RichtextEditor
                containerClass="mx-2"
                label="Description"
                name="text"
                value={credentials.text}
                onChange={handleChange}
                error={errors.text}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            text="Save Page"
            color="bg-amber-600 mt-4"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
