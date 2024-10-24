import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function MailingHistoryData() {
  const { id } = useParams();
  const [mailingData, setMailingData] = useState(null);

  const getMailingHistoryData = () => {
    api
      .get(`/api/admin/email_message/history/${id}`)
      .then((res) => {
        setMailingData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getMailingHistoryData();
  }, []);

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold">Mailing History</h1>
      <div className="mt-8">
        <p className="my-4">
          <span className="underline font-bold">Subject:</span>{" "}
          <span className="mx-2">{mailingData?.subject}</span>
        </p>

        <div className="my-8 flex gap-4">
          <span className="underline font-bold">To:</span>{" "}
          <div className="flex gap-2 flex-wrap">
            {mailingData?.companies.map((company, index) => (
              <span
                className="mx-2 px-4 py-2 bg-gray-300 rounded-full text-sm"
                key={index}
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: mailingData?.message }}></div>
      </div>
    </div>
  );
}
