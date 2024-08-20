import React from "react";
import AccountDetails from "./AccountDetails";
import UpdatePassword from "./UpdatePassword";
import Navigation from "../../Components/Navigation";
import { useLocation } from "react-router-dom";

export default function MyAccount() {
    const location = useLocation();
    
    const navItems = [
        { path: 'account-details', label: 'Account Details' },
        { path: 'update-password', label: 'Update Password' }
    ];

    return (
        <div className="w-full">
            <Navigation navItems={navItems} />
            <div className="w-full flex flex-col items-center justify-center">
                {location.pathname.includes('account-details') ? <AccountDetails /> : <UpdatePassword />}
            </div>
        </div>
    )
}