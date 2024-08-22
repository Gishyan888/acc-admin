import { FaUpload } from "react-icons/fa";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import Navigation from "../../Components/Navigation";
import Textarea from "../../Components/Textarea";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";

export default function Cms() {
    const navItems = [
        { path: '/cms/overview', label: 'Overview' },
        { path: '/cms/product-in-action', label: 'Product In Action' }
    ];

    const [credentials, setCredentials] = useState({
        title: "",
        text: "",
        image_link: "",
        image: null
    });

    useEffect(() => {
        let apiURL = '';
        if (location.pathname.includes('overview')) {
            apiURL = '/info-tab/overview';
        } else {
            apiURL = '/info-tab/product_in_action';
        }
        api.get(apiURL)
            .then((res) => {
                setCredentials(res.data.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [location.pathname]);

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
                    image: e.target.result
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
        if (!credentials.image) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            const file = files[0]; // Single file
            const reader = new FileReader();
            reader.onload = (e) => {
                setCredentials(prev => ({
                    ...prev,
                    image: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCredentials(prev => ({
            ...prev,
            image: null
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a FormData object
        const formData = new FormData();
        formData.append('title', credentials.title);
        formData.append('text', credentials.text);
        if (location.pathname.includes('overview')) {
            formData.append('image_link', credentials.image_link);
        }
        formData.append('_method', 'PUT');

        // If an image is present, append it to the FormData object
        if (credentials.image) {
            // Convert the data URL to a file object
            const dataURLToFile = (dataURL, filename) => {
                const [header, data] = dataURL.split(',');
                const mime = header.match(/:(.*?);/)[1];
                const bin = atob(data);
                const array = [];
                for (let i = 0; i < bin.length; i++) {
                    array.push(bin.charCodeAt(i));
                }
                return new File([new Uint8Array(array)], filename, { type: mime });
            };

            const file = dataURLToFile(credentials.image, 'uploaded_image.jpg');
            formData.append('image', file);
        }

        // Determine API URL based on the route
        let apiURL = '';
        if (location.pathname.includes('overview')) {
            apiURL = '/info-tab/2';
        } else {
            apiURL = '/info-tab/1';
        }

        // Send the request using FormData and POST
        api.post(apiURL, formData)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <div className="w-full">
            <Navigation navItems={navItems} />
            <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col">
                <div className='flex gap-4 w-full'>
                    <div className="w-full flex gap-3 max-w-4xl">
                        <div className='flex flex-col gap-3 w-1/2'>
                            <Input
                                label="Title"
                                name="title"
                                type="text"
                                value={credentials.title}
                                onChange={handleChange}
                            />
                            <Textarea
                                label="Text"
                                name="text"
                                value={credentials.text}
                                onChange={handleChange}
                            />
                        </div>

                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleFileDrop}
                            onClick={handleImageUploadClick}
                            className={`bg-blue-500 w-full max-w-80 h-40 text-white p-4 flex flex-col justify-center items-center cursor-pointer rounded-md shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out ${credentials.image ? 'cursor-not-allowed opacity-50' : ''}`}
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
                                disabled={!!credentials.image} // Disable if image exists
                            />
                        </div>
                    </div>

                    <div className="w-1/2 flex flex-wrap">
                        {credentials.image && (
                            <div className="relative m-2 flex flex-col gap-5">
                                {location.pathname.includes('overview') &&
                                    <Input
                                        label="Image Link"
                                        name="image_link"
                                        type="text"
                                        value={credentials.image_link ?? ''}
                                        onChange={handleChange}
                                    />
                                }
                                <img
                                    src={credentials.image}
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

                <div className='flex justify-end'>
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
