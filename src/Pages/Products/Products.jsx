import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/16/solid";
import Pagination from "../../Components/Pagination";
import usePagination from "../../store/usePagination";
import useModal from "../../store/useModal";
export default function Products() {
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = usePagination((state) => state.currentPage);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [companies, setCompanies] = useState([]);
  const setCurrentPage = usePagination((state) => state.setCurrentPage);
  const { setModalDetails, resetModalDetails } = useModal();

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    api
      .get(`/api/admin/company?paginate=${false}`)
      .then((res) => {
        setCompanies(res.data.data);
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
  }, [currentPage]);

  useEffect(() => {
    const companyFilter =
      selectedCompany === "all" ? "" : `&company_id=${selectedCompany}`;
    api
      .get(`/api/admin/products?page=${currentPage}${companyFilter}`)
      .then((res) => {
        setProductsData(res.data.data);
        setPageCount(res.data.meta.last_page);
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
  }, [currentPage, selectedCompany]);

  const getProduct = (product) => {
    navigate(`/product/${product.id}`);
  };
  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const getPriceRange = (price_ranges, currency) => {
    const product_price_range = price_ranges.find(
      (price) => price.Exchange === currency
    );
    if (product_price_range) {
      return `${product_price_range.Value} ${currency}`;
    }
    return "";
  };
  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <select
        value={selectedCompany}
        onChange={handleCompanyChange}
        className="mb-4 p-2 px-4 border rounded border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Companies</option>
        {companies.map((company, index) => (
          <option key={index} value={company.id}>
            {company.company_name}
          </option>
        ))}
      </select>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Price Range
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productsData.map((product, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => getProduct(product)}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  <EyeIcon className="h-5 w-5 text-blue-500" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {product.company_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {product.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <img className="h-10 w-10" src={product.main_image} alt="" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {getPriceRange(product.price_range, product.currency)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : product.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pageCount={pageCount} />
    </div>
  );
}
