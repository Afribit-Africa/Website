export interface Merchant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  location: string;
  blinkAddress: string;
  btcMapUrl?: string;
  btcMapNodeId?: string;
  latitude?: number;
  longitude?: number;
  slug: string;
  category?: string;
  description?: string;
}

// Parsed from Afribit Merchant Directory CSV
const merchantDirectory = [
  {
    businessName: "3 West Collection",
    ownerName: "Billy",
    email: "bildadouma578@gmail.com",
    phoneNumber: "110924413",
    location: "Soweto",
    blinkAddress: "threewestcollection@blink.sv"
  },
  {
    businessName: "Shine Magicians",
    ownerName: "Gundo",
    email: "gundokevin386@gmail.com",
    phoneNumber: "790274104",
    location: "Soweto 3 West",
    blinkAddress: "livegreatshinemagician@blink.sv"
  },
  {
    businessName: "MUANZO MPYA ORGANISATION",
    ownerName: "Eunice",
    email: "muanzompyaorg@gmail.com",
    phoneNumber: "254792261682",
    location: "ST CHRISTINE'S, KIBERA",
    blinkAddress: "muanzompya@blink.sv"
  },
  {
    businessName: "For People Forever LTD",
    ownerName: "Lipapi",
    email: "dennisochiengotolo@gmail.com",
    phoneNumber: "742857375",
    location: "Raila Village, Nairobi, Kenya",
    blinkAddress: "forpeopleforever01@blink.sv"
  },
  {
    businessName: "Usafi Boys Initiative",
    ownerName: "Abelo",
    email: "N/A",
    phoneNumber: "254711430664",
    location: "Kibera",
    blinkAddress: "usafiboysinitiative@blink.sv"
  },
  {
    businessName: "BIG BROTHER CAR WASH",
    ownerName: "Johnteh",
    email: "johnomomndi541@gmail.com",
    phoneNumber: "254792261682",
    location: "Kibera",
    blinkAddress: "bigbrothercarwash@blink.sv"
  },
  {
    businessName: "Damiano Fast Foods",
    ownerName: "Damiano",
    email: "magakdamiano0@gmail.com",
    phoneNumber: "111835388",
    location: "3 West",
    blinkAddress: "damiano@blink.sv"
  },
  {
    businessName: "Kevin Entertainment Square",
    ownerName: "Kevin",
    email: "N/A",
    phoneNumber: "",
    location: "Kibera",
    blinkAddress: "kevinnakali147@blink.sv"
  },
  {
    businessName: "BLACK AND WHITE (aka Kibra BTC Shop)",
    ownerName: "Steph",
    email: "N/A",
    phoneNumber: "254701930675",
    location: "Raila Village, Kibera",
    blinkAddress: "kibrabtcshop@blink.sv"
  },
  {
    businessName: "3WEST BUTCHERY",
    ownerName: "Newson Onyonyi",
    email: "Newsononyoni5@gmail.com",
    phoneNumber: "720778480",
    location: "Soweto Academy",
    blinkAddress: "threewestbutchery@blink.sv"
  },
  {
    businessName: "Swahili Dishes",
    ownerName: "Ramadhan",
    email: "N/A",
    phoneNumber: "254723513933",
    location: "Kibera",
    blinkAddress: "swahilidishes@blink.sv"
  },
  {
    businessName: "Livegreat Foundation (Yummy Tummy Goodies)",
    ownerName: "Lucy",
    email: "N/A",
    phoneNumber: "254707313583",
    location: "Kibera, Nairobi, Kenya",
    blinkAddress: "livegreat@blink.sv"
  },
  {
    businessName: "Kera Transport",
    ownerName: "Bonface Kera",
    email: "N/A",
    phoneNumber: "743647214",
    location: "Kibera, Nairobi, Kenya",
    blinkAddress: "bonfacekera@blink.sv"
  },
  {
    businessName: "ABEBO VEGEZ",
    ownerName: "Abebo",
    email: "N/A",
    phoneNumber: "254114981320",
    location: "Raila Village, Kibera",
    blinkAddress: "abebovegez@blink.sv"
  },
  {
    businessName: "Krezzy Kicks",
    ownerName: "Fred",
    email: "N/A",
    phoneNumber: "254743710053",
    location: "Kibera",
    blinkAddress: "krezzykicks@blink.sv"
  },
  {
    businessName: "Delivery (BodaBoda)",
    ownerName: "Reuben Chweya",
    email: "chweyareuben26@gmail.com",
    phoneNumber: "254702124757",
    location: "Kibera, Nairobi, Kenya",
    blinkAddress: "chweyareuben@blink.sv"
  },
  {
    businessName: "Kevin DS arena",
    ownerName: "Kevin Bwire",
    email: "N/A",
    phoneNumber: "727625229",
    location: "Soweto Raila",
    blinkAddress: "kevinbwire@blink.sv"
  },
  {
    businessName: "Bodaboda (Nyabuto Kennedy)",
    ownerName: "Nyabuto Kennedy",
    email: "N/A",
    phoneNumber: "740334108",
    location: "Kibera",
    blinkAddress: "nyabutokennedy@blink.sv"
  },
  {
    businessName: "Jewelry Arts",
    ownerName: "Elite Arts",
    email: "N/A",
    phoneNumber: "254724645488",
    location: "Kibera",
    blinkAddress: "jeweryarts@blink.sv"
  },
  {
    businessName: "Nyale Nuts",
    ownerName: "Nyale",
    email: "N/A",
    phoneNumber: "254769624169",
    location: "Kibera",
    blinkAddress: "nyalenuts@blink.sv"
  },
  {
    businessName: "Kunta Natural Products",
    ownerName: "Kunta",
    email: "–",
    phoneNumber: "707313583",
    location: "Kibera",
    blinkAddress: "kunta@blink.sv"
  },
  {
    businessName: "Vincent Boda Boda",
    ownerName: "Vincent",
    email: "–",
    phoneNumber: "794684831",
    location: "Kibera",
    blinkAddress: "vinchez655@blink.sv"
  },
  {
    businessName: "Habil Print & Photo Hub",
    ownerName: "Habil Otieno",
    email: "–",
    phoneNumber: "711430664",
    location: "Kibera",
    blinkAddress: "habilotieno254@blink.sv"
  },
  {
    businessName: "Goreti Greens Shop",
    ownerName: "Goreti",
    email: "–",
    phoneNumber: "112300810",
    location: "Kibera",
    blinkAddress: "goretigreensshop@blink.sv"
  },
  {
    businessName: "Mama Clear Grocery",
    ownerName: "Mama Clear",
    email: "–",
    phoneNumber: "115190012",
    location: "Kibera",
    blinkAddress: "mamacleargroserys@blink.sv"
  },
  {
    businessName: "Kanana Boda Boda",
    ownerName: "Kanana",
    email: "–",
    phoneNumber: "712795448",
    location: "Kibera",
    blinkAddress: "kanana@blink.sv"
  },
  {
    businessName: "Golden Heart Youth Group",
    ownerName: "Francis",
    email: "goldenheart@gmail.com",
    phoneNumber: "792486809",
    location: "Lang'ata, Nairobi",
    blinkAddress: "goldenheartorg@blink.sv"
  },
  {
    businessName: "Venla Very Retail Shop",
    ownerName: "–",
    email: "–",
    phoneNumber: "748271296",
    location: "Kibera",
    blinkAddress: "venlaveryretailshop@blink.sv"
  },
  {
    businessName: "Night Salon",
    ownerName: "Night",
    email: "–",
    phoneNumber: "769734739",
    location: "Kibera",
    blinkAddress: "nightsalon@blink.sv"
  },
  {
    businessName: "Mama Eddy's Salon",
    ownerName: "–",
    email: "–",
    phoneNumber: "728913790",
    location: "Kibera",
    blinkAddress: "mamaeddysalon@blink.sv"
  },
  {
    businessName: "Obado Agure BodaBoda",
    ownerName: "Obado Agure",
    email: "obadiasparta@gmail.com",
    phoneNumber: "799713037",
    location: "Kibera, Langata",
    blinkAddress: "obadoagure@blink.sv"
  },
  {
    businessName: "Mlosho BodaBoda",
    ownerName: "–",
    email: "–",
    phoneNumber: "795731796",
    location: "Kibera",
    blinkAddress: "mlosho@blink.sv"
  },
  {
    businessName: "Mama Noony Mini Shop",
    ownerName: "Caroline Sagwe",
    email: "Sagwecaroline93@gmail.com",
    phoneNumber: "727317087",
    location: "Soweto Academy, Kibera",
    blinkAddress: "noony@blink.sv"
  },
  {
    businessName: "Unique Barber Shop",
    ownerName: "Mariusi",
    email: "–",
    phoneNumber: "714369290",
    location: "Langata, Nairobi",
    blinkAddress: "mariusitangishaka131@blink.sv"
  },
  {
    businessName: "Joseph Public Washroom",
    ownerName: "Joseph Odhiambo",
    email: "–",
    phoneNumber: "254742991962",
    location: "Soweto Academy, Kibera",
    blinkAddress: "josephodhiambo@blink.sv"
  },
  {
    businessName: "Sammy Ouma BodaBoda",
    ownerName: "Sammy Ouma",
    email: "–",
    phoneNumber: "792576718",
    location: "Kibera",
    blinkAddress: "sammyouma@blink.sv"
  },
  {
    businessName: "Caro Public Washroom (Biogas)",
    ownerName: "Caron Aliak",
    email: "–",
    phoneNumber: "795352038",
    location: "Kibera",
    blinkAddress: "caronaliak@blink.sv"
  },
  {
    businessName: "Bridgeway Shop",
    ownerName: "–",
    email: "–",
    phoneNumber: "728507893",
    location: "Kibera",
    blinkAddress: "bridgewayshop@blink.sv"
  },
  {
    businessName: "Kera BodaBoda",
    ownerName: "Bonface Kera",
    email: "–",
    phoneNumber: "743647214",
    location: "Kibera, Nairobi",
    blinkAddress: "keraboda@blink.sv"
  },
  {
    businessName: "OneTouch BodaBoda",
    ownerName: "–",
    email: "–",
    phoneNumber: "–",
    location: "Kibera",
    blinkAddress: "onetouch@blink.sv"
  }
];

// BTCMap links mapping
const btcMapLinks: Record<string, string | { url: string; latitude: number; longitude: number }> = {
  "MUANZO MPYA ORGANISATION": "https://btcmap.org/merchant/node:12300475666",
  "BLACK AND WHITE": "https://btcmap.org/merchant/node:12300467146",
  "JOSEPH PUBLIC WASHROOM": "https://btcmap.org/merchant/node:12300462657",
  "KHEEZONIX FASHIONS AND STYLES": "https://btcmap.org/merchant/node:12300462658",
  "BIOGAS PUBLIC WASHROOMS": "https://btcmap.org/merchant/node:12300462655",
  "ABUKI DISTRIBUTORS": "https://btcmap.org/merchant/node:12300462656",
  "Yummytummygoodies": { url: "https://btcmap.org/merchant/node:12167701319", latitude: -1.3162669, longitude: 36.7758709 },
  "3WEST BUTCHERY": "https://btcmap.org/merchant/node:12300469780",
  "Kibera the Largest slum tour": "https://btcmap.org/merchant/node:12300469783",
  "Evalyncafeterian": "https://btcmap.org/merchant/node:12700628232",
  "ABEBO VEGEZ": "https://btcmap.org/merchant/node:12300439008",
  "MAMA NONNY SHOP": "https://btcmap.org/merchant/node:12300462946",
  "Domiano Fast foods": "https://btcmap.org/merchant/node:12700702059",
  "Wamboya": "https://btcmap.org/merchant/node:12700702058",
  "ACGassuppliers": "https://btcmap.org/merchant/node:12700702057",
  "GalaxyToilets": "https://btcmap.org/merchant/node:12700702056",
  "Mama Clinton Groceries": "https://btcmap.org/merchant/node:12700702055",
  "Fred Collections": "https://btcmap.org/merchant/node:12700702054",
  "Arca Tech Services": "https://btcmap.org/merchant/node:12300515181",
  "Maji safi": "https://btcmap.org/merchant/node:12300469782",
  "WERE TOURS": "https://btcmap.org/merchant/node:12300462913",
  "WILSON ASWETO": "https://btcmap.org/merchant/node:12300443594",
  "ELIJAH DRAXLER": "https://btcmap.org/merchant/node:12300443592",
  "MOSESO RIDES": "https://btcmap.org/merchant/node:12300433274",
  "CHARLIE RIDER": "https://btcmap.org/merchant/node:12300433273",
  "BIG BROTHER CAR WASH": "https://btcmap.org/merchant/node:12300417204",
  "Unique Barber Shop": { url: "https://btcmap.org/merchant/node:12254721499", latitude: -1.3242558, longitude: 36.7798852 },
  "Shiko's Ferments": { url: "https://btcmap.org/merchant/node:12281745878", latitude: -1.3262918, longitude: 36.7745343 },
  "Kosmos Solutions LTD": { url: "https://btcmap.org/merchant/node:12281743822", latitude: -1.3262854, longitude: 36.774496 },
  "Outdoor Kids Kenya": { url: "https://btcmap.org/merchant/node:12281727715", latitude: -1.3262825, longitude: 36.7745143 },
  "Njema Safaris": { url: "https://btcmap.org/merchant/node:12280177485", latitude: -1.3262967, longitude: 36.7744685 },
  "Greencard Mtaani": { url: "https://btcmap.org/merchant/node:12255259652", latitude: -1.317556, longitude: 36.800528 },
  "RonnieFund": { url: "https://btcmap.org/merchant/node:12280168473", latitude: -1.326282, longitude: 36.7744761 },
  "Obadia Nyaenda": { url: "https://btcmap.org/merchant/node:12254733210", latitude: -1.316536, longitude: 36.776282 },
  "Kera Transport": { url: "https://btcmap.org/merchant/node:12254728433", latitude: -1.316536, longitude: 36.776281 },
  "Felix": { url: "https://btcmap.org/merchant/node:12254728431", latitude: -1.316536, longitude: 36.77628 },
  "Mama Design": { url: "https://btcmap.org/merchant/node:12254678587", latitude: -1.3172348, longitude: 36.7770329 },
  "Calisto Enterprise": { url: "https://btcmap.org/merchant/node:12253101509", latitude: -1.3175962, longitude: 36.7781406 },
  "Kevo DS Station": { url: "https://btcmap.org/merchant/node:12254686388", latitude: -1.3168, longitude: 36.778401 },
  "For People Forever LTD": { url: "https://btcmap.org/merchant/node:12254728432", latitude: -1.3175197, longitude: 36.7744085 },
  "Fishpoint Eateries": { url: "https://btcmap.org/merchant/node:12254752062", latitude: -1.308111, longitude: 36.782139 },
  "Spira": { url: "https://btcmap.org/merchant/node:12168076295", latitude: -1.326304, longitude: 36.7744835 },
  "Dess Gaming": "https://btcmap.org/merchant/node:12165688182"
};

// Helper function to create slug from business name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to categorize merchants
function categorizeByBusiness(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('food') || lowerName.includes('dishes') || lowerName.includes('cafeteria') || lowerName.includes('eateries')) {
    return 'restaurant';
  }
  if (lowerName.includes('boda') || lowerName.includes('transport') || lowerName.includes('delivery') || lowerName.includes('rides')) {
    return 'transport';
  }
  if (lowerName.includes('salon') || lowerName.includes('barber')) {
    return 'beauty';
  }
  if (lowerName.includes('shop') || lowerName.includes('collection') || lowerName.includes('butchery') || lowerName.includes('grocery')) {
    return 'shop';
  }
  if (lowerName.includes('washroom') || lowerName.includes('wash')) {
    return 'service';
  }
  if (lowerName.includes('tour') || lowerName.includes('safari')) {
    return 'tourism';
  }
  if (lowerName.includes('print') || lowerName.includes('tech')) {
    return 'tech';
  }
  if (lowerName.includes('foundation') || lowerName.includes('initiative') || lowerName.includes('organisation') || lowerName.includes('youth group')) {
    return 'nonprofit';
  }
  
  return 'other';
}

// Merge data and create full merchant objects
export const MERCHANTS: Merchant[] = merchantDirectory.map((merchant, index) => {
  const slug = createSlug(merchant.businessName);
  const category = categorizeByBusiness(merchant.businessName);
  
  // Try to match with BTCMap links (case-insensitive and flexible matching)
  let btcMapUrl: string | undefined;
  let latitude: number | undefined;
  let longitude: number | undefined;
  
  const btcMapData = btcMapLinks[merchant.businessName];
  if (typeof btcMapData === 'string') {
    btcMapUrl = btcMapData;
  } else if (btcMapData) {
    btcMapUrl = btcMapData.url;
    latitude = btcMapData.latitude;
    longitude = btcMapData.longitude;
  }
  if (!btcMapUrl) {
    // Try variations
    const variations = [
      merchant.businessName.toUpperCase(),
      merchant.businessName.toLowerCase(),
      merchant.businessName
    ];
    
    for (const variation of variations) {
      if (btcMapLinks[variation]) {
        const data = btcMapLinks[variation];
        if (typeof data === 'string') {
          btcMapUrl = data;
        } else {
          btcMapUrl = data.url;
          latitude = data.latitude;
          longitude = data.longitude;
        }
        break;
      }
    }
  }
  
  const btcMapNodeId = btcMapUrl ? btcMapUrl.split(':')[1] : undefined;
  
  return {
    id: `merchant-${index + 1}`,
    businessName: merchant.businessName,
    ownerName: merchant.ownerName,
    email: merchant.email === 'N/A' || merchant.email === '–' ? '' : merchant.email,
    phoneNumber: merchant.phoneNumber === '–' ? '' : merchant.phoneNumber,
    location: merchant.location,
    blinkAddress: merchant.blinkAddress,
    btcMapUrl,
    btcMapNodeId,
    latitude,
    longitude,
    slug,
    category,
    description: `${merchant.businessName} is a Bitcoin-accepting business in ${merchant.location}, operated by ${merchant.ownerName}.`
  };
});

// Helper function to get merchant by slug
export function getMerchantBySlug(slug: string): Merchant | undefined {
  return MERCHANTS.find(m => m.slug === slug);
}

// Helper function to get merchant by Blink address
export function getMerchantByBlinkAddress(blinkAddress: string): Merchant | undefined {
  return MERCHANTS.find(m => m.blinkAddress === blinkAddress);
}

// Helper function to get merchants by category
export function getMerchantsByCategory(category: string): Merchant[] {
  return MERCHANTS.filter(m => m.category === category);
}

// Get all unique categories
export function getCategories(): string[] {
  const categories = new Set(MERCHANTS.map(m => m.category).filter((c): c is string => c !== undefined));
  return Array.from(categories).sort();
}

// Category display names and icons
export const CATEGORY_INFO: Record<string, { name: string; color: string }> = {
  restaurant: { name: 'Food & Dining', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  transport: { name: 'Transport', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  beauty: { name: 'Beauty & Personal Care', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  shop: { name: 'Retail & Shopping', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  service: { name: 'Services', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  tourism: { name: 'Tourism & Tours', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  tech: { name: 'Technology', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  nonprofit: { name: 'Non-Profit & Community', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  other: { name: 'Other', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
};
