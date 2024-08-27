import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "react-tooltip";
import Button from "../../Components/Button";
import api from "../../api/api";
import Modal from "../../Components/Modal";

export default function Banners() {
    const location = useLocation();
    const navigate = useNavigate();
    const [bannersData, setBannersData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);

    const closeModal = () => {
        setModalVisible(false);
        setSelectedBanner(null); // Clear the selected banner when the modal closes
    };

    const navItems = [
        { path: '/banners/header-banners', label: 'Header Banners' },
        { path: '/banners/company-banners', label: 'Company Banners' }
    ];

    const fetchBanners = () => {
        let apiURL = '';
        if (location.pathname.includes('header-banners')) {
            apiURL = 'api/site/banners/header';
        } else {
            apiURL = 'api/site/banners/companies';
        }
        api.get(apiURL)
            .then((res) => {
                setBannersData(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchBanners();
    }, [location.pathname]);

    const editBanner = (item) => {
        navigate(`${item.id}/edit`);
    };

    const deleteBannerModal = (item) => {
        setSelectedBanner(item); 
        setModalVisible(true);
    };

    const deleteBanner = () => {
        closeModal()          
        api.delete(`/banners/${selectedBanner.id}`)
            .then((res) => {
            fetchBanners()
            })
            .catch((err) => {
                console.log(err)
            })

    };

    const handleCreateEditBanner = () => {
        navigate('create');
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <Navigation navItems={navItems} />
                {bannersData.length < 5 &&
                    <Button
                        text="Add New Banner"
                        color="bg-amber-600"
                        onClick={() => handleCreateEditBanner()}
                    />}
            </div>
            <div className="w-full flex flex-col items-center justify-center bg-white p-2">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 font-bold text-left">Title</th>
                            {location.pathname.includes('company-banners') && <th className="px-4 py-2 font-bold text-left">Text</th>}
                            <th className="px-4 py-2 font-bold text-left">Image</th>
                            <th className="px-4 py-2 font-bold text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bannersData.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2 text-gray-800">{item.title}</td>
                                {location.pathname.includes('company-banners') && <td className="px-4 py-2 text-gray-800">{item.text}</td>}
                                <td className="px-4 py-2">
                                    <img className="w-14 h-14 object-cover" src={item.image} alt={item.title} />
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <div
                                        className="cursor-pointer"
                                            data-tooltip-id='tooltip'
                                            data-tooltip-content='Edit'
                                            onClick={() => editBanner(item)}>
                                            <PencilIcon className="w-6 h-6" />
                                        </div>
                                        <div
                                        className="cursor-pointer"
                                            data-tooltip-id='tooltip'
                                            data-tooltip-content='Delete'
                                            onClick={() => deleteBannerModal(item)}>
                                            <TrashIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                value={"Do you want to delete this banner?"}
                isVisible={modalVisible}
                onClose={closeModal}
                button1Text="Yes"
                button2Text="No"
                button1OnClick={deleteBanner}
                button2OnClick={closeModal}
                button1Color="bg-red-500"
                button2Color="bg-gray-500"
            />
            <Tooltip
                id='tooltip'
                style={{
                    backgroundColor: '#fff',
                    color: '#222',
                    boxShadow: '0 0 5px #ddd',
                    fontSize: '1rem',
                    fontWeight: 'normal',
                }}
            />
        </div>
    );
}
