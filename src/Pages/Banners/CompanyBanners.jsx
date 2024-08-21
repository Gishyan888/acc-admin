import { useState } from "react";
import Input from "../../Components/Input";
import Textarea from "../../Components/Textarea";
import Button from "../../Components/Button";

export default function CompanyBanners() {
  const [credentials, setCredentials] = useState({
    title: "",
    link: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 ~ CompanyBanners ~ credentials:", credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md flex flex-col">
      <div className='flex gap-4 w-full flex-col'>
       <div className="flex gap-3 w-full">
       <Input
          label="Title"
          type="text"
          name="title"
          value={credentials.title}
          onChange={handleChange}
        />
        <Input
          label="Link"
          type="text"
          name="link"
          value={credentials.link}
          onChange={handleChange}
        />
       </div>
        <Textarea
          label="Description"
          name="description"
          value={credentials.description}
          onChange={handleChange}
          placeholder="Enter banner description"
        />
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
