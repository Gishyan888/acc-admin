import { useLocation } from "react-router-dom";
import HeaderBanners from "./HeaderBanners";
import CompanyBanners from "./CompanyBanners";
import Navigation from "../../Components/Navigation";

export default function Banners() {
    const location = useLocation();
    
    const navItems = [
        { path: 'header-banners', label: 'Header Banners' },
        { path: 'company-banners', label: 'Company Banners' }
    ];

    return (
        <div className="w-full">
            <Navigation navItems={navItems} />
            <div className="w-full flex flex-col items-center justify-center">
                {location.pathname.includes('header-banners') ? <HeaderBanners /> : <CompanyBanners />}
            </div>
        </div>
    )
}