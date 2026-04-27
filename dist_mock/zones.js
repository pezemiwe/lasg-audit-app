var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mock/zones.ts
var zones_exports = {};
__export(zones_exports, {
  LGAS: () => LGAS,
  ZONES: () => ZONES
});
module.exports = __toCommonJS(zones_exports);
var ZONES = [
  {
    id: "zone-1",
    name: "Ikeja",
    supervisorIds: ["user-sup-mushin", "user-sup-6"],
    lgas: [
      "lga-1",
      "lga-2",
      "lga-3",
      "lga-4",
      "lga-5",
      "lga-6",
      "lga-7",
      "lga-8",
      "lcda-1",
      "lcda-2",
      "lcda-3",
      "lcda-4",
      "lcda-5",
      "lcda-6",
      "lcda-7",
      "lcda-8",
      "lcda-9",
      "lcda-10",
      "lcda-11",
      "lcda-12",
      "lcda-13",
      "lcda-14",
      "lcda-15"
    ]
  },
  {
    id: "zone-4",
    name: "Badagry",
    supervisorIds: ["user-sup-badagry"],
    lgas: [
      "lga-9",
      "lga-10",
      "lga-11",
      "lga-12",
      "lcda-28",
      "lcda-29",
      "lcda-30",
      "lcda-31",
      "lcda-32",
      "lcda-33"
    ]
  },
  {
    id: "zone-3",
    name: "Ikorodu",
    supervisorIds: ["user-sup-ikorodu", "user-sup-8"],
    lgas: ["lga-13", "lcda-23", "lcda-24", "lcda-25", "lcda-26", "lcda-27"]
  },
  {
    id: "zone-2",
    name: "Lagos Island",
    supervisorIds: ["user-sup-lagos", "user-sup-7"],
    lgas: [
      "lga-14",
      "lga-15",
      "lga-16",
      "lga-17",
      "lga-18",
      "lcda-16",
      "lcda-17",
      "lcda-18",
      "lcda-19",
      "lcda-20",
      "lcda-21",
      "lcda-22"
    ]
  },
  {
    id: "zone-5",
    name: "Epe",
    supervisorIds: ["user-sup-epe"],
    lgas: ["lga-19", "lga-20", "lcda-34", "lcda-35", "lcda-36", "lcda-37"]
  }
];
var LGAS = [
  {
    id: "lga-1",
    name: "Ikeja",
    zoneId: "zone-1",
    contactName: "Mr Kayode Fashola",
    contactEmail: "ikeja@lasg.gov.ng",
    contactPhone: "+234 801 234 5001"
  },
  {
    id: "lga-2",
    name: "Alimosho",
    zoneId: "zone-1",
    contactName: "Chief Oluwaseun Adeyemi",
    contactEmail: "alimosho@lasg.gov.ng",
    contactPhone: "+234 801 234 5002"
  },
  {
    id: "lga-3",
    name: "Agege",
    zoneId: "zone-1",
    contactName: "Alhaji Mustapha Bello",
    contactEmail: "agege@lasg.gov.ng",
    contactPhone: "+234 801 234 5003"
  },
  {
    id: "lga-4",
    name: "Mushin",
    zoneId: "zone-1",
    contactName: "Mrs Folake Akinwunmi",
    contactEmail: "mushin@lasg.gov.ng",
    contactPhone: "+234 801 234 5004"
  },
  {
    id: "lga-5",
    name: "Oshodi-Isolo",
    zoneId: "zone-1",
    contactName: "Alh. Ibrahim Suleiman",
    contactEmail: "oshodi@lasg.gov.ng",
    contactPhone: "+234 801 234 5005"
  },
  {
    id: "lga-6",
    name: "Kosofe",
    zoneId: "zone-1",
    contactName: "Engr. Babajide Olatunde",
    contactEmail: "kosofe@lasg.gov.ng",
    contactPhone: "+234 801 234 5006"
  },
  {
    id: "lga-7",
    name: "Somolu",
    zoneId: "zone-1",
    contactName: "Hon. Gbolahan Bagostowe",
    contactEmail: "somolu@lasg.gov.ng",
    contactPhone: "+234 801 234 5007"
  },
  {
    id: "lga-8",
    name: "Ifako-Ijaiye",
    zoneId: "zone-1",
    contactName: "Mrs Aduke Ogundimu",
    contactEmail: "ifako@lasg.gov.ng",
    contactPhone: "+234 801 234 5008"
  },
  {
    id: "lga-9",
    name: "Badagry",
    zoneId: "zone-4",
    contactName: "Prince Akran Menu-Toyon",
    contactEmail: "badagry@lasg.gov.ng",
    contactPhone: "+234 801 234 5009"
  },
  {
    id: "lga-10",
    name: "Ojo",
    zoneId: "zone-4",
    contactName: "Chief Rasulu Idowu",
    contactEmail: "ojo@lasg.gov.ng",
    contactPhone: "+234 801 234 5010"
  },
  {
    id: "lga-11",
    name: "Amuwo-Odofin",
    zoneId: "zone-4",
    contactName: "Engr. Valentine Buraimoh",
    contactEmail: "amuwo@lasg.gov.ng",
    contactPhone: "+234 801 234 5011"
  },
  {
    id: "lga-12",
    name: "Ajeromi-Ifelodun",
    zoneId: "zone-4",
    contactName: "Hon. Fatai Ayoola",
    contactEmail: "ajeromi@lasg.gov.ng",
    contactPhone: "+234 801 234 5012"
  },
  {
    id: "lga-13",
    name: "Ikorodu",
    zoneId: "zone-3",
    contactName: "Hon. Wasiu Adeshina",
    contactEmail: "ikorodu@lasg.gov.ng",
    contactPhone: "+234 801 234 5013"
  },
  {
    id: "lga-14",
    name: "Lagos Island",
    zoneId: "zone-2",
    contactName: "Prince Tijani Olusi",
    contactEmail: "lagosisland@lasg.gov.ng",
    contactPhone: "+234 801 234 5014"
  },
  {
    id: "lga-15",
    name: "Lagos Mainland",
    zoneId: "zone-2",
    contactName: "Mrs Omolola Essien",
    contactEmail: "mainland@lasg.gov.ng",
    contactPhone: "+234 801 234 5015"
  },
  {
    id: "lga-16",
    name: "Apapa",
    zoneId: "zone-2",
    contactName: "Hon. Idowu Sebanjo",
    contactEmail: "apapa@lasg.gov.ng",
    contactPhone: "+234 801 234 5016"
  },
  {
    id: "lga-17",
    name: "Eti-Osa",
    zoneId: "zone-2",
    contactName: "Hon. Saheed Bankole",
    contactEmail: "etiosa@lasg.gov.ng",
    contactPhone: "+234 801 234 5017"
  },
  {
    id: "lga-18",
    name: "Surulere",
    zoneId: "zone-2",
    contactName: "Hon. Sulaimon Yusuf",
    contactEmail: "surulere@lasg.gov.ng",
    contactPhone: "+234 801 234 5018"
  },
  {
    id: "lga-19",
    name: "Epe",
    zoneId: "zone-5",
    contactName: "Princess Surah Animashaun",
    contactEmail: "epe@lasg.gov.ng",
    contactPhone: "+234 801 234 5019"
  },
  {
    id: "lga-20",
    name: "Ibeju-Lekki",
    zoneId: "zone-5",
    contactName: "Hon. Abdullah Sesan",
    contactEmail: "ibejulekki@lasg.gov.ng",
    contactPhone: "+234 801 234 5020"
  },
  // Zone 1 — Ikeja (15 LCDAs)
  {
    id: "lcda-1",
    name: "Orile-Agege",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-3",
    contactName: "Hon. Taiwo Adebisi",
    contactEmail: "orileagege@lasg.gov.ng",
    contactPhone: "+234 801 234 6001"
  },
  {
    id: "lcda-2",
    name: "Agbado/Oke-Odo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Alh. Saheed Oguntayo",
    contactEmail: "agbado@lasg.gov.ng",
    contactPhone: "+234 801 234 6002"
  },
  {
    id: "lcda-3",
    name: "Ayobo-Ipaja",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Hon. Lateef Adeniyi",
    contactEmail: "ayobo@lasg.gov.ng",
    contactPhone: "+234 801 234 6003"
  },
  {
    id: "lcda-4",
    name: "Egbe-Idimu",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Mrs. Bose Aregbesola",
    contactEmail: "egbeidimu@lasg.gov.ng",
    contactPhone: "+234 801 234 6004"
  },
  {
    id: "lcda-5",
    name: "Igando-Ikotun",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Hon. Akeem Adesanya",
    contactEmail: "igando@lasg.gov.ng",
    contactPhone: "+234 801 234 6005"
  },
  {
    id: "lcda-6",
    name: "Mosan-Okunola",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-2",
    contactName: "Chief Olusola Bankole",
    contactEmail: "mosan@lasg.gov.ng",
    contactPhone: "+234 801 234 6006"
  },
  {
    id: "lcda-7",
    name: "Ojokoro",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-8",
    contactName: "Hon. Hammed Idowu",
    contactEmail: "ojokoro@lasg.gov.ng",
    contactPhone: "+234 801 234 6007"
  },
  {
    id: "lcda-8",
    name: "Ojodu",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-1",
    contactName: "Dr. Folarin Ogunsanwo",
    contactEmail: "ojodu@lasg.gov.ng",
    contactPhone: "+234 801 234 6008"
  },
  {
    id: "lcda-9",
    name: "Onigbongbo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-1",
    contactName: "Mrs. Yetunde Arobieke",
    contactEmail: "onigbongbo@lasg.gov.ng",
    contactPhone: "+234 801 234 6009"
  },
  {
    id: "lcda-10",
    name: "Agboyi-Ketu",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-6",
    contactName: "Hon. Dele Oshinowo",
    contactEmail: "agboyiketu@lasg.gov.ng",
    contactPhone: "+234 801 234 6010"
  },
  {
    id: "lcda-11",
    name: "Ikosi-Isheri",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-6",
    contactName: "Alh. Abdulrazaq Balogun",
    contactEmail: "ikosiisheri@lasg.gov.ng",
    contactPhone: "+234 801 234 6011"
  },
  {
    id: "lcda-12",
    name: "Odi-Olowo/Ojuwoye",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-4",
    contactName: "Hon. Rasak Ajala",
    contactEmail: "odiolowo@lasg.gov.ng",
    contactPhone: "+234 801 234 6012"
  },
  {
    id: "lcda-13",
    name: "Ejigbo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-5",
    contactName: "Mrs. Monsurat Olowu",
    contactEmail: "ejigbo@lasg.gov.ng",
    contactPhone: "+234 801 234 6013"
  },
  {
    id: "lcda-14",
    name: "Isolo",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-5",
    contactName: "Hon. Shamsudeen Olaleye",
    contactEmail: "isolo@lasg.gov.ng",
    contactPhone: "+234 801 234 6014"
  },
  {
    id: "lcda-15",
    name: "Bariga",
    zoneId: "zone-1",
    councilType: "LCDA",
    parentLgaId: "lga-7",
    contactName: "Hon. Kolade Alabi",
    contactEmail: "bariga@lasg.gov.ng",
    contactPhone: "+234 801 234 6015"
  },
  // Zone 2 — Lagos Island (7 LCDAs)
  {
    id: "lcda-16",
    name: "Apapa-Iganmu",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-16",
    contactName: "Engr. Olumuyiwa Gbadegesin",
    contactEmail: "apapaiganmu@lasg.gov.ng",
    contactPhone: "+234 801 234 6016"
  },
  {
    id: "lcda-17",
    name: "Iru/Victoria Island",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-17",
    contactName: "Hon. Mobolaji Johnson",
    contactEmail: "iruvictoria@lasg.gov.ng",
    contactPhone: "+234 801 234 6017"
  },
  {
    id: "lcda-18",
    name: "Ikoyi-Obalende",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-17",
    contactName: "Chief Funsho Martins",
    contactEmail: "ikoyiobalende@lasg.gov.ng",
    contactPhone: "+234 801 234 6018"
  },
  {
    id: "lcda-19",
    name: "Lagos Island East",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-14",
    contactName: "Alh. Kamal Bashua",
    contactEmail: "lagosislandeast@lasg.gov.ng",
    contactPhone: "+234 801 234 6019"
  },
  {
    id: "lcda-20",
    name: "Yaba",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-15",
    contactName: "Dr. Jide Soyombo",
    contactEmail: "yaba@lasg.gov.ng",
    contactPhone: "+234 801 234 6020"
  },
  {
    id: "lcda-21",
    name: "Coker-Aguda",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-18",
    contactName: "Hon. Abdulahi Raji",
    contactEmail: "cokeraguda@lasg.gov.ng",
    contactPhone: "+234 801 234 6021"
  },
  {
    id: "lcda-22",
    name: "Itire-Ikate",
    zoneId: "zone-2",
    councilType: "LCDA",
    parentLgaId: "lga-18",
    contactName: "Mrs. Kudirat Ahmed",
    contactEmail: "itireikate@lasg.gov.ng",
    contactPhone: "+234 801 234 6022"
  },
  // Zone 3 — Ikorodu (5 LCDAs)
  {
    id: "lcda-23",
    name: "Igbogbo-Bayeku",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Hon. Olusesan Daini",
    contactEmail: "igbogbo@lasg.gov.ng",
    contactPhone: "+234 801 234 6023"
  },
  {
    id: "lcda-24",
    name: "Ijede",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Alh. Mufutau Bello",
    contactEmail: "ijede@lasg.gov.ng",
    contactPhone: "+234 801 234 6024"
  },
  {
    id: "lcda-25",
    name: "Imota",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Hon. Idris Aregbe",
    contactEmail: "imota@lasg.gov.ng",
    contactPhone: "+234 801 234 6025"
  },
  {
    id: "lcda-26",
    name: "Ikorodu North",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Chief Adeola Banjo",
    contactEmail: "ikorodunorth@lasg.gov.ng",
    contactPhone: "+234 801 234 6026"
  },
  {
    id: "lcda-27",
    name: "Ikorodu West",
    zoneId: "zone-3",
    councilType: "LCDA",
    parentLgaId: "lga-13",
    contactName: "Mrs. Mojirade Kadiri",
    contactEmail: "ikoroduwest@lasg.gov.ng",
    contactPhone: "+234 801 234 6027"
  },
  // Zone 4 — Badagry (6 LCDAs)
  {
    id: "lcda-28",
    name: "Ifelodun",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-12",
    contactName: "Hon. Shehu Danjuma",
    contactEmail: "ifelodun@lasg.gov.ng",
    contactPhone: "+234 801 234 6028"
  },
  {
    id: "lcda-29",
    name: "Oriade",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-11",
    contactName: "Chief Sunday Adeola",
    contactEmail: "oriade@lasg.gov.ng",
    contactPhone: "+234 801 234 6029"
  },
  {
    id: "lcda-30",
    name: "Badagry West",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-9",
    contactName: "Hon. Joseph Akintunde",
    contactEmail: "badagrywest@lasg.gov.ng",
    contactPhone: "+234 801 234 6030"
  },
  {
    id: "lcda-31",
    name: "Olorunda",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-9",
    contactName: "Mrs. Kehinde Bamgbose",
    contactEmail: "olorunda@lasg.gov.ng",
    contactPhone: "+234 801 234 6031"
  },
  {
    id: "lcda-32",
    name: "Iba",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-10",
    contactName: "Engr. Wahab Olatunji",
    contactEmail: "iba@lasg.gov.ng",
    contactPhone: "+234 801 234 6032"
  },
  {
    id: "lcda-33",
    name: "Oto-Awori",
    zoneId: "zone-4",
    councilType: "LCDA",
    parentLgaId: "lga-10",
    contactName: "Alh. Ismail Akinpelu",
    contactEmail: "otoawori@lasg.gov.ng",
    contactPhone: "+234 801 234 6033"
  },
  // Zone 5 — Epe (4 LCDAs)
  {
    id: "lcda-34",
    name: "Eredo",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-19",
    contactName: "Hon. Adebayo Afuye",
    contactEmail: "eredo@lasg.gov.ng",
    contactPhone: "+234 801 234 6034"
  },
  {
    id: "lcda-35",
    name: "Ikosi-Ejinrin",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-19",
    contactName: "Chief Adekunle Ayoka",
    contactEmail: "ikosiejinrin@lasg.gov.ng",
    contactPhone: "+234 801 234 6035"
  },
  {
    id: "lcda-36",
    name: "Lekki",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-20",
    contactName: "Mrs. Ronke Shobowale",
    contactEmail: "lekki@lasg.gov.ng",
    contactPhone: "+234 801 234 6036"
  },
  {
    id: "lcda-37",
    name: "Ibeju",
    zoneId: "zone-5",
    councilType: "LCDA",
    parentLgaId: "lga-20",
    contactName: "Hon. Tajudeen Olorunlogbon",
    contactEmail: "ibeju@lasg.gov.ng",
    contactPhone: "+234 801 234 6037"
  }
];
