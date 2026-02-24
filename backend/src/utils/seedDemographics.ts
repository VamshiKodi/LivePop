import Region from '../models/Region';

// Demographic data for major countries (percentages for youth, working, elderly + density per km²)
const DEMOGRAPHIC_DATA: Record<string, { demographics: { youth: number; working: number; elderly: number }; density: number }> = {
    // World average (approximate)
    WORLD: { demographics: { youth: 25, working: 65, elderly: 10 }, density: 60 },
    
    // Top 20+ Populous Countries
    CN: { demographics: { youth: 17, working: 69, elderly: 14 }, density: 148 }, // China
    IN: { demographics: { youth: 26, working: 67, elderly: 7 }, density: 450 }, // India
    US: { demographics: { youth: 18, working: 65, elderly: 17 }, density: 36 }, // United States
    ID: { demographics: { youth: 24, working: 69, elderly: 7 }, density: 145 }, // Indonesia
    PK: { demographics: { youth: 35, working: 60, elderly: 5 }, density: 287 }, // Pakistan
    NG: { demographics: { youth: 43, working: 54, elderly: 3 }, density: 218 }, // Nigeria
    BR: { demographics: { youth: 21, working: 70, elderly: 9 }, density: 25 }, // Brazil
    BD: { demographics: { youth: 27, working: 67, elderly: 6 }, density: 1265 }, // Bangladesh
    RU: { demographics: { youth: 18, working: 68, elderly: 14 }, density: 9 }, // Russia
    MX: { demographics: { youth: 26, working: 66, elderly: 8 }, density: 66 }, // Mexico
    JP: { demographics: { youth: 12, working: 59, elderly: 29 }, density: 334 }, // Japan
    ET: { demographics: { youth: 40, working: 56, elderly: 4 }, density: 115 }, // Ethiopia
    PH: { demographics: { youth: 30, working: 64, elderly: 6 }, density: 368 }, // Philippines
    EG: { demographics: { youth: 34, working: 62, elderly: 4 }, density: 103 }, // Egypt
    VN: { demographics: { youth: 23, working: 69, elderly: 8 }, density: 314 }, // Vietnam
    CD: { demographics: { youth: 46, working: 51, elderly: 3 }, density: 40 }, // DR Congo
    TR: { demographics: { youth: 24, working: 68, elderly: 8 }, density: 110 }, // Turkey
    IR: { demographics: { youth: 24, working: 70, elderly: 6 }, density: 52 }, // Iran
    DE: { demographics: { youth: 14, working: 64, elderly: 22 }, density: 240 }, // Germany
    TH: { demographics: { youth: 18, working: 71, elderly: 11 }, density: 137 }, // Thailand
    GB: { demographics: { youth: 18, working: 63, elderly: 19 }, density: 281 }, // United Kingdom
    FR: { demographics: { youth: 18, working: 61, elderly: 21 }, density: 119 }, // France
    IT: { demographics: { youth: 13, working: 64, elderly: 23 }, density: 206 }, // Italy
    ZA: { demographics: { youth: 30, working: 63, elderly: 7 }, density: 49 }, // South Africa
    KR: { demographics: { youth: 12, working: 72, elderly: 16 }, density: 515 }, // South Korea
    ES: { demographics: { youth: 15, working: 64, elderly: 21 }, density: 94 }, // Spain
    AR: { demographics: { youth: 24, working: 64, elderly: 12 }, density: 17 }, // Argentina
    CA: { demographics: { youth: 16, working: 66, elderly: 18 }, density: 4 }, // Canada
    AU: { demographics: { youth: 19, working: 64, elderly: 17 }, density: 3 }, // Australia
    
    // Additional major countries
    SA: { demographics: { youth: 24, working: 72, elderly: 4 }, density: 17 }, // Saudi Arabia
    MY: { demographics: { youth: 23, working: 70, elderly: 7 }, density: 99 }, // Malaysia
    PE: { demographics: { youth: 26, working: 66, elderly: 8 }, density: 26 }, // Peru
    UZ: { demographics: { youth: 28, working: 68, elderly: 4 }, density: 79 }, // Uzbekistan
    AO: { demographics: { youth: 47, working: 50, elderly: 3 }, density: 30 }, // Angola
    MZ: { demographics: { youth: 44, working: 53, elderly: 3 }, density: 40 }, // Mozambique
    GH: { demographics: { youth: 38, working: 58, elderly: 4 }, density: 137 }, // Ghana
    YE: { demographics: { youth: 40, working: 57, elderly: 3 }, density: 65 }, // Yemen
    NP: { demographics: { youth: 30, working: 64, elderly: 6 }, density: 203 }, // Nepal
    VE: { demographics: { youth: 27, working: 65, elderly: 8 }, density: 32 }, // Venezuela
    MG: { demographics: { youth: 41, working: 55, elderly: 4 }, density: 48 }, // Madagascar
    CM: { demographics: { youth: 43, working: 54, elderly: 3 }, density: 56 }, // Cameroon
    CI: { demographics: { youth: 42, working: 55, elderly: 3 }, density: 83 }, // Ivory Coast
    ML: { demographics: { youth: 47, working: 51, elderly: 2 }, density: 17 }, // Mali
    BF: { demographics: { youth: 45, working: 52, elderly: 3 }, density: 76 }, // Burkina Faso
    MW: { demographics: { youth: 44, working: 53, elderly: 3 }, density: 199 }, // Malawi
    
    // European countries
    NL: { demographics: { youth: 16, working: 64, elderly: 20 }, density: 508 }, // Netherlands
    BE: { demographics: { youth: 17, working: 64, elderly: 19 }, density: 383 }, // Belgium
    SE: { demographics: { youth: 18, working: 62, elderly: 20 }, density: 25 }, // Sweden
    CZ: { demographics: { youth: 16, working: 64, elderly: 20 }, density: 139 }, // Czech Republic
    GR: { demographics: { youth: 14, working: 64, elderly: 22 }, density: 81 }, // Greece
    PT: { demographics: { youth: 14, working: 64, elderly: 22 }, density: 111 }, // Portugal
    HU: { demographics: { youth: 15, working: 64, elderly: 21 }, density: 107 }, // Hungary
    AT: { demographics: { youth: 15, working: 65, elderly: 20 }, density: 109 }, // Austria
    CH: { demographics: { youth: 15, working: 66, elderly: 19 }, density: 219 }, // Switzerland
    
    // Asian countries
    SG: { demographics: { youth: 15, working: 72, elderly: 13 }, density: 8358 }, // Singapore
    HK: { demographics: { youth: 12, working: 69, elderly: 19 }, density: 6777 }, // Hong Kong
    TW: { demographics: { youth: 13, working: 72, elderly: 15 }, density: 650 }, // Taiwan
    NZ: { demographics: { youth: 19, working: 65, elderly: 16 }, density: 19 }, // New Zealand
    
    // African countries
    KE: { demographics: { youth: 40, working: 56, elderly: 4 }, density: 95 }, // Kenya
    UG: { demographics: { youth: 48, working: 50, elderly: 2 }, density: 229 }, // Uganda
    TZ: { demographics: { youth: 44, working: 53, elderly: 3 }, density: 68 }, // Tanzania
    
    // Middle East
    IQ: { demographics: { youth: 39, working: 58, elderly: 3 }, density: 95 }, // Iraq
    SY: { demographics: { youth: 35, working: 61, elderly: 4 }, density: 117 }, // Syria
    JO: { demographics: { youth: 33, working: 63, elderly: 4 }, density: 115 }, // Jordan
    
    // South America
    CL: { demographics: { youth: 20, working: 69, elderly: 11 }, density: 26 }, // Chile
    EC: { demographics: { youth: 28, working: 64, elderly: 8 }, density: 71 }, // Ecuador
    BO: { demographics: { youth: 31, working: 64, elderly: 5 }, density: 11 }, // Bolivia
    PY: { demographics: { youth: 29, working: 64, elderly: 7 }, density: 18 }, // Paraguay
    
    // North America
    CU: { demographics: { youth: 16, working: 68, elderly: 16 }, density: 106 }, // Cuba
    GT: { demographics: { youth: 33, working: 62, elderly: 5 }, density: 167 }, // Guatemala
    
    // High density micro-states
    MC: { demographics: { youth: 16, working: 64, elderly: 20 }, density: 26358 }, // Monaco
    MO: { demographics: { youth: 14, working: 74, elderly: 12 }, density: 20778 }, // Macau
    BH: { demographics: { youth: 21, working: 76, elderly: 3 }, density: 2239 }, // Bahrain
    MV: { demographics: { youth: 23, working: 71, elderly: 6 }, density: 1802 }, // Maldives
    MT: { demographics: { youth: 15, working: 68, elderly: 17 }, density: 1730 }, // Malta
    
    // Low density countries
    IS: { demographics: { youth: 19, working: 64, elderly: 17 }, density: 3 }, // Iceland
    GL: { demographics: { youth: 22, working: 69, elderly: 9 }, density: 0.03 }, // Greenland
    MN: { demographics: { youth: 28, working: 68, elderly: 4 }, density: 2 }, // Mongolia
    NA: { demographics: { youth: 37, working: 59, elderly: 4 }, density: 3 }, // Namibia
    BW: { demographics: { youth: 32, working: 63, elderly: 5 }, density: 4 }, // Botswana
};

/**
 * Seed demographic data for all regions
 */
export const seedDemographics = async (): Promise<void> => {
    console.log('🌱 Starting demographic data seeding...');
    
    let updated = 0;
    let skipped = 0;
    
    for (const [code, data] of Object.entries(DEMOGRAPHIC_DATA)) {
        try {
            const region = await Region.findOne({ code: code.toUpperCase() });
            
            if (!region) {
                console.log(`⚠️ Region ${code} not found in database, skipping...`);
                skipped++;
                continue;
            }
            
            // Update the region with demographic data
            region.demographics = data.demographics;
            region.density = data.density;
            
            await region.save();
            console.log(`✅ Updated ${code}: ${region.name} - Youth: ${data.demographics.youth}%, Working: ${data.demographics.working}%, Elderly: ${data.demographics.elderly}%, Density: ${data.density}/km²`);
            updated++;
        } catch (error) {
            console.error(`❌ Error updating ${code}:`, error);
            skipped++;
        }
    }
    
    console.log(`\n🎉 Seeding complete! Updated: ${updated}, Skipped: ${skipped}`);
};

export default seedDemographics;
