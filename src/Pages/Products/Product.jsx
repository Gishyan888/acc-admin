import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Select from "react-select";
import Textarea from "../../Components/Textarea";
import StyledSelect from "../../Components/StyledSelect";
import useModal from "../../store/useModal";

export default function Product() {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rejectProduct, setRejectProduct] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { setModalDetails, resetModalDetails } = useModal();
  const navigate = useNavigate();
  const MultiValueRemove = () => null;

  const statusOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
  ];

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = () => {
    api
      .get(`/api/company/products/${id}`)
      .then((res) => {
        const data = res.data.data;
        setProductData(data);
      })
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, name) => {
    handleInputChange({
      target: {
        name,
        value: selectedOption.value,
      },
    });
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const navigateImage = (direction) => {
    if (direction === "prev") {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? productData.images.length - 1 : prevIndex - 1
      );
    } else if (direction === "next") {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === productData.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const renderImageModal = () => {
    if (!showImageModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="w-[800px] h-[800px] relative flex justify-center items-center p-6">
          <img
            src={productData.images[selectedImageIndex].image}
            alt={`Full size ${selectedImageIndex + 1}`}
            className="object-contain w-full h-full"
          />
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigateImage("next")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
          >
            <FaChevronRight size={24} />
          </button>
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    const {
      min_price,
      max_price,
      product_count_range,
      description,
      title,
      product_type,
      // standards,
    } = productData;

    const formData = new FormData();

    formData.append("min_price", min_price);
    formData.append("max_price", max_price);
    formData.append("product_range", product_count_range);
    formData.append("description", description);
    formData.append("product_type_id", product_type?.id);
    // {
    //   standards &&
    //     standards.map((standard) =>
    //       formData.append("standards[]", standard.id)
    //     );
    // }
    formData.append("title", title);
    formData.append("_method", "PUT");

    try {
      await api.post(`/api/company/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
        },
      });
      setIsEditing(false);
      fetchProductData();
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  const approveProduct = async () => {
    try {
      await api.post(`api/admin/product-status/${id}?_method=PUT&do=approved`);
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
          navigate(-1);
        },
      });
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  const rejectProductForm = async () => {
    try {
      await api.post(`api/admin/product-status/${id}?_method=PUT&do=rejected`, {
        reason,
      });
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
          navigate(-1);
        },
      });
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <div className="flex flex-col pt-1 pb-4 w-full">
      <div className="rounded shadow bg-white p-3 flex flex-col gap-4">
        <div className="mb-32 relative">
          <img
            src={productData.banner_image}
            alt="Banner"
            className="w-full h-[740px] object-cover rounded mb-2"
          />
          <div className="flex w-2/3 justify-start gap-5 items-end absolute -bottom-24 left-12">
            <div>
              <img
                src={productData.main_image}
                alt="Profile"
                className="min-w-40 h-40 object-cover mb-2"
              />
            </div>
            <Input
              type="text"
              label="Company Name"
              name="name"
              value={productData.company_name || ""}
              onChange={handleInputChange}
              disabled={true}
              error={errors.company_name}
            />
            <div className="flex gap-3 ml-16">
              <StyledSelect
                label="Status"
                options={statusOptions}
                value={statusOptions.find(
                  (option) => option.value == productData?.status
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "status")
                }
                isDisabled={true}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-wrap gap-4 w-full">
            <Input
              type="text"
              label="Title"
              name="title"
              value={productData.title || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              error={errors.title}
            />
            <Input
              type="text"
              label="Category Name"
              name="category[name]"
              value={productData?.category?.name || ""}
              onChange={handleInputChange}
              disabled={true}
              error={errors?.category?.name}
            />
            <Input
              type="text"
              label="Subcategory Name"
              name="subcategory[name]"
              value={productData?.subcategory?.name || ""}
              onChange={handleInputChange}
              disabled={true}
              error={errors?.subcategory?.name}
            />
            <Input
              type="text"
              label="Product Type"
              name="product_type[name]"
              value={productData?.product_type?.name || ""}
              onChange={handleInputChange}
              disabled={true}
              error={errors?.product_type?.name}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {/* {productData &&
            productData.standards &&
            productData.standards.length > 0 && (
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Standards</label>
                <Select
                  className="w-full"
                  isMulti
                  options={productData?.standards.map((standard) => ({
                    value: standard.id,
                    label: standard.name,
                  }))}
                  value={productData?.standards.map((standard) => ({
                    value: standard.id,
                    label: standard.name,
                  }))}
                  isDisabled={true}
                  components={{ MultiValueRemove }}
                />
              </div>
            )} */}
          <Input
            type="text"
            label="Min Price"
            name="min_price"
            value={productData.min_price || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={errors.min_price}
            allowNumbers={true}
          />
          <Input
            type="text"
            label="Max Price"
            name="max_price"
            value={productData.max_price || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={errors.max_price}
            allowNumbers={true}
          />
          <Input
            type="text"
            label="Product Range"
            name="product_count_range"
            value={productData.product_count_range || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={errors.product_count_range}
            allowNumbers={true}
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          value={productData.description || ""}
          onChange={handleInputChange}
          error={errors.description}
          disabled={!isEditing}
        />
        <div className="flex flex-wrap gap-4 rounded border p-3">
          {productData.images &&
            productData.images.map((image, index) => {
              return (
                <img
                  key={index}
                  className={`cursor-pointer w-32 h-32 object-cover rounded border border-gray-300`}
                  src={image.image}
                  alt={`image-${index}`}
                  onClick={() => openImageModal(index)}
                />
              );
            })}
        </div>
        {productData && productData.reject_reason && (
          <div className="mt-4 p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-2">
              Rejection Reason
            </h3>
            <p className="text-sm font-semibold text-red-800">
              {productData.reject_reason}
            </p>
          </div>
        )}
        <div className="mt-4 gap-3 flex justify-end p-4">
          {!isEditing ? (
            <Button
              text="Edit"
              color="bg-blue-500 w-40"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <>
              <Button
                text="Save"
                color="bg-green-500 w-40"
                onClick={() => handleSubmit()}
              />
              <Button
                text="Cancel"
                color="bg-gray-500 w-40"
                onClick={() => {
                  setIsEditing(false);
                  setNewProfilePicture(null);
                  setNewBanner(null);
                }}
              />
            </>
          )}
        </div>
      </div>
      <div>
        {rejectProduct ? (
          <div className="p-4 rounded shadow bg-white gap-3">
            <Textarea
              label="Reject reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={errors.reason}
            />
            <div className="flex justify-end mx-auto p-4 rounded shadow bg-white gap-3 mt-4">
              <Button
                text="Reject Product"
                color="bg-red-500 w-40"
                onClick={() => rejectProductForm()}
              />
              <Button
                text="Cancel"
                color="bg-gray-500 w-40"
                onClick={() => setRejectProduct(false)}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex justify-end mx-auto p-4 rounded shadow bg-white gap-3">
            <Button
              text="Approve Product"
              color="bg-blue-500 w-40"
              onClick={() => approveProduct()}
            />
            {productData && !productData.reject_reason && (
              <Button
                text="Reject Product"
                color="bg-red-500 w-40"
                onClick={() => setRejectProduct(true)}
              />
            )}
          </div>
        )}
      </div>
      {isModalOpen && currentImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <img
              src={productData.images[currentImageIndex].image}
              alt={`image-${currentImageIndex}`}
              className="max-w-full max-h-full"
            />
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
            >
              &lt;
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
              onClick={handleNextImage}
              disabled={currentImageIndex === productData.images.length - 1}
            >
              &gt;
            </button>
            <button className="absolute top-0 right-0 bg-red-500 p-2 rounded-full">
              X
            </button>
          </div>
        </div>
      )}

      {renderImageModal()}
    </div>
  );
}
