import { useState } from "react";
import Button from "../base/Button";
import MastercardFlag from "../../assets/image/mastercard-flag.svg";

type AccountDetailsVariant = "bank" | "card" | "smart-disburse";

type SmartDisburseContact = {
  id: string;
  type: "email" | "phone";
  value: string;
  label?: string;
  subLabel?: string;
};

interface AccountDetailsProps {
  variant?: AccountDetailsVariant;
  smartDisburseContacts?: SmartDisburseContact[];
}

type DetailRow = {
  label: string;
  value: React.ReactNode;
};

const AccountDetails = ({
  variant = "bank",
  smartDisburseContacts = [],
}: AccountDetailsProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isCard = variant === "card";
  const isSmartDisburse = variant === "smart-disburse";

  const smartEmail = smartDisburseContacts.find((item) => item.type === "email");
  const smartPhone = smartDisburseContacts.find((item) => item.type === "phone");

  const rows: DetailRow[] = isSmartDisburse
    ? [
        { label: "Email", value: smartEmail?.value ?? "-" },
        { label: "Phone Number", value: smartPhone?.value ?? "-" },
      ]
    : isCard
    ? [
        { label: "Name on Card", value: "Johnny Anderson" },
        { label: "Number", value: isRevealed ? "5454 8282 8282 8282" : "••••8282" },
        { label: "CVC2", value: isRevealed ? "123" : "•••" },
        { label: "Expires", value: "12 / 2024" },
        {
          label: "Type",
          value: <img src={MastercardFlag} alt="Mastercard" className="h-4 w-6" />,
        },
        {
          label: "Billing Address",
          value: (
            <div>
              <div>3476 Orphan Road</div>
              <div>Hayward, Wisconsin, 54843,</div>
              <div>United States</div>
            </div>
          ),
        },
      ]
    : [
        { label: "Account Holder Name", value: "Big Kahuna Burger Ltd" },
        { label: "Routing Number", value: isRevealed ? "123455667" : "•••••5667" },
        {
          label: "Account Number",
          value: isRevealed ? "09886785764625615" : "••••••••••••5615",
        },
        {
          label: "Address",
          value: (
            <div>
              <div>1 Chapel Hill Rd</div>
              <div>Heswall, Short Hills</div>
              <div>NJ 07078, US</div>
            </div>
          ),
        },
      ];

  const containerClassName = isCard
    ? "mb-4 rounded-lg border border-gray-200 bg-white"
    : "mb-4 rounded-lg border border-gray-200 bg-gray-50";
  const headerClassName = isCard
    ? "border-b border-gray-200 bg-gray-100 px-4 py-2"
    : "flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2";
  const title = isSmartDisburse
    ? "SMART Disburse Details"
    : isCard
      ? "Card Details"
      : "Account Details";

  return (
    <div className={containerClassName}>
      <div className={headerClassName}>
        <div className="text-sm font-semibold text-gray-900 leading-5">{title}</div>
        {!isCard && !isSmartDisburse && (
          <Button variant="linkSecondary" icon="pencil" iconDirection="right" size="xs">
            Edit
          </Button>
        )}
      </div>
      <div className="px-4 py-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-y-2 text-sm leading-5">
          {rows.map((row) => (
            <div key={row.label} className="contents">
              <div className="text-gray-900 font-medium">{row.label}</div>
              <div className="text-gray-700">{row.value}</div>
            </div>
          ))}
        </div>
        {!isSmartDisburse && (
          <div className="mt-2 grid grid-cols-2">
            <Button
              variant="linkPrimary"
              icon={isRevealed ? "eye-off" : "eye"}
              iconDirection="left"
              size="sm"
              onClick={() => setIsRevealed((prev) => !prev)}
              className="col-start-2 justify-self-start -ml-1.5"
            >
              {isRevealed ? "Hide Details" : "Reveal Details"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
