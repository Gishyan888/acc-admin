import api from "../../api/api";
import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import RichtextEditor from "../../Components/RichTextEditor";
import useModal from "../../store/useModal";

const animatedComponents = makeAnimated();

export default function MailingWithCompanies() {
  const { setModalDetails, resetModalDetails } = useModal();

  const statuses = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];
  const [allCompanies, setAllCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [errors, setErrors] = useState({});
  const [subject, setSubject] = useState("");
  const [editorValue, setEditorValue] = useState(null);

  useEffect(() => {
    let formattedSelectesStatuses = "";
    selectedStatuses &&
      selectedStatuses.length > 0 &&
      selectedStatuses.map((status) => {
        formattedSelectesStatuses += `${status.value + ","}`;
      });

    formattedSelectesStatuses = formattedSelectesStatuses.slice(0, -1);
    api
      .get(
        `/api/admin/company?paginate=false&status=${formattedSelectesStatuses}`
      )
      .then((res) => {
        const formattedCompanies = res.data.data.map((company) => ({
          label: company.company_name,
          value: company.id,
          status: company.status, 
        }));
        formattedCompanies.unshift({ label: "All", value: "all" });
        setCompanies(formattedCompanies);
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
  }, [selectedStatuses]);

  useEffect(() => {
    api
      .get(`/api/admin/company?paginate=false`)
      .then((res) => {
        const formattedCompanies = res.data.data.map((company) => ({
          label: company.company_name, 
          value: company.id,
          status: company.status, 
        }));
        setAllCompanies(formattedCompanies);
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
  }, []);

  const handleChange = (selecteds) => {
    if (selecteds.some((status) => status.value === "all")) {
      setSelectedCompanies(allCompanies);
    } else {
      setSelectedCompanies(selecteds);
    }

    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
  };

  const handleStatusesChange = (selecteds) => {
    setSelectedStatuses(selecteds.filter((status) => status.value !== "all"));

    if (selecteds[selecteds.length - 1].value === "all") {
      setSelectedStatuses([{ value: "all", label: "All" }]);
    }
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleEditorChange = (e) => {
    setEditorValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const apiURL = `/api/admin/email_message`;

    if (subject) {
      formData.append("subject", subject);
    }

    if (editorValue) {
      formData.append("message", editorValue);
    }

    selectedCompanies &&
      selectedCompanies.map((selectedCompany) =>
        formData.append("companies_id[]", selectedCompany.value)
      );

    api
      .post(apiURL, formData)
      .then((res) => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
          },
        });
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
        setErrors(err.response.data.errors);
      });
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-2">Contact with companies</h1> */}
      <div className="w-full mt-8">
        <div className="flex gap-4">
          <div className="w-1/4">
            <h1 className="mb-2">Select or search companies</h1>
            <Select
              className="contact_multiselect_component"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={companies}
              onChange={handleChange}
              value={selectedCompanies}
              placeholder="Select Companies"
            />
            {errors.companies_id && (
              <p className="text-red-500 text-xs mt-1">
                Please select at least one company.
              </p>
            )}
          </div>
          <div className="w-1/4">
            <h1 className="mb-2">Filter by statuses</h1>
            <Select
              className="contact_multiselect_component"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={statuses}
              onChange={handleStatusesChange}
              value={selectedStatuses}
              placeholder="Select Status"
            />
          </div>
        </div>
        <div className="mt-6">
          <Input
            label="Subject"
            name="subject"
            type="text"
            allowNumbers={false}
            value={subject}
            onChange={handleSubjectChange}
            error={errors.subject}
            required={true}
          />
          <div>
            <RichtextEditor
              containerClass="mt-4"
              label="Message *"
              name="message"
              value={editorValue}
              onChange={handleEditorChange}
              error={errors.message}
              needUploaderButton={false}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-4">
          <Button
            text="Send Message"
            color="bg-green-500 w-40"
            onClick={(e) => handleSubmit(e)}
          />
        </div>
      </div>
    </div>
  );
}
