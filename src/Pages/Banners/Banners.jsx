import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import { useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "react-tooltip";
import Button from "../../Components/Button";

export default function Banners() {
    const location = useLocation();
    const navigate = useNavigate()
    const navItems = [
        { path: '/banners/header-banners', label: 'Header Banners' },
        { path: '/banners/company-banners', label: 'Company Banners' }
    ];

    useEffect(() => {
        let apiURL = ''
        if (location.pathname.includes('header-banners')) {
            apiURL = '/admin/header_banners'
        } else {
            apiURL = '/admin/company_banners'
        }

        console.log("🚀 ~ useEffect ~ apiURL:", apiURL)


    }, [location.pathname])

    let data = [
        {
            "id": 1,
            "title": "The Starry Night",
            "text": "The Starry Night is a painting by the Dutch post-impressionist painter Vincent van Gogh. Painted in 1889.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
        },
        {
            "id": 2,
            "title": "The Persistence of Memory",
            "text": "The Persistence of Memory is a 1931 painting by the surrealist artist Salvador Dalí. It depicts the landscape of the human mind, with melting clocks representing the fluidity of time.",
            "image": "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg"
        },
        {
            "id": 3,
            "title": "The Scream",
            "text": "The Scream is a painting by the Norwegian expressionist artist Edvard Munch, created in 1893. It depicts a figure on a bridge, with a distorted, anguished face and a swirling, colorful background.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg"
        },
        {
            "id": 4,
            "title": "Guernica",
            "text": "Guernica is a painting by the Spanish artist Pablo Picasso, created in 1937. It depicts the bombing of the town of Guernica during the Spanish Civil War, with a powerful and distressing imagery.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
        },
        {
            "id": 5,
            "title": "American Gothic",
            "text": "American Gothic is a painting by the American artist Grant Wood, created in 1930. It depicts a stern-looking farmer standing beside a woman, likely his wife, in front of a white house.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg"
        }
    ]

    const editBanner = (item) => {
        console.log("🚀 ~ editBanner ~ item:", item)
    }

    const deleteBanner = (item) => {
        console.log("🚀 ~ deleteBanner ~ item:", item)
    }

    const handleCreateDeleteBanner = () => {
        navigate('create')
    }
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
            <Navigation navItems={navItems} />
            <Button
                    text="Add New Banner"
                    color="bg-amber-600"
                    onClick={() => handleCreateDeleteBanner()}
                />
            </div>
            <div className="w-full flex flex-col items-center justify-center bg-white p-2">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 font-bold text-left">Title</th>
                            <th className="px-4 py-2 font-bold text-left">Text</th>
                            <th className="px-4 py-2 font-bold text-left">Image</th>
                            <th className="px-4 py-2 font-bold text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="border-b cursor-pointer" >
                                <td className="px-4 py-2 text-gray-800">{item.title}</td>
                                <td className="px-4 py-2 text-gray-800">{item.text}</td>
                                <td className="px-4 py-2">
                                    <img className="w-14 h-14 object-cover" src={item.image} alt={item.title} />
                                </td>
                                <td className="px-4 py-2">
                                    <div className=" flex justify-center items-center gap-2 text-blue-500">
                                        <div
                                            data-tooltip-id='tooltip'
                                            data-tooltip-content='Edit'
                                            onClick={() => editBanner(item)}>
                                            <PencilIcon className="w-6 h-6" />
                                        </div>
                                        <div
                                            data-tooltip-id='tooltip'
                                            data-tooltip-content='Delete'
                                            onClick={() => deleteBanner(item)}>
                                            <TrashIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
    )
}