// Landing pages for the two priority search themes: dashboards and interior parts.
// Copy here is the main lever for rankings; the scheduled SEO task may extend it.

export type HubFaq = [question: string, answer: string];
export type Hub = {
  key: "dashboards" | "interior-parts";
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  types: string[]; // part type slugs listed on the hub
  featuredTypes: string[]; // shown as large tiles
  tableTypes: { s: string; label: string }[]; // columns on brand pages
  sections: { h: string; p: string[]; list?: string[] }[];
  faq: HubFaq[];
  guides: string[];
  upgradeCategories: string[];
  makeTitle: (make: string) => string;
  makeDescription: (make: string, models: string, count: number) => string;
  makeIntro: (make: string, models: string) => string;
  searchPhrases: string[];
};

export const HUBS: Record<Hub["key"], Hub> = {
  dashboards: {
    key: "dashboards",
    path: "/dashboards",
    title: "Car Dashboards & Dashboard Upgrade Kits | Auto Global Supply",
    description: "Replacement car dashboards, dashboard upgrade kits, instrument clusters and infotainment screens for Mercedes-Benz, BMW, Range Rover, Porsche and more. Free US shipping in 1 to 3 business days.",
    eyebrow: "Dashboards · clusters · screens · upgrade kits",
    h1: "Car dashboards and dashboard upgrade kits",
    intro: "Replacement dashboard assemblies, complete dashboard upgrade kits, instrument clusters, infotainment screens and steering wheels. Dashboards are our most requested interior part, led by the Mercedes-Benz V-Class and Vito W447.",
    types: ["dashboard", "dashboard-upgrade-kit", "instrument-cluster", "infotainment-screen", "infotainment-head-unit", "infotainment-upgrade", "steering-wheel", "centre-console"],
    featuredTypes: ["dashboard", "dashboard-upgrade-kit", "instrument-cluster", "infotainment-screen"],
    tableTypes: [
      { s: "dashboard", label: "Dashboard" },
      { s: "dashboard-upgrade-kit", label: "Upgrade kit" },
      { s: "instrument-cluster", label: "Cluster" },
      { s: "infotainment-screen", label: "Screen" },
      { s: "steering-wheel", label: "Steering wheel" },
      { s: "centre-console", label: "Console" },
    ],
    sections: [
      {
        h: "Replacement dashboard or upgrade kit?",
        p: [
          "A replacement dashboard is the same design your car left the factory with. It is the right choice after airbag deployment, cracking, sun damage or a fire, when you want the cabin to look and work exactly as before. We match it by steering side, trim color and equipment, so the vents, display and head-up unit line up with what is already in the car.",
          "A dashboard upgrade kit replaces the original design with a later one. On the Mercedes-Benz V-Class and Vito W447, for example, customers fit the later wide-screen dashboard to earlier vans. A kit normally includes the dashboard, vents, screens, center console, controller or touchpad and wiring. Some kits also include the steering wheel and airbag. Because a kit changes the electrical layout, it is a conversion rather than a bolt-on part.",
        ],
      },
      {
        h: "What we check before quoting a dashboard",
        p: ["A dashboard that arrives in the wrong configuration cannot be fitted, so we confirm these points against your VIN first:"],
        list: [
          "Left- or right-hand drive. Dashboards are built for one steering side only.",
          "Trim material and color, including leather-covered or stitched upper sections.",
          "Head-up display, passenger airbag position and knee airbags.",
          "Infotainment generation and screen size, which change the dashboard cut-outs.",
          "For upgrade kits: every component included, the wiring adaptation needed and whether coding is required.",
        ],
      },
      {
        h: "Instrument clusters, screens and head units",
        p: [
          "Digital instrument clusters and infotainment screens fail more often than the dashboard itself. A cluster stores mileage and vehicle data and must be coded to the car by a qualified repair shop after fitting. Screens are matched by size and connector type, and head units by hardware number and region. Send the part number printed on the back of your unit and we can usually identify the replacement straight away.",
        ],
      },
      {
        h: "Shipping a dashboard",
        p: [
          "Dashboards are large and easy to damage, so they travel crated or in reinforced cartons with the vents and screens packed separately. Shipping is free within the US and takes 1 to 3 business days, complete kits and multi-van orders included. The packing method is stated in your quotation.",
        ],
      },
    ],
    faq: [
      ["Do you sell dashboards for the Mercedes V-Class and Vito W447?", "Yes. W447 dashboards and dashboard upgrade kits are the interior parts we are asked for most. We supply replacement dashboards and complete upgrade kits with vents, screens, console, controller and wiring, matched to left- or right-hand drive."],
      ["Is a dashboard upgrade kit plug-and-play?", "No. A kit changes the dashboard design and the wiring behind it, so treat it as a conversion. We check the kit against your VIN and list every component in the quotation, and your installer handles wiring adaptation and coding."],
      ["Can I replace a cracked or airbag-damaged dashboard?", "Yes. We supply replacement dashboards in the original design, matched by steering side, trim color and equipment. After airbag deployment the airbag modules and control unit also need replacing, and we can quote those with the dashboard."],
      ["Do I need coding after replacing an instrument cluster?", "Almost always. Clusters store mileage and vehicle data and must be coded to the car by a qualified repair shop. We match the cluster by part number so that coding is possible."],
      ["What do you need to quote a dashboard?", "Your VIN, the steering side, photographs of the current dashboard and, for upgrade kits, a description or photo of the look you want. The VIN settles most of the fitment questions."],
      ["Do you ship dashboards to every US state?", "Yes, and shipping is free. Dashboards are crated or packed in reinforced cartons and arrive in 1 to 3 business days."],
    ],
    guides: ["mercedes-w447-dashboard-upgrade-guide", "mercedes-s-class-w222-dashboard-peeling-replacement", "ford-f-150-dashboard-replacement-guide", "dashboard-upgrade-kits-what-to-check-before-ordering", "replacement-car-dashboard-new-used-or-upgrade"],
    upgradeCategories: ["Interior & Infotainment"],
    makeTitle: (make) => `${make} Dashboards & Dashboard Kits`,
    makeDescription: (make, models, count) => `${make} dashboards, upgrade kits, instrument clusters and screens for ${models}. ${count} listings, matched to your VIN. Free US shipping.`,
    makeIntro: (make, models) => `Replacement dashboards, dashboard upgrade kits, instrument clusters, infotainment screens, steering wheels and consoles for the ${make} ${models}. Choose your model and generation below. Every dashboard is matched to your VIN for steering side, trim and equipment before we quote.`,
    searchPhrases: ["V-Class W447 dashboard kit", "S-Class W222 dashboard", "G-Class W463A dashboard", "X5 G05 instrument cluster", "Range Rover L405 dashboard"],
  },
  "interior-parts": {
    key: "interior-parts",
    path: "/interior-parts",
    title: "Car Interior Parts: Seats, Dashboards & Trim | Auto Global Supply",
    description: "Car interior parts for BMW, Mercedes-Benz, Range Rover, Porsche and more: seats, dashboards, steering wheels, consoles, door panels, trim and VIP van interiors.",
    eyebrow: "Seats · dashboards · steering wheels · trim · conversions",
    h1: "Car interior parts",
    intro: "Seats and seat sets, dashboards, steering wheels, center consoles, door panels, headliners, trim and complete interior conversions, including VIP interiors for the Mercedes-Benz V-Class, Vito and Sprinter.",
    types: ["front-seat-set", "complete-seat-set", "rear-seat", "dashboard", "dashboard-upgrade-kit", "steering-wheel", "centre-console", "door-panel-set", "headliner", "interior-trim-set", "interior-upgrade-package", "vip-interior-conversion"],
    featuredTypes: ["complete-seat-set", "dashboard", "steering-wheel", "vip-interior-conversion"],
    tableTypes: [
      { s: "front-seat-set", label: "Front seats" },
      { s: "complete-seat-set", label: "Seat set" },
      { s: "dashboard", label: "Dashboard" },
      { s: "steering-wheel", label: "Steering wheel" },
      { s: "centre-console", label: "Console" },
      { s: "door-panel-set", label: "Door panels" },
    ],
    sections: [
      {
        h: "Interior parts matched to your car's trim",
        p: [
          "Interior parts depend on more than the model. The same car can leave the factory with several seat designs, leather colors, stitching patterns, wood or carbon trims and equipment levels. We match interior parts by VIN and by photographs of your current interior, and for used parts we send photographs of the actual items before you confirm.",
        ],
      },
      {
        h: "Seats and seat sets",
        p: [
          "Front seat pairs, rear seats and complete front-and-rear sets. Heating, ventilation, massage, memory and side airbags all change the seat and its wiring, so we check each function against your vehicle. Complete sets are popular for color changes and for upgrading to a sport or comfort seat design.",
        ],
      },
      {
        h: "Dashboards, steering wheels and consoles",
        p: [
          "Replacement dashboards and dashboard upgrade kits are covered on our dashboards page. Steering wheels are matched by rim design, heating, shift paddles and driver-assistance buttons, and are supplied without the airbag module. Center consoles are matched by color and by the controls they carry.",
        ],
      },
      {
        h: "Interior upgrades and VIP conversions",
        p: [
          "For vans such as the Mercedes-Benz V-Class, Vito and Sprinter we supply complete passenger-cabin conversions: captain chairs, partitions, roof and floor trim, lighting, tables, fridges and entertainment equipment. For cars we supply interior upgrade packages to a later or higher-specification design. Each is specified to your layout and every component is listed in the quotation.",
        ],
        list: [
          "Send photographs of your current interior and describe the result you want.",
          "Tell us the seat layout and any equipment that must stay.",
          "We confirm what can be supplied and what installation involves.",
        ],
      },
    ],
    faq: [
      ["Can you match my interior color?", "Yes. We match by VIN and by photographs of your current interior. For used parts we send photographs of the actual items before you confirm, so you can check the color and condition."],
      ["Do replacement seats come with airbags and electrics?", "Seats are supplied with the functions of the original unit, such as heating, ventilation and memory. Side airbags fitted in the seat are confirmed in the quotation. All electrical connections are checked against your vehicle."],
      ["Do you supply VIP interiors for the V-Class, Vito and Sprinter?", "Yes. We supply complete passenger-cabin conversions built to the layout you specify, including captain chairs, partitions, trim, lighting, tables and entertainment equipment."],
      ["Do steering wheels include the airbag?", "Steering wheels are supplied without the airbag module as standard. If you need an airbag module, ask for it in your request and we will quote it separately where it can be supplied."],
      ["Can I upgrade an older car's interior to a newer design?", "Often, yes. Interior upgrade packages and dashboard kits are available for many models. We check what is possible for your car and list every component and the installation work involved."],
      ["Do you ship interior parts across the US?", "Yes, free to every US state. Seats and dashboards are crated or packed in reinforced cartons and arrive in 1 to 3 business days."],
    ],
    guides: ["mercedes-v-class-vip-interior-conversion-guide", "replacement-car-seats-wiring-airbags-fitment", "car-interior-parts-buying-checklist", "mercedes-w447-dashboard-upgrade-guide"],
    upgradeCategories: ["Interior & Infotainment", "VIP Interiors", "Seats"],
    makeTitle: (make) => `${make} Interior Parts: Seats, Dashboards & Trim`,
    makeDescription: (make, models, count) => `${make} interior parts for ${models}: seats, dashboards, steering wheels, consoles and door panels. ${count} listings, matched to your VIN.`,
    makeIntro: (make, models) => `Seats, dashboards, steering wheels, center consoles, door panels, headliners and trim for the ${make} ${models}. Choose your model and generation below. Interior parts are matched by VIN and by photographs of your current interior.`,
    searchPhrases: ["X5 G05 front seats", "S-Class W223 steering wheel", "V-Class VIP interior", "Range Rover L405 seats", "Cayenne 9YA dashboard"],
  },
};
