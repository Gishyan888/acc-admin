import { FaUpload } from "react-icons/fa";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import Navigation from "../../Components/Navigation";
import Textarea from "../../Components/Textarea";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import FileUpload from "../../Components/FileUpload";
import useModal from "../../store/useModal";

export default function Cms() {
  const { setModalDetails, resetModalDetails } = useModal()

  const navItems = [
    { path: "/cms/overview", label: "Overview" },
    { path: "/cms/product-in-action", label: "Product In Action" },
  ];

  const [credentials, setCredentials] = useState({
    title: "",
    text: "",
    image_link: "",
    image: null,
    image_src: "",
  });

  const [errors, setErrors] = useState({})

  useEffect(() => {
    let apiURL = "";
    if (location.pathname.includes("overview")) {
      apiURL = "api/site/info-tab/overview";
    } else {
      apiURL = "api/site/info-tab/product_in_action";
    }
    api
      .get(apiURL)
      .then((res) => {
        setErrors({});
        setCredentials(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.pathname]);

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
    }))
  };

  
  const handleFileRemove = () => {
    setCredentials((prev) => ({
      ...prev,
      image: null,
      image_src: '',
      image_link: ''
    }))
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", credentials.title);
    formData.append("text", credentials.text);
    if (location.pathname.includes("overview")) {
      formData.append("image_link", credentials.image_link);
    }
    if (typeof credentials.image !== "string") {
      formData.append("image", credentials.image);
    }
    formData.append("_method", "PUT");

    let apiURL = "";
    if (location.pathname.includes("overview")) {
      apiURL = "api/admin/info-tab/2";
    } else {
      apiURL = "api/admin/info-tab/1";
    }

    api
      .post(apiURL, formData)
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
          },
        });
      })
      .catch((err) => {
        setErrors(err.response.data.errors);
      });
  };

  return (
    <div className="w-full">
      <Navigation navItems={navItems} />
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col"
      >
        <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-3 w-1/2">
              <Input
                label="Title"
                name="title"
                type="text"
                value={credentials.title}
                onChange={handleChange}
                error={errors.title}
              />
              <Textarea
                label="Text"
                name="text"
                value={credentials.text}
                onChange={handleChange}
                error={errors.text}
              />
            </div>
          <div className="w-full flex flex-col">
          {credentials.image && location.pathname.includes("overview") && (
              <Input
                label="Image Link"
                name="image_link"
                type="text"
                value={credentials.image_link ?? ""}
                onChange={handleChange}
                error={errors.image_link}
              />
            )}
            <FileUpload
              file={credentials.image}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              buttonText="Upload Image"
              imageSize="w-1/2 h-64 mt-4"
            />
            {errors.image && (
              <p className="text-red-500">{errors.image}</p>
            )}
          </div>
        </div> <div className="flex justify-end">
          <Button
            text="Save Info"
            color="bg-amber-600 mt-4"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
