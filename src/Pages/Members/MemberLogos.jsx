import { useEffect, useState } from "react";
import api from "../../api/api";
import useModal from "../../store/useModal";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import Button from "../../Components/Button";
import FileUpload from "../../Components/FileUpload";

export default function MemberLogos() {
  const [memberLogos, setMemberLogos] = useState([]);
  const { setModalDetails, resetModalDetails } = useModal();
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMemberLogos = () => {
    setLoading(true);
    api
      .get(`/api/site/member_logos`)
      .then((res) => {
        setMemberLogos(res.data.data);
        setLoading(false);
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
        setLoading(false);
      });
  };

  const addMemberLogo = async () => {
    setLoading(true);

    const formData = new FormData();
    if (uploadedLogo) {
      formData.append("logo", uploadedLogo.file);
    }

    try {
      await api.post(`/api/admin/member_logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
        },
      });
      getMemberLogos();
      setLoading(false);
      setUploadedLogo(null);
    } catch (err) {
      setErrors(err.response.data.errors);
      setLoading(false);
    }
  };

  const deleteLogo = (id) => {
    setLoading(true);
    setModalDetails({
      isVisible: true,
      image: "warning",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api
          .delete(`/api/admin/member_logo/${id}`)
          .then(() => {
            getMemberLogos();
            setLoading(false);
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
            setLoading(false);
          })
          .finally(() => resetModalDetails());
      },
      onClose: () => resetModalDetails(),
    });
  };

  const handleUploadedLogoChange = (file) => {
    setUploadedLogo({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleUploadedLogoRemove = (e) => {
    setUploadedLogo(null);
  };

  useEffect(() => {
    getMemberLogos();
  }, []);

  return (
    <div className="w-full p-4 bg-gray-300">
      <div className="my-4 mx-2">
        <FileUpload
          file={uploadedLogo?.file}
          onFileSelect={handleUploadedLogoChange}
          onFileRemove={handleUploadedLogoRemove}
          buttonText="Upload New Logo"
          imageSize="w-1/3 h-64"
          tooltip="Remove Uploaded Logo"
        />
        {uploadedLogo && (
          <Button
            text={"Save"}
            color="bg-amber-600"
            onClick={addMemberLogo}
            className="mt-4 mx-2"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {memberLogos.map((item) => (
          <div
            key={item.id}
            className="h-[200px] w-[300px] bg-white relative m-2 border border-gray-200 rounded-md"
          >
            <img
              src={item.logo}
              alt="logo"
              className="object-cover h-full w-full rounded-md"
            />
            <TrashIcon
              onClick={() => {
                deleteLogo(item.id);
              }}
              className="h-6 w-6 absolute top-2 right-2 cursor-pointer text-red-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
