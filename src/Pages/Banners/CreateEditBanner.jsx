import React, { useState, useRef, useEffect } from 'react';
import Input from '../../Components/Input';
import { FaUpload } from 'react-icons/fa';
import Button from '../../Components/Button';
import Textarea from '../../Components/Textarea';
import api from '../../api/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../Components/Modal';

export default function CreateEditBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useParams();

  let title = location.pathname.includes('header-banners') ? 'Header Banner' : 'Company Banner';

  useEffect(() => {
    if (id) {
      api.get(`/banners/${id}`)
        .then((res) => {
          setCredentials(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [])

  const closeModal = () => {
    return new Promise((resolve) => {
      setModalVisible(false);
      setTimeout(() => {
        resolve();
      }, 300);
    });
  };

  const [credentials, setCredentials] = useState({
    title: "",
    button_name: "",
    button_link: "",
    text: "",
    image: null,
    image_src: '',
    type: location.pathname.includes('header-banners') ? "0" : "1"
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setCredentials(prev => ({
          ...prev,
          image: file,
          image_src: e.target.result
        }));

      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setCredentials(prev => ({
          ...prev,
          image: file,
          image_src: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCredentials(prev => ({
      ...prev,
      image: null,
      image_src: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 ~ HeaderBanners ~ credentials:", credentials);
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
    let apiURL = '/banners';
    if (id) {
      formData.append('_method', 'PUT');
      apiURL = `/banners/${id}`;
    }

    api.post(apiURL, formData)
      .then(async (res) => {
        setModalVisible(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await closeModal();
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div  className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>

<form onSubmit={handleSubmit}>
  <div className='flex gap-4 w-full'>
    <div className="w-full flex gap-3 max-w-4xl">
      <div className='flex flex-col gap-3 w-1/2'>
        <Input
          label="Title"
          type="text"
          name="title"
          value={credentials.title}
          onChange={handleChange}
        />
        <Input
          label="Button Name"
          type="text"
          name="button_name"
          value={credentials.button_name}
          onChange={handleChange}
        />
        <Input
          label="Button Link"
          type="text"
          name="button_link"
          value={credentials.button_link}
          onChange={handleChange}
        />
        {location.pathname.includes('company-banners') &&
          <Textarea
            label="text"
            name="text"
            value={credentials.text}
            onChange={handleChange}
            placeholder="Enter banner text"
          />}
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
        onClick={handleImageUploadClick}
        className="bg-blue-500 w-full max-w-80 h-40 text-white p-4 flex flex-col justify-center items-center cursor-pointer rounded-md shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
      >
        <FaUpload className="w-8 h-8" />
        <span className="mt-2">Drag & Drop or </span>
        <span className="underline">Click to Upload</span>
        <input
          className="canvas-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
      </div>
    </div>

    <div className="w-1/2 flex flex-wrap">
      {credentials.image && (
        <div className="relative m-2 flex flex-col gap-5">
          <img
            src={credentials.image_src ? credentials.image_src : credentials.image}
            alt="uploaded"
            className="object-contain rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  </div>
  <Modal value={"Success!"} isVisible={modalVisible} onClose={closeModal} />

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
