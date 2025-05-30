import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  UsersIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
  CreditCardIcon,
  FlagIcon,
  PresentationChartLineIcon,
  LinkIcon,
  EnvelopeIcon,
  SquaresPlusIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import logo from "../Images/acc-logo.png";
import useModal from "../store/useModal";
import api from "../api/api";
export default function Sidebar() {
  const [reports, setReports] = useState({});
  const { setModalDetails, resetModalDetails } = useModal();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");
  const [open, setOpen] = useState(0);
  const [unconfirmedCompaniesCount, setUnconfirmedCompaniesCount] = useState(0);

  useEffect(() => {
    const pathname = location.pathname.split("/")[1];
    if (pathname.includes("banners")) {
      setActiveTab("Banners");
    } else if (pathname.includes("compan")) {
      setActiveTab("Companies");
    } else if (pathname.includes("product")) {
      setActiveTab("Products");
    } else if (pathname.includes("cms")) {
      setActiveTab("CMS");
    } else if (pathname.includes("pages")) {
      setActiveTab("Pages");
    } else if (pathname.includes("categories-and-standarts")) {
      setActiveTab("Categories and Standarts");
    } else if (pathname.includes("seo")) {
      setActiveTab("SEO management");
    } else if (pathname.includes("contact")) {
      setActiveTab("Company Contacts");
    } else if (pathname.includes("mailing-with")) {
      setActiveTab("Mailing with");
    } else if (pathname.includes("member-logos")) {
      setActiveTab("Member Logos");
    } else if (pathname.includes("history")) {
      setActiveTab("History");
    } else {
      setActiveTab("Dashboard");
    }
  }, [location]);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = () => {
    let apiURL = `/api/site/reports`;
    api
      .get(apiURL)
      .then((res) => {
        setReports(res?.data);
        const count =
          res?.data?.company_count.rejected +
          res?.data?.company_count.pending +
          res?.data?.company_count.suspended;
        setUnconfirmedCompaniesCount(count);
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
  };

  const tabs = {
    section1: [
      {
        name: "Dashboard",
        icon: PresentationChartBarIcon,
        link: "/",
      },
      {
        name: "Banners",
        icon: PresentationChartLineIcon,
        link: "/banners/header-banners",
      },
      {
        name: "Companies",
        icon: UsersIcon,
        link: "/companies",
        hasCountIcon: true,
        count: unconfirmedCompaniesCount,
      },
      {
        name: "Products",
        icon: DocumentTextIcon,
        link: "/products",
      },
      {
        name: "CMS",
        icon: ShoppingBagIcon,
        link: "/cms/overview",
      },
      {
        name: "Pages",
        icon: DocumentChartBarIcon,
        link: "/pages/blog",
      },
      {
        name: "Categories and Standarts",
        icon: Cog6ToothIcon,
        link: "/categories-and-standarts/categories",
      },
      {
        name: "SEO management",
        icon: Cog6ToothIcon,
        link: "/seo/homepage",
      },
      {
        name: "Company Contacts",
        icon: LinkIcon,
        link: "/contacts",
      },
      {
        name: "Mailing with Companies",
        icon: EnvelopeIcon,
        link: "/mailing-with",
      },
      {
        name: "Member Logos",
        icon: SquaresPlusIcon,
        link: "/member-logos",
      },
      {
        name: "Mailing history",
        icon: ClockIcon,
        link: "/mailing-history",
      },
    ],
    section2: [
      {
        name: "Logout",
        icon: PowerIcon,
        link: "/login",
      },
    ],
  };

  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const renderListItem = (item, index) => {
    const Icon = item.icon;
    return (
      <ListItem
        key={index}
        onClick={() => handleClick(item)}
        className={activeTab === item.name ? "bg-blue-gray-50" : ""}
      >
        <ListItemPrefix>
          <Icon className="h-5 w-5" />
        </ListItemPrefix>
        <div className="relative">
          {item.name}
          {item.hasCountIcon && (
            <span className="absolute top-[-5px] right-[-12px] text-blue-700 font-bold">
              {item.count}
            </span>
          )}
        </div>
      </ListItem>
    );
  };
  const renderAccordion = (item, index) => {
    return (
      <Accordion
        key={index}
        open={open === index + 1}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              open === index + 1 ? "rotate-180" : ""
            }`}
          />
        }
      >
        <ListItem className="p-0" selected={open === index + 1}>
          <AccordionHeader
            onClick={() => handleOpen(index + 1)}
            className="border-b-0 p-3"
          >
            <ListItemPrefix>
              <item.icon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              {item.name}
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="p-0">
            {item.submenu.map((subItem, subIndex) => (
              <ListItem key={subIndex} onClick={() => handleClick(subItem)}>
                {subItem.name}
              </ListItem>
            ))}
          </List>
        </AccordionBody>
      </Accordion>
    );
  };

  const handleClick = (item) => {
    if (item.link) {
      if (item.name === "Logout") {
        logout();
        navigate("/login");
      } else {
        navigate(item.link);
      }
    } else {
      console.log(`🚀 No link defined for ${item.name}`);
    }
  };

  return (
    <Card className="min-h-screen w-full max-w-[20rem] p-4 shadow shadow-blue-gray-700 rounded-none overflow-auto">
      <div className="mb-2">
        <Typography
          className="cursor-pointer flex justify-center items-center"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" />
        </Typography>
      </div>
      <List className="flex flex-col justify-between h-full">
        <div>
          <div>
            {tabs.section1.map((item, index) =>
              item.submenu
                ? renderAccordion(item, index)
                : renderListItem(item, index)
            )}
          </div>
        </div>

        <div>
          <hr className="my-2 border-blue-gray-50" />
          {tabs.section2.map((item, index) =>
            item.submenu
              ? renderAccordion(item, index)
              : renderListItem(item, index)
          )}
        </div>
      </List>
    </Card>
  );
}
