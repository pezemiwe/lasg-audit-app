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

// src/mock/users.ts
var users_exports = {};
__export(users_exports, {
  AVAILABLE_AUDITORS: () => AVAILABLE_AUDITORS,
  AVAILABLE_LEADS: () => AVAILABLE_LEADS,
  AVAILABLE_SUPERVISORS: () => AVAILABLE_SUPERVISORS,
  MOCK_USERS: () => MOCK_USERS
});
module.exports = __toCommonJS(users_exports);

// src/mock/moreUsers.ts
var ADDITIONAL_SUPERVISORS = [
  {
    id: "user-sup-new-1",
    name: "Mr. Tunde Bakare",
    email: "t.bakare@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Financial"],
    phone: "+234 803 555 0101"
  },
  {
    id: "user-sup-new-2",
    name: "Mrs. Chioma Okonkwo",
    email: "c.okonkwo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-2",
    specialisations: ["Performance", "Combined"],
    phone: "+234 803 555 0102"
  },
  {
    id: "user-sup-new-3",
    name: "Alh. Yusuf Musa",
    email: "y.musa@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-3",
    specialisations: ["Compliance"],
    phone: "+234 803 555 0103"
  },
  {
    id: "user-sup-new-4",
    name: "Dr. Kemi Adeydju",
    email: "k.adeydju@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-4",
    specialisations: ["Combined"],
    phone: "+234 803 555 0104"
  },
  {
    id: "user-sup-new-5",
    name: "Mr. Segun Oladipo",
    email: "s.oladipo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-5",
    specialisations: ["Financial"],
    phone: "+234 803 555 0105"
  },
  {
    id: "user-sup-new-6",
    name: "Mrs. Bola Tinudade",
    email: "b.tinudade@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Performance"],
    phone: "+234 803 555 0106"
  }
];

// src/mock/zones.ts
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

// src/mock/generatedData.ts
var FIRST_NAMES_M = [
  "Adewale",
  "Babatunde",
  "Chinedu",
  "Damola",
  "Emeka",
  "Femi",
  "Gbenga",
  "Hakeem",
  "Ibrahim",
  "Jide",
  "Kunle",
  "Lekan",
  "Muyiwa",
  "Niyi",
  "Olumide",
  "Tunde",
  "Segun",
  "Wale",
  "Yusuf",
  "Tobi"
];
var FIRST_NAMES_F = [
  "Adaeze",
  "Bisola",
  "Chioma",
  "Damilola",
  "Eniola",
  "Folake",
  "Gloria",
  "Halima",
  "Ifeoma",
  "Jumoke",
  "Kemi",
  "Lola",
  "Modupe",
  "Ngozi",
  "Omolara",
  "Patricia",
  "Ronke",
  "Sade",
  "Tope",
  "Yemisi"
];
var LAST_NAMES = [
  "Adebayo",
  "Adeleke",
  "Afolabi",
  "Akinola",
  "Balogun",
  "Bankole",
  "Eze",
  "Fagbemi",
  "Hassan",
  "Ibrahim",
  "Johnson",
  "Lawal",
  "Mohammed",
  "Nwosu",
  "Obi",
  "Ojo",
  "Okafor",
  "Okoye",
  "Olatunji",
  "Olawale",
  "Olayinka",
  "Onyeka",
  "Owolabi",
  "Salami",
  "Suleiman",
  "Tijani",
  "Uche",
  "Williams",
  "Yusuf",
  "Zubair"
];
var TITLES_M = ["Mr.", "Engr.", "Alh.", "Dr.", "Hon.", "Chief"];
var TITLES_F = ["Mrs.", "Miss", "Dr.", "Hon.", "Chief", "Princess"];
var SPECIALISATIONS = [
  ["Financial"],
  ["Compliance"],
  ["Performance"],
  ["Financial", "Compliance"],
  ["Performance", "Compliance"],
  ["Financial", "Performance"],
  ["Combined"]
];
var hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return Math.abs(h);
};
var pick = (arr, seed, salt = 0) => arr[(hash(seed) + salt) % arr.length];
var slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
var buildName = (seed, gender) => {
  const titles = gender === "M" ? TITLES_M : TITLES_F;
  const firsts = gender === "M" ? FIRST_NAMES_M : FIRST_NAMES_F;
  const title = pick(titles, seed, 1);
  const first = pick(firsts, seed, 2);
  const last = pick(LAST_NAMES, seed, 3);
  return { name: `${title} ${first} ${last}`, first, last };
};
var buildEmail = (first, last, councilSlug) => `${first.toLowerCase()}.${last.toLowerCase()}.${councilSlug}@lasg.gov.ng`;
var HLGAS = LGAS.map((council, idx) => {
  const gender = idx % 3 === 0 ? "F" : "M";
  const seed = `hlga-${council.id}`;
  const { name } = buildName(seed, gender);
  const councilSlug = slug(council.name);
  return {
    id: `user-hlga-${council.id}`,
    name: `${name} (HLGA ${council.name})`,
    email: `hlga.${councilSlug}@lasg.gov.ng`,
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    lgaId: council.id,
    phone: `+234 809 ${String(900 + idx).padStart(3, "0")} ${String(
      1e3 + idx
    ).padStart(4, "0")}`
  };
});
var PRIMARY_LGAS = LGAS.filter(
  (l) => !l.councilType || l.councilType === "LGA"
);
var GENERATED_LEADS = PRIMARY_LGAS.map((lga, idx) => {
  const gender = idx % 2 === 0 ? "M" : "F";
  const seed = `lead-${lga.id}`;
  const { name, first, last } = buildName(seed, gender);
  const councilSlug = slug(lga.name);
  return {
    id: `user-glead-${lga.id}`,
    name,
    email: buildEmail(first, last, councilSlug),
    role: "AUDIT_LEAD",
    lgaId: lga.id,
    zoneId: lga.zoneId,
    specialisations: pick(SPECIALISATIONS, seed, 4),
    workload: idx % 3,
    experience: [lga.id],
    phone: `+234 805 ${String(700 + idx).padStart(3, "0")} ${String(
      2e3 + idx
    ).padStart(4, "0")}`
  };
});
var BENCH_LEADS = Array.from({ length: 8 }, (_, idx) => {
  const seed = `bench-lead-${idx}`;
  const gender = idx % 2 === 0 ? "F" : "M";
  const { name, first, last } = buildName(seed, gender);
  return {
    id: `user-glead-bench-${idx + 1}`,
    name,
    email: buildEmail(first, last, `bench${idx + 1}`),
    role: "AUDIT_LEAD",
    specialisations: pick(SPECIALISATIONS, seed, 5),
    workload: 0,
    experience: [],
    phone: `+234 805 880 ${String(1e3 + idx).padStart(4, "0")}`
  };
});
var GENERATED_AUDITORS = PRIMARY_LGAS.flatMap(
  (lga, lgaIdx) => Array.from({ length: 3 }, (_, slot) => {
    const seed = `auditor-${lga.id}-${slot}`;
    const gender = (lgaIdx + slot) % 2 === 0 ? "F" : "M";
    const { name, first, last } = buildName(seed, gender);
    const councilSlug = slug(lga.name);
    return {
      id: `user-gauditor-${lga.id}-${slot + 1}`,
      name: `${name} (${lga.name})`,
      email: buildEmail(first, last, `${councilSlug}-${slot + 1}`),
      role: "TEAM_AUDITOR",
      lgaId: lga.id,
      zoneId: lga.zoneId,
      specialisations: pick(SPECIALISATIONS, seed, 6),
      workload: slot,
      experience: [lga.id],
      phone: `+234 807 ${String(700 + lgaIdx).padStart(3, "0")} ${String(
        slot + 1
      ).padStart(4, "0")}`
    };
  })
);
var LEAD_BY_LGA_ID = /* @__PURE__ */ new Map();
GENERATED_LEADS.forEach((lead) => {
  if (lead.lgaId) LEAD_BY_LGA_ID.set(lead.lgaId, lead.id);
});
LGAS.forEach((council) => {
  if (council.auditLeadId) return;
  const targetLgaId = council.parentLgaId || council.id;
  const leadId = LEAD_BY_LGA_ID.get(targetLgaId);
  if (leadId && council.zoneId !== "zone-4" && council.zoneId !== "zone-1") council.auditLeadId = leadId;
});
var STATUS_CYCLE = [
  "Pre-Audit",
  "Planning",
  "Fieldwork",
  "Review",
  "Reporting",
  "Post-Audit",
  "Completed"
];
var TYPE_CYCLE = [
  "Financial",
  "Compliance",
  "Performance",
  "Combined"
];
var PROGRESS_BY_STATUS = {
  Pending: 0,
  "Pre-Audit": 5,
  Planning: 20,
  Fieldwork: 50,
  Review: 75,
  Reporting: 90,
  "Post-Audit": 95,
  Completed: 100
};
var GENERATED_AUDITS = LGAS.map((council, idx) => {
  const status = STATUS_CYCLE[idx % STATUS_CYCLE.length];
  const type = TYPE_CYCLE[idx % TYPE_CYCLE.length];
  const targetLgaId = council.parentLgaId || council.id;
  const leadId = LEAD_BY_LGA_ID.get(targetLgaId) || "user-glead-lga-1";
  const auditorsForLga = GENERATED_AUDITORS.filter(
    (a) => a.lgaId === targetLgaId
  ).slice(0, 2).map((a) => a.id);
  return {
    id: `gen-audit-${council.id}`,
    lgaId: council.id,
    type,
    year: 2025,
    status,
    mandateId: "mandate-1",
    leadId,
    teamIds: auditorsForLga,
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    progress: PROGRESS_BY_STATUS[status]
  };
});
var GENERATED_USERS = [
  ...HLGAS,
  ...GENERATED_LEADS,
  ...BENCH_LEADS,
  ...GENERATED_AUDITORS
];

// src/mock/users.ts
var MOCK_USERS = [
  ...ADDITIONAL_SUPERVISORS,
  {
    id: "user-sysadmin",
    name: "Engr. Babatunde Fashola",
    email: "sysadmin@lasg.gov.ng",
    role: "SYSTEM_ADMIN",
    phone: "+234 802 000 0001"
  },
  {
    id: "user-ag",
    name: "Hon. Adebayo Oluwaseun",
    email: "ag@lasg.gov.ng",
    role: "STATE_AUDITOR_GENERAL",
    phone: "+234 802 300 0001"
  },
  {
    id: "user-sup-mushin",
    name: "Mrs. Folashade Adekunle",
    email: "sup.mushin@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Financial", "Compliance"],
    phone: "+234 803 400 0001"
  },
  {
    id: "user-sup-lagos",
    name: "Mr. Chukwuemeka Okafor",
    email: "sup.lagos@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-2",
    specialisations: ["Financial", "Performance"],
    phone: "+234 803 400 0002"
  },
  {
    id: "user-sup-ikorodu",
    name: "Alh. Muritala Ajibade",
    email: "sup.ikorodu@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-3",
    specialisations: ["Compliance"],
    phone: "+234 803 400 0003"
  },
  {
    id: "user-sup-badagry",
    name: "Mrs. Oluwabunmi Akintola",
    email: "sup.badagry@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-4",
    specialisations: ["Financial", "Performance"],
    phone: "+234 803 400 0004"
  },
  {
    id: "user-sup-epe",
    name: "Dr. Oluwatobi Fashanu",
    email: "sup.epe@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-5",
    specialisations: ["Performance", "Compliance"],
    phone: "+234 803 400 0005"
  },
  {
    id: "user-sup-6",
    name: "Mrs. Biola Adebayo",
    email: "sup.adebayo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-1",
    specialisations: ["Financial"],
    phone: "+234 803 400 0006"
  },
  {
    id: "user-sup-7",
    name: "Mr. Tunde Bakare",
    email: "sup.bakare@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-2",
    specialisations: ["Compliance", "Financial"],
    phone: "+234 803 400 0007"
  },
  {
    id: "user-sup-8",
    name: "Dr. Chioma Okonkwo",
    email: "sup.okonkwo@lasg.gov.ng",
    role: "AUDIT_SUPERVISOR",
    zoneId: "zone-3",
    specialisations: ["Performance"],
    phone: "+234 803 400 0008"
  },
  {
    id: "user-lead-1",
    name: "Mr. Adewale Ogunjobi",
    email: "lead.ogunjobi@lasg.gov.ng",
    role: "AUDIT_LEAD",
    lgaId: "lga-4",
    specialisations: ["Financial"],
    workload: 1,
    experience: ["lga-4", "lga-1"],
    phone: "+234 805 600 0001"
  },
  {
    id: "user-lead-2",
    name: "Mrs. Adetola Bakare",
    email: "lead.bakare@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Performance", "Compliance"],
    workload: 0,
    experience: ["lga-2", "lga-5"],
    phone: "+234 805 600 0002"
  },
  {
    id: "user-lead-3",
    name: "Mr. Chinedu Onyekachi",
    email: "lead.onyekachi@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Financial", "Compliance"],
    workload: 0,
    experience: ["lga-9", "lga-13"],
    phone: "+234 805 600 0003"
  },
  {
    id: "user-lead-4",
    name: "Mrs. Funmilayo Adeleke",
    email: "lead.adeleke@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Financial", "Performance"],
    workload: 1,
    experience: ["lga-12"],
    phone: "+234 805 600 0004"
  },
  {
    id: "user-lead-5",
    name: "Mr. Babatunde Salami",
    email: "lead.salami@lasg.gov.ng",
    role: "AUDIT_LEAD",
    specialisations: ["Compliance"],
    workload: 0,
    experience: ["lga-17", "lga-18"],
    phone: "+234 805 600 0005"
  },
  {
    id: "user-auditor-1",
    name: "Miss Oluwadamilola Ige (Mushin)",
    email: "auditor.ige@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-4",
    specialisations: ["Financial"],
    workload: 1,
    experience: ["lga-4"],
    phone: "+234 807 800 0001"
  },
  {
    id: "user-auditor-2",
    name: "Mr. Emeka Nwankwo (Agege)",
    email: "auditor.nwankwo@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-1",
    specialisations: ["Financial", "Compliance"],
    workload: 0,
    experience: ["lga-1", "lga-3"],
    phone: "+234 807 800 0002"
  },
  {
    id: "user-auditor-3",
    name: "Mrs. Aisha Mohammed (Ajeromi-Ifelodun)",
    email: "auditor.mohammed@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-9",
    specialisations: ["Performance"],
    workload: 0,
    experience: ["lga-9"],
    phone: "+234 807 800 0003"
  },
  {
    id: "user-auditor-4",
    name: "Mr. Tochukwu Eze (Eti-Osa)",
    email: "auditor.eze@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-12",
    specialisations: ["Financial", "Performance"],
    workload: 1,
    experience: ["lga-12", "lga-13"],
    phone: "+234 807 800 0004"
  },
  {
    id: "user-auditor-5",
    name: "Miss Bukola Adesanya (Alimosho)",
    email: "auditor.adesanya@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-2",
    specialisations: ["Compliance"],
    workload: 0,
    experience: [],
    phone: "+234 807 800 0005"
  },
  {
    id: "user-auditor-6",
    name: "Mr. Olumide Fashola (Kosofe)",
    email: "auditor.fashola@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-5",
    specialisations: ["Financial"],
    workload: 0,
    experience: ["lga-5", "lga-7"],
    phone: "+234 807 800 0006"
  },
  {
    id: "user-auditor-7",
    name: "Mrs. Ngozi Adichie (Lagos Mainland)",
    email: "auditor.adichie@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-14",
    specialisations: ["Performance", "Compliance"],
    workload: 0,
    experience: ["lga-14"],
    phone: "+234 807 800 0007"
  },
  {
    id: "user-auditor-8",
    name: "Mr. Yusuf Abdullahi (Ikorodu)",
    email: "auditor.abdullahi@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-17",
    specialisations: ["Financial", "Compliance"],
    workload: 0,
    experience: ["lga-17"],
    phone: "+234 807 800 0008"
  },
  {
    id: "user-auditor-9",
    name: "Miss Chisom Obi (Surulere)",
    email: "auditor.obi@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-16",
    specialisations: ["Financial", "Performance"],
    workload: 0,
    experience: ["lga-16"],
    phone: "+234 807 800 0009"
  },
  {
    id: "user-auditor-10",
    name: "Mr. Seun Adeyemi (Badagry)",
    email: "auditor.adeyemi@lasg.gov.ng",
    role: "TEAM_AUDITOR",
    lgaId: "lga-18",
    specialisations: ["Compliance"],
    workload: 0,
    experience: ["lga-18"],
    phone: "+234 807 800 0010"
  },
  {
    id: "user-hlga-mushin",
    name: "Mrs. Folake Akinwunmi (HLGA Mushin)",
    email: "hlga.mushin@lasg.gov.ng",
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    lgaId: "lga-1",
    phone: "+234 809 999 0001"
  },
  {
    id: "user-hlga-lagos",
    name: "Hon. Prince Tijani Olusi (HLGA Lagos Island)",
    email: "hlga.lagos@lasg.gov.ng",
    role: "HEAD_OF_LOCAL_GOVERNMENT",
    lgaId: "lga-14",
    phone: "+234 809 999 0014"
  },
  ...GENERATED_USERS.filter(
    // Skip auto-generated HLGAs that collide with the curated ones above
    (u) => !(u.role === "HEAD_OF_LOCAL_GOVERNMENT" && (u.lgaId === "lga-1" || u.lgaId === "lga-14"))
  )
];
var AVAILABLE_SUPERVISORS = MOCK_USERS.filter(
  (u) => u.role === "AUDIT_SUPERVISOR"
);
var AVAILABLE_LEADS = MOCK_USERS.filter(
  (u) => u.role === "AUDIT_LEAD"
);
var AVAILABLE_AUDITORS = MOCK_USERS.filter(
  (u) => u.role === "TEAM_AUDITOR"
);
