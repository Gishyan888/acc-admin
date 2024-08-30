import React, { useState, useRef, useEffect } from 'react';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import Textarea from '../../Components/Textarea';
import api from '../../api/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FileUpload from '../../Components/FileUpload';
import useModal from "../../store/useModal";

export default function CreateEditBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({})
  let title = location.pathname.includes('header-banners') ? 'Header Banner' : 'Company Banner';
  const { setModalDetails, resetModalDetails } = useModal()

  useEffect(() => {
    if (id) {
      api.get(`api/admin/banners/${id}`)
        .then((res) => {
          setCredentials(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [])

  const [credentials, setCredentials] = useState({
    title: "",
    button_name: "",
    button_link: "",
    text: "",
    image: null,
    image_src: '',
    type: location.pathname.includes('header-banners') ? "0" : "1"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleFileSelect = (file) => {
    setCredentials(prev => ({
      ...prev,
      image: file,
      image_src: URL.createObjectURL(file)
    }))
  };

  const handleFileRemove = () => {
    setCredentials(prev => ({
      ...prev,
      image: null,
      image_src: ''
    }))
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', credentials.title);
    formData.append('button_name', credentials.button_name);
    formData.append('button_link', credentials.button_link);
    if (!id) {
      formData.append('type', credentials.type);
    }
    if (typeof credentials.image !== 'string') {
      formData.append('image', credentials.image);
    }

    if (location.pathname.includes('company-banners')) {
      formData.append('text', credentials.text);
    }
    let apiURL = 'api/admin/banners';
    if (id) {
      formData.append('_method', 'PUT');
      apiURL = `api/admin/banners/${id}`;
    }

    api.post(apiURL, formData)
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
      .catch ((err) => {
    setErrors(err.response.data.errors);
  });
};

return (
  <div className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col">
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>

    <form onSubmit={handleSubmit}>
      <div className='flex gap-4 w-full'>
        <div className="w-full flex justify-between gap-3 max-w-4xl">
          <div className='flex flex-col gap-3 w-full'>
            <Input
              label="Title"
              type="text"
              name="title"
              value={credentials.title}
              onChange={handleChange}
              error={errors.title}
            />
            <Input
              label="Button Name"
              type="text"
              name="button_name"
              value={credentials.button_name}
              onChange={handleChange}
              error={errors.button_name}
            />
            <Input
              label="Button Link"
              type="text"
              name="button_link"
              value={credentials.button_link}
              onChange={handleChange}
              error={errors.button_link}
            />
            {location.pathname.includes('company-banners') &&
              <Textarea
                label="text"
                name="text"
                value={credentials.text}
                onChange={handleChange}
                placeholder="Enter banner text"
                error={errors.text}
              />}
          </div>
          <div className="w-full">
            <FileUpload
              file={credentials.image}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              buttonText="Upload Image"
              imageSize="w-full h-64"

            />
            {errors.image && (
              <p className="text-red-500">{errors.image}</p>
            )}
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button
          text="Save Banner"
          color="bg-amber-600 mt-4"
          onClick={handleSubmit}
        />
      </div>
    </form>
  </div>

);
}
