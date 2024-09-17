import React, { useEffect, useState } from "react";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import api from "../../api/api";
import useModal from "../../store/useModal";

export default function MyAccount() {
  const { setModalDetails, resetModalDetails } = useModal();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    api
      .get("api/site/get-userdata")
      .then((res) => {
        setCredentials((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }));
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
  }, []);

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put("api/site/edit-profile", credentials)
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
    <div className="max-w-96 mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Details</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={credentials.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Email"
          type="text"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          error={errors.email}
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
          Change Password
        </h2>
        <Input
          label="Old Password"
          type="password"
          name="old_password"
          value={credentials.old_password}
          onChange={handleChange}
          error={errors.old_password}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          value={credentials.password_confirmation}
          onChange={handleChange}
          error={errors.password_confirmation}
        />
        <Button
          text="Update"
          color="bg-amber-600 mt-4"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
