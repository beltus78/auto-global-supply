export const BUSINESS = {
  brand: "Auto Global Supply",
  legalName: "AUTO SPARE PARTS IMPORT EXPORT LLC",
  registration: "L24000026269",
  address: "13740 NW 19th Avenue, Unit 6, Opa-locka, FL 33054, United States",
  email: "sales@autoglobalsupply.com",
  website: "https://autoglobalsupply.com",
  usPhone: "+1 719-512-5025",
  usPhoneHref: "tel:+17195125025",
  internationalPhone: "+852 4648 1747",
  internationalPhoneHref: "tel:+85246481747",
  chinaWarehouse: {
    label: "China Warehouse, Guangzhou",
    address: "Room 101, Building 1, No. 4 Niugushi Street, Huadong Town, Huadu District, Guangzhou, Guangdong, China",
    role: "Warehouse and operational location. Not the company's US registered or principal office.",
  },
  whatsapp: "17195125025",
} as const;

export function whatsappUrl(message = "Hello Auto Global Supply, I'm interested in an auto part.") {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
