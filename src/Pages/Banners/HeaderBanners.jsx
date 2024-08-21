import React, { useState, useRef } from 'react';
import Input from '../../Components/Input';
import { FaUpload } from 'react-icons/fa';
import Button from '../../Components/Button';

export default function HeaderBanners() {
  const [credentials, setCredentials] = useState({
    title: "",
    button_text: "",
    button_link: "",
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 ~ HeaderBanners ~ credentials:", credentials);
    console.log("Uploaded Images:", images);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const imagesArray = Array.from(files);
      Promise.all(
        imagesArray.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        })
      ).then((results) => {
        setImages(prevImages => [...prevImages, ...results]);
      });
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
      const imagesArray = Array.from(files);
      Promise.all(
        imagesArray.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        })
      ).then((results) => {
        setImages(prevImages => [...prevImages, ...results]);
      });
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md flex flex-col">
      <div className='flex gap-4 w-full'>
        <div className="w-full flex flex-col gap-3">
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
            name="button_text"
            value={credentials.button_text}
            onChange={handleChange}
          />
          <Input
            label="Button Link"
            type="text"
            name="button_link"
            value={credentials.button_link}
            onChange={handleChange}
          />
        </div>
        <div
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          onClick={handleImageUploadClick}
          className="bg-blue-500 w-full max-w-80 text-white p-4 flex flex-col justify-center items-center cursor-pointer rounded-md shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
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
            multiple
          />
        </div>
      </div>
      <div className="w-full flex flex-wrap mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative m-2">
            <img
              src={image}
              alt={`upload-${index}`}
              className="w-24 h-24 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className='flex justify-end'>
      <Button
        text="Save Banner"
        color="bg-amber-600 mt-4"
        onClick={handleSubmit}
      />
      </div>
    </form>
  );
}
