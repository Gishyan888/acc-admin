import React, { useState } from 'react'
import Input from '../../Components/Input';

export default function AccountDetails() {

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 ~ AccountDetails ~ credentials:", credentials)

  }
  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center items-center gap-4 flex-col max-w-sm bg-white p-8 rounded-lg ">
      <Input
        label="Name"
        type="text"
        name="name"
        value={credentials.name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        type="text"
        name="email"
        value={credentials.email}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-3/5 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-2"
      >
        Update
      </button>
    </form>
  )
}
