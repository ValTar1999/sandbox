export type PaymentNetworkStatus =
  | "notInNetwork"
  | "invitationSent"
  | "linkRequestPending"
  | "inNetwork"
  | "requestReceived"
  | "rejected"
  | "track";

export interface Vendor {
  id: string;
  companyName: string;
  companyId: string;
  openPayables: number;
  paymentTerms: string;
  paymentMethods: ("card" | "bank" | "cash")[];
  paymentNetworkStatus: PaymentNetworkStatus;
  earlyPaymentOption: boolean;
}

export const vendors: Vendor[] = [
  {
    id: "1",
    companyName: "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.",
    companyId: "A0B1C0868",
    openPayables: 1,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank", "cash"],
    paymentNetworkStatus: "notInNetwork",
    earlyPaymentOption: false,
  },
  {
    id: "2",
    companyName: "Likang's Bakery",
    companyId: "A0B1C0566",
    openPayables: 4,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank"],
    paymentNetworkStatus: "invitationSent",
    earlyPaymentOption: false,
  },
  {
    id: "3",
    companyName: "Tres Comas Tequila",
    companyId: "A0B1C0234",
    openPayables: 6,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank", "cash"],
    paymentNetworkStatus: "linkRequestPending",
    earlyPaymentOption: false,
  },
  {
    id: "4",
    companyName: "Nichol Nickel Mining",
    companyId: "A0B1C0789",
    openPayables: 9,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank", "cash"],
    paymentNetworkStatus: "inNetwork",
    earlyPaymentOption: true,
  },
  {
    id: "5",
    companyName: "He's Organic Foods",
    companyId: "A0B1C0123",
    openPayables: 2,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank"],
    paymentNetworkStatus: "requestReceived",
    earlyPaymentOption: false,
  },
  {
    id: "6",
    companyName: "Lily's Flower Shop",
    companyId: "A0B1C0456",
    openPayables: 3,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank", "cash"],
    paymentNetworkStatus: "rejected",
    earlyPaymentOption: false,
  },
  {
    id: "7",
    companyName: "Rad Roofing",
    companyId: "A0B1C0890",
    openPayables: 5,
    paymentTerms: "Net30",
    paymentMethods: ["card"],
    paymentNetworkStatus: "track",
    earlyPaymentOption: true,
  },
  {
    id: "8",
    companyName: "Sam's Imaginary Pet Farm, LLC.",
    companyId: "A0B1C0345",
    openPayables: 7,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank", "cash"],
    paymentNetworkStatus: "track",
    earlyPaymentOption: true,
  },
  {
    id: "9",
    companyName: "Acme Supplies Inc.",
    companyId: "A0B1C0678",
    openPayables: 2,
    paymentTerms: "Net30",
    paymentMethods: ["bank", "cash"],
    paymentNetworkStatus: "inNetwork",
    earlyPaymentOption: true,
  },
  {
    id: "10",
    companyName: "Global Tech Partners",
    companyId: "A0B1C0901",
    openPayables: 12,
    paymentTerms: "Net30",
    paymentMethods: ["card", "bank"],
    paymentNetworkStatus: "notInNetwork",
    earlyPaymentOption: false,
  },
];

// Generate additional vendors to reach 97 total (matching reference design)
const statuses: PaymentNetworkStatus[] = [
  "notInNetwork",
  "invitationSent",
  "linkRequestPending",
  "inNetwork",
  "requestReceived",
  "rejected",
  "track",
];
const methods: ("card" | "bank" | "cash")[][] = [
  ["card", "bank", "cash"],
  ["card", "bank"],
  ["card"],
  ["bank", "cash"],
];
const names = [
  "Metro Supplies Co",
  "Pacific Distribution LLC",
  "Summit Manufacturing",
  "Valley View Foods",
  "Northern Logistics Inc",
  "Southern Trade Co",
  "Eastern Imports Ltd",
  "Western Commerce Group",
  "Central Services Corp",
  "Premier Partners",
];

for (let i = 11; i <= 97; i++) {
  vendors.push({
    id: String(i),
    companyName: `${names[(i - 11) % names.length]} ${i}`,
    companyId: `A0B1C${String(i).padStart(4, "0")}`,
    openPayables: (i % 15) + 1,
    paymentTerms: "Net30",
    paymentMethods: methods[i % methods.length],
    paymentNetworkStatus: statuses[i % statuses.length],
    earlyPaymentOption: i % 3 === 0,
  });
}
