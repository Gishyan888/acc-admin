import React, { useState } from 'react';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

export default function MyAccount() {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        old_password: "",
        password: "",
        confirm_password: "",
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
        console.log("🚀 ~ AccountDetails ~ credentials:", credentials);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Details</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Name"
                    type="text"
                    name="name"
                    value={credentials.name}
                    onChange={handleChange} />
                <Input
                    label="Email"
                    type="text"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange} />
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">Change Password</h2>
                <Input
                    label="Old Password"
                    type="password"
                    name="old_password"
                    value={credentials.old_password}
                    onChange={handleChange} />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange} />
                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirm_password"
                    value={credentials.confirm_password}
                    onChange={handleChange} />
                <Button
                    text="Update"
                    color="bg-amber-600 mt-4"
                    onClick={handleSubmit}
                />
            </form>
        </div>
    );
}
