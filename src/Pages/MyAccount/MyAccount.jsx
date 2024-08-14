import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import AccountDetails from "./AccountDetails";
import UpdatePassword from "./UpdatePassword";

export default function MyAccount() {
    const location = useLocation();
  return (
    <div className="w-full">
        <Navigation />
       <div className="w-full h-max bg-gray-100/80 flex justify-center items-center">
       {location.pathname === '/my-account/account-details' ? <AccountDetails /> : <UpdatePassword />}
       </div>
    </div>
  )
}
