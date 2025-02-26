import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import StyledSelect from "../../Components/StyledSelect";
import useModal from "../../store/useModal";

export default function Company() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newBanner, setNewBanner] = useState(null);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [rejectCompany, setRejectCompany] = useState(false);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalDetails, resetModalDetails } = useModal();
  const [selectedStandards, setSelectedStandards] = useState([]);
  const profileFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);

  const firmLevelOptions = [
    { value: 1, label: "Basic" },
    { value: 2, label: "Top Rated" },
  ];

  const statusOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
  ];

  function yearsRange(from) {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = from; i <= currentYear; i++) {
      years.unshift(i);
    }
    return years;
  }

  const years = yearsRange(1900);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = () => {
    api
      .get(`/api/admin/company/${id}`)
      .then((res) => {
        setCompanyData(res.data.data);
        setSelectedStandards(res.data.data.standards);
      })
      .catch((err) => console.error(err));
    api
      .get("/api/site/countries")
      .then((res) => {
        setCountries(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const formatInputValue = (value, type) => {
    if (!type) return value;
    if (!value) {
      return "";
    }
    if (typeof value === "number") {
      value = value.toString();
    }
    if (typeof value === "string") {
      if (type === "phone_number") {
        return value.replace(/[^0-9+]/g, "");
      }
    }
    return value;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name == "country") {
      const currentCountry = countries.find((country) => country.id == value);
      setRegions(currentCountry?.regions);
      setCompanyData((prevData) => ({
        ...prevData,
        ["region"]: null,
      }));
    }

    if (name == "phone_number") {
      value = formatInputValue(value, "phone_number");
    }
  };

  const handleSelectChange = (selectedOption, name) => {
    handleInputChange({
      target: {
        name,
        value: selectedOption.value,
      },
    });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "profile") {
          setNewProfilePicture({ file, preview: reader.result });
        } else if (type === "banner") {
          setNewBanner({ file, preview: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(companyData)) {
      if (key === "user" || key === "banner" || key === "profile_picture") {
        continue;
      } else {
        // value = value ? value : "";
        formData.append(key, value ?? "");
      }
    }
    if (selectedStandards && selectedStandards.length) {
      selectedStandards.forEach((standard, index) => {
        formData.append(`standards[${index}]`, standard.id.toString());
      });
    }

    if (newProfilePicture) {
      formData.append("profile_picture", newProfilePicture.file);
    }
    if (newBanner) {
      formData.append("banner", newBanner.file);
    }
    formData.append("_method", "PUT");
    try {
      await api.post(`/api/admin/company/${id}`, formData, {
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
      fetchCompanyData();
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  const approveCompany = async () => {
    try {
      await api.post(`api/admin/company-status/${id}?_method=PUT&do=approved`);
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
          navigate(-1);
        },
      });
    } catch (err) {
      console.error(
        "Error during form submission:",
        err.response || err.message || err
      );
    }
  };

  const rejectCompanyForm = async () => {
    try {
      await api.post(`api/admin/company-status/${id}?_method=PUT&do=rejected`, {
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
      resetModalDetails();
      setModalDetails({
        isVisible: true,
        image: "fail",
        errorMessage: err.response?.data?.message || "An error occurred",
        onClose: () => {
          resetModalDetails();
        },
      });
    }
  };

  const handleClick = (type) => {
    if (type === "profile") {
      profileFileInputRef.current.click();
    } else if (type === "banner") {
      bannerFileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (companyData && companyData.country && countries) {
      const currentCountry = countries?.find(
        (country) => country.id == companyData.country
      );
      if (currentCountry) {
        setRegions(currentCountry.regions);
      }
    }
  }, [companyData, countries]);

  return (
    <div className="flex flex-col pt-1 pb-4">
      <div className="rounded shadow bg-white">
        <div className="mb-32 relative">
          <img
            src={newBanner ? newBanner.preview : companyData.banner}
            alt="Banner"
            className="w-full h-[740px] object-cover rounded mb-2"
          />
          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={() => handleClick("banner")}
                type="button"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span>Edit Image</span>
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  onChange={(e) => handleImageChange(e, "banner")}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </button>
            </div>
          )}
          <div className="flex w-2/3 justify-start gap-5 items-end absolute -bottom-24 left-12">
            <div>
              <img
                src={
                  newProfilePicture
                    ? newProfilePicture.preview
                    : companyData.profile_picture
                }
                alt="Profile"
                className="min-w-40 h-40 object-cover mb-2"
              />
              {isEditing && (
                <button
                  onClick={() => handleClick("profile")}
                  type="button"
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  <span>Edit Logo</span>
                  <input
                    type="file"
                    ref={profileFileInputRef}
                    onChange={(e) => handleImageChange(e, "profile")}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </button>
              )}
            </div>
            <Input
              label="Company Name"
              name="company_name"
              type="text"
              allowNumbers={false}
              value={companyData.company_name || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              error={errors.company_name}
            />
            <div className="flex gap-3 ml-16">
              <StyledSelect
                label="Firm Level"
                options={firmLevelOptions}
                value={firmLevelOptions.find(
                  (option) => option.value == companyData?.firm_level
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "firm_level")
                }
                isDisabled={!isEditing}
              />
              <StyledSelect
                label="Status"
                options={statusOptions}
                value={statusOptions.find(
                  (option) => option.value == companyData?.status
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "status")
                }
                isDisabled={true}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 p-6">
          {[
            "brand_name",
            "business_address",
            "business_type",
            "city",
            "company_info",
            "company_type",
            "contact_person",
            "country",
            "email",
            "employees",
            "legal_address",
            "phone_number",
            "region",
            "tax_account_number",
            "website_url",
            "whatsapp",
            "year_of_found",
          ].map((field) => {
            if (
              field === "region" ||
              field === "country" ||
              field === "year_of_found"
            ) {
              return (
                <div key={field} className="flex flex-col w-full max-w-80">
                  <label className="text-sm font-medium mb-1">
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())
                      .replace(/\bOf\b/g, (char) => char.toLowerCase())}{" "}
                  </label>

                  <select
                    name={field}
                    value={companyData[field] || ""}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!isEditing}
                  >
                    {field === "region" &&
                      regions?.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    {field === "country" &&
                      countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    {field === "year_of_found" &&
                      years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>
              );
            } else {
              return (
                <Input
                  key={field}
                  label={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                    .replace(/\bOf\b/g, (char) => char.toLowerCase())}
                  name={field}
                  type="text"
                  allowNumbers={["employees", "year_of_found"].includes(field)}
                  value={String(companyData[field] || "")}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  error={errors[field]}
                />
              );
            }
          })}

          {/* certificates */}
          {companyData?.standards?.length > 0 && (
            <div className="flex flex-col w-full max-w-80">
              <label className="text-sm font-medium mb-1">Certificates</label>

              <select
                name={"standards"}
                value={
                  selectedStandards
                    ? selectedStandards.length > 1
                      ? selectedStandards[0].id
                      : ""
                    : ""
                }
                onChange={() => {}}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={!isEditing}
              >
                {companyData?.standards?.map((standard) => (
                  <option key={standard.id} value={standard.id + ""} disabled>
                    {standard.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {companyData && companyData.reject_reason && (
          <div className="mt-4 p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-2">
              Rejection Reason
            </h3>
            <p className="text-sm font-semibold text-red-800">
              {companyData.reject_reason}
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
        {rejectCompany ? (
          <div className="p-4 rounded shadow bg-white gap-3">
            <textarea
              placeholder="Enter reason for rejection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              name="reason"
              id="reason"
              cols="30"
              rows="10"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
            ></textarea>
            <div className="flex justify-end mx-auto p-4 rounded shadow bg-white gap-3 mt-4">
              <Button
                text="Reject Company"
                color="bg-red-500 w-40"
                onClick={() => rejectCompanyForm()}
              />
              <Button
                text="Cancel"
                color="bg-gray-500 w-40"
                onClick={() => setRejectCompany(false)}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex justify-end mx-auto p-4 rounded shadow bg-white gap-3">
            {companyData && companyData.status !== "Approved" && (
              <Button
                text="Approve Company"
                color="bg-blue-500 w-40"
                onClick={() => approveCompany()}
              />
            )}

            {companyData &&
              !companyData.reject_reason &&
              companyData.status !== "Suspended" && (
                <Button
                  text="Reject Company"
                  color="bg-red-500 w-40"
                  onClick={() => setRejectCompany(true)}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
