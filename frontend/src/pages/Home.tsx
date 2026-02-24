import React from 'react';
import HeroCounter from '../components/home/HeroCounter';
import CountryCard from '../components/ui/CountryCard';
import { usePopulation } from '../hooks/usePopulation';
import { motion } from 'framer-motion';
import SearchWithAutocomplete from '../components/ui/SearchAutocomplete';
import { CountryCardSkeleton } from '../components/ui/Skeleton';

interface CountryData {
    name: string;
    code: string;
    baselinePopulation: number;
    birthsPerSec: number;
    deathsPerSec: number;
}

// Complete fallback data for ALL countries (verified 2025 projections)
const FALLBACK_COUNTRIES: CountryData[] = [
    // Top 50
    { code: 'IN', name: 'India', baselinePopulation: 1463865525, birthsPerSec: 0.8, deathsPerSec: 0.32 },
    { code: 'CN', name: 'China', baselinePopulation: 1416096094, birthsPerSec: 0.4, deathsPerSec: 0.38 },
    { code: 'US', name: 'United States', baselinePopulation: 347275807, birthsPerSec: 0.12, deathsPerSec: 0.09 },
    { code: 'ID', name: 'Indonesia', baselinePopulation: 285721236, birthsPerSec: 0.15, deathsPerSec: 0.06 },
    { code: 'PK', name: 'Pakistan', baselinePopulation: 255219554, birthsPerSec: 0.18, deathsPerSec: 0.05 },
    { code: 'NG', name: 'Nigeria', baselinePopulation: 237527782, birthsPerSec: 0.22, deathsPerSec: 0.05 },
    { code: 'BR', name: 'Brazil', baselinePopulation: 212812405, birthsPerSec: 0.08, deathsPerSec: 0.05 },
    { code: 'BD', name: 'Bangladesh', baselinePopulation: 175686899, birthsPerSec: 0.12, deathsPerSec: 0.04 },
    { code: 'RU', name: 'Russia', baselinePopulation: 144000000, birthsPerSec: 0.04, deathsPerSec: 0.05 },
    { code: 'ET', name: 'Ethiopia', baselinePopulation: 135000000, birthsPerSec: 0.15, deathsPerSec: 0.04 },
    { code: 'MX', name: 'Mexico', baselinePopulation: 132000000, birthsPerSec: 0.07, deathsPerSec: 0.03 },
    { code: 'JP', name: 'Japan', baselinePopulation: 124000000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'PH', name: 'Philippines', baselinePopulation: 118000000, birthsPerSec: 0.08, deathsPerSec: 0.03 },
    { code: 'EG', name: 'Egypt', baselinePopulation: 115000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'CD', name: 'DR Congo', baselinePopulation: 108000000, birthsPerSec: 0.14, deathsPerSec: 0.04 },
    { code: 'VN', name: 'Vietnam', baselinePopulation: 100000000, birthsPerSec: 0.06, deathsPerSec: 0.03 },
    { code: 'IR', name: 'Iran', baselinePopulation: 92000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'TR', name: 'Turkey', baselinePopulation: 87000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'DE', name: 'Germany', baselinePopulation: 84000000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'TH', name: 'Thailand', baselinePopulation: 72000000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'GB', name: 'United Kingdom', baselinePopulation: 68000000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'TZ', name: 'Tanzania', baselinePopulation: 68000000, birthsPerSec: 0.12, deathsPerSec: 0.03 },
    { code: 'FR', name: 'France', baselinePopulation: 66000000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'ZA', name: 'South Africa', baselinePopulation: 62000000, birthsPerSec: 0.06, deathsPerSec: 0.03 },
    { code: 'IT', name: 'Italy', baselinePopulation: 59000000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'KE', name: 'Kenya', baselinePopulation: 56000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'MM', name: 'Myanmar', baselinePopulation: 55000000, birthsPerSec: 0.05, deathsPerSec: 0.03 },
    { code: 'KR', name: 'South Korea', baselinePopulation: 52000000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'CO', name: 'Colombia', baselinePopulation: 52000000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'UG', name: 'Uganda', baselinePopulation: 50000000, birthsPerSec: 0.12, deathsPerSec: 0.03 },
    { code: 'ES', name: 'Spain', baselinePopulation: 48000000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'SD', name: 'Sudan', baselinePopulation: 48000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'DZ', name: 'Algeria', baselinePopulation: 47000000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'AR', name: 'Argentina', baselinePopulation: 46000000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'IQ', name: 'Iraq', baselinePopulation: 46000000, birthsPerSec: 0.09, deathsPerSec: 0.02 },
    { code: 'AF', name: 'Afghanistan', baselinePopulation: 43000000, birthsPerSec: 0.11, deathsPerSec: 0.04 },
    { code: 'CA', name: 'Canada', baselinePopulation: 40000000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'PL', name: 'Poland', baselinePopulation: 38000000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'MA', name: 'Morocco', baselinePopulation: 38000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'SA', name: 'Saudi Arabia', baselinePopulation: 37000000, birthsPerSec: 0.05, deathsPerSec: 0.01 },
    { code: 'UA', name: 'Ukraine', baselinePopulation: 37000000, birthsPerSec: 0.02, deathsPerSec: 0.05 },
    { code: 'AO', name: 'Angola', baselinePopulation: 37000000, birthsPerSec: 0.12, deathsPerSec: 0.04 },
    { code: 'UZ', name: 'Uzbekistan', baselinePopulation: 35000000, birthsPerSec: 0.07, deathsPerSec: 0.02 },
    { code: 'YE', name: 'Yemen', baselinePopulation: 35000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'PE', name: 'Peru', baselinePopulation: 34000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'MY', name: 'Malaysia', baselinePopulation: 34000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'GH', name: 'Ghana', baselinePopulation: 34000000, birthsPerSec: 0.09, deathsPerSec: 0.03 },
    { code: 'MZ', name: 'Mozambique', baselinePopulation: 34000000, birthsPerSec: 0.11, deathsPerSec: 0.04 },
    { code: 'NP', name: 'Nepal', baselinePopulation: 31000000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'VE', name: 'Venezuela', baselinePopulation: 33000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    // 51-100
    { code: 'MG', name: 'Madagascar', baselinePopulation: 33000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'CM', name: 'Cameroon', baselinePopulation: 30000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'CI', name: "Côte d'Ivoire", baselinePopulation: 30000000, birthsPerSec: 0.10, deathsPerSec: 0.04 },
    { code: 'NE', name: 'Niger', baselinePopulation: 27918000, birthsPerSec: 0.14, deathsPerSec: 0.04 },
    { code: 'AU', name: 'Australia', baselinePopulation: 27000000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'KP', name: 'North Korea', baselinePopulation: 26000000, birthsPerSec: 0.04, deathsPerSec: 0.03 },
    { code: 'ML', name: 'Mali', baselinePopulation: 25199000, birthsPerSec: 0.12, deathsPerSec: 0.04 },
    { code: 'BF', name: 'Burkina Faso', baselinePopulation: 24075000, birthsPerSec: 0.11, deathsPerSec: 0.03 },
    { code: 'TW', name: 'Taiwan', baselinePopulation: 23113000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'LK', name: 'Sri Lanka', baselinePopulation: 23229000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'SY', name: 'Syria', baselinePopulation: 23000000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'MW', name: 'Malawi', baselinePopulation: 21000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'KZ', name: 'Kazakhstan', baselinePopulation: 20000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'ZM', name: 'Zambia', baselinePopulation: 20000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'CL', name: 'Chile', baselinePopulation: 19600000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'RO', name: 'Romania', baselinePopulation: 18909000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'GT', name: 'Guatemala', baselinePopulation: 18000000, birthsPerSec: 0.07, deathsPerSec: 0.02 },
    { code: 'EC', name: 'Ecuador', baselinePopulation: 18000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'SN', name: 'Senegal', baselinePopulation: 18000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'TD', name: 'Chad', baselinePopulation: 18000000, birthsPerSec: 0.12, deathsPerSec: 0.04 },
    { code: 'SO', name: 'Somalia', baselinePopulation: 18000000, birthsPerSec: 0.12, deathsPerSec: 0.04 },
    { code: 'NL', name: 'Netherlands', baselinePopulation: 17900000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'KH', name: 'Cambodia', baselinePopulation: 17000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'ZW', name: 'Zimbabwe', baselinePopulation: 16000000, birthsPerSec: 0.08, deathsPerSec: 0.03 },
    { code: 'GN', name: 'Guinea', baselinePopulation: 14000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'RW', name: 'Rwanda', baselinePopulation: 14000000, birthsPerSec: 0.08, deathsPerSec: 0.02 },
    { code: 'BJ', name: 'Benin', baselinePopulation: 13000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'BI', name: 'Burundi', baselinePopulation: 13000000, birthsPerSec: 0.10, deathsPerSec: 0.03 },
    { code: 'TN', name: 'Tunisia', baselinePopulation: 12000000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'BO', name: 'Bolivia', baselinePopulation: 12000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'HT', name: 'Haiti', baselinePopulation: 12000000, birthsPerSec: 0.07, deathsPerSec: 0.03 },
    { code: 'BE', name: 'Belgium', baselinePopulation: 11700000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'CU', name: 'Cuba', baselinePopulation: 11000000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'SS', name: 'South Sudan', baselinePopulation: 11000000, birthsPerSec: 0.10, deathsPerSec: 0.04 },
    { code: 'DO', name: 'Dominican Republic', baselinePopulation: 11000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'JO', name: 'Jordan', baselinePopulation: 11000000, birthsPerSec: 0.06, deathsPerSec: 0.01 },
    { code: 'CZ', name: 'Czech Republic', baselinePopulation: 10800000, birthsPerSec: 0.03, deathsPerSec: 0.04 },
    { code: 'HN', name: 'Honduras', baselinePopulation: 10600000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'SE', name: 'Sweden', baselinePopulation: 10500000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'AZ', name: 'Azerbaijan', baselinePopulation: 10400000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'GR', name: 'Greece', baselinePopulation: 10300000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'PT', name: 'Portugal', baselinePopulation: 10300000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'AE', name: 'United Arab Emirates', baselinePopulation: 10000000, birthsPerSec: 0.03, deathsPerSec: 0.01 },
    { code: 'TJ', name: 'Tajikistan', baselinePopulation: 10000000, birthsPerSec: 0.07, deathsPerSec: 0.02 },
    { code: 'PG', name: 'Papua New Guinea', baselinePopulation: 10000000, birthsPerSec: 0.07, deathsPerSec: 0.03 },
    { code: 'KM', name: 'Comoros', baselinePopulation: 836000, birthsPerSec: 0.07, deathsPerSec: 0.02 },
    { code: 'ST', name: 'São Tomé and Príncipe', baselinePopulation: 227000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'EH', name: 'Western Sahara', baselinePopulation: 576000, birthsPerSec: 0.04, deathsPerSec: 0.01 },
    { code: 'KY', name: 'Cayman Islands', baselinePopulation: 68000, birthsPerSec: 0.02, deathsPerSec: 0.01 },
    { code: 'BM', name: 'Bermuda', baselinePopulation: 64000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    // 101-150
    { code: 'IL', name: 'Israel', baselinePopulation: 9800000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'HU', name: 'Hungary', baselinePopulation: 9600000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'BY', name: 'Belarus', baselinePopulation: 9200000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'AT', name: 'Austria', baselinePopulation: 9100000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'TG', name: 'Togo', baselinePopulation: 9000000, birthsPerSec: 0.09, deathsPerSec: 0.03 },
    { code: 'SL', name: 'Sierra Leone', baselinePopulation: 8700000, birthsPerSec: 0.10, deathsPerSec: 0.04 },
    { code: 'CH', name: 'Switzerland', baselinePopulation: 8800000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'RS', name: 'Serbia', baselinePopulation: 8500000, birthsPerSec: 0.02, deathsPerSec: 0.05 },
    { code: 'LA', name: 'Laos', baselinePopulation: 7600000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'HK', name: 'Hong Kong', baselinePopulation: 7500000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'LY', name: 'Libya', baselinePopulation: 7000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'NI', name: 'Nicaragua', baselinePopulation: 7000000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'KG', name: 'Kyrgyzstan', baselinePopulation: 7000000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'PY', name: 'Paraguay', baselinePopulation: 6900000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'BG', name: 'Bulgaria', baselinePopulation: 6500000, birthsPerSec: 0.02, deathsPerSec: 0.05 },
    { code: 'TM', name: 'Turkmenistan', baselinePopulation: 6500000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'SV', name: 'El Salvador', baselinePopulation: 6300000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'SG', name: 'Singapore', baselinePopulation: 6000000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'CG', name: 'Congo', baselinePopulation: 6000000, birthsPerSec: 0.09, deathsPerSec: 0.03 },
    { code: 'DK', name: 'Denmark', baselinePopulation: 5900000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'CF', name: 'Central African Republic', baselinePopulation: 5700000, birthsPerSec: 0.10, deathsPerSec: 0.04 },
    { code: 'FI', name: 'Finland', baselinePopulation: 5600000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'NO', name: 'Norway', baselinePopulation: 5500000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'LR', name: 'Liberia', baselinePopulation: 5400000, birthsPerSec: 0.09, deathsPerSec: 0.03 },
    { code: 'SK', name: 'Slovakia', baselinePopulation: 5400000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'LB', name: 'Lebanon', baselinePopulation: 5400000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'PS', name: 'Palestine', baselinePopulation: 5400000, birthsPerSec: 0.08, deathsPerSec: 0.01 },
    { code: 'NZ', name: 'New Zealand', baselinePopulation: 5200000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'IE', name: 'Ireland', baselinePopulation: 5200000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'CR', name: 'Costa Rica', baselinePopulation: 5200000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'MR', name: 'Mauritania', baselinePopulation: 4900000, birthsPerSec: 0.09, deathsPerSec: 0.03 },
    { code: 'OM', name: 'Oman', baselinePopulation: 4600000, birthsPerSec: 0.04, deathsPerSec: 0.01 },
    { code: 'PA', name: 'Panama', baselinePopulation: 4500000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'KW', name: 'Kuwait', baselinePopulation: 4300000, birthsPerSec: 0.04, deathsPerSec: 0.01 },
    { code: 'HR', name: 'Croatia', baselinePopulation: 3800000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'GE', name: 'Georgia', baselinePopulation: 3700000, birthsPerSec: 0.03, deathsPerSec: 0.04 },
    { code: 'ER', name: 'Eritrea', baselinePopulation: 3700000, birthsPerSec: 0.08, deathsPerSec: 0.03 },
    { code: 'MD', name: 'Moldova', baselinePopulation: 3500000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'UY', name: 'Uruguay', baselinePopulation: 3400000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'MN', name: 'Mongolia', baselinePopulation: 3400000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'BA', name: 'Bosnia and Herzegovina', baselinePopulation: 3200000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'AM', name: 'Armenia', baselinePopulation: 2900000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'JM', name: 'Jamaica', baselinePopulation: 2800000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'AL', name: 'Albania', baselinePopulation: 2800000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'LT', name: 'Lithuania', baselinePopulation: 2800000, birthsPerSec: 0.02, deathsPerSec: 0.05 },
    { code: 'QA', name: 'Qatar', baselinePopulation: 2700000, birthsPerSec: 0.02, deathsPerSec: 0.005 },
    { code: 'GM', name: 'Gambia', baselinePopulation: 2700000, birthsPerSec: 0.09, deathsPerSec: 0.03 },
    { code: 'NA', name: 'Namibia', baselinePopulation: 2600000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'BW', name: 'Botswana', baselinePopulation: 2600000, birthsPerSec: 0.05, deathsPerSec: 0.03 },
    { code: 'GA', name: 'Gabon', baselinePopulation: 2400000, birthsPerSec: 0.07, deathsPerSec: 0.03 },
    // 151-200
    { code: 'LS', name: 'Lesotho', baselinePopulation: 2300000, birthsPerSec: 0.06, deathsPerSec: 0.04 },
    { code: 'GW', name: 'Guinea-Bissau', baselinePopulation: 2100000, birthsPerSec: 0.09, deathsPerSec: 0.04 },
    { code: 'SI', name: 'Slovenia', baselinePopulation: 2100000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'MK', name: 'North Macedonia', baselinePopulation: 2000000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'LV', name: 'Latvia', baselinePopulation: 1854000, birthsPerSec: 0.02, deathsPerSec: 0.05 },
    { code: 'XK', name: 'Kosovo', baselinePopulation: 1800000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'GQ', name: 'Equatorial Guinea', baselinePopulation: 1700000, birthsPerSec: 0.08, deathsPerSec: 0.03 },
    { code: 'TT', name: 'Trinidad and Tobago', baselinePopulation: 1500000, birthsPerSec: 0.03, deathsPerSec: 0.03 },
    { code: 'BH', name: 'Bahrain', baselinePopulation: 1500000, birthsPerSec: 0.03, deathsPerSec: 0.01 },
    { code: 'CY', name: 'Cyprus', baselinePopulation: 1371000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'EE', name: 'Estonia', baselinePopulation: 1344000, birthsPerSec: 0.02, deathsPerSec: 0.04 },
    { code: 'TL', name: 'Timor-Leste', baselinePopulation: 1300000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'MU', name: 'Mauritius', baselinePopulation: 1300000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'SZ', name: 'Eswatini', baselinePopulation: 1200000, birthsPerSec: 0.06, deathsPerSec: 0.04 },
    { code: 'DJ', name: 'Djibouti', baselinePopulation: 1100000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'RE', name: 'Réunion', baselinePopulation: 980000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'FJ', name: 'Fiji', baselinePopulation: 930000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'GY', name: 'Guyana', baselinePopulation: 800000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'BT', name: 'Bhutan', baselinePopulation: 780000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'SB', name: 'Solomon Islands', baselinePopulation: 740000, birthsPerSec: 0.06, deathsPerSec: 0.02 },
    { code: 'MO', name: 'Macau', baselinePopulation: 700000, birthsPerSec: 0.02, deathsPerSec: 0.01 },
    { code: 'LU', name: 'Luxembourg', baselinePopulation: 680000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'SR', name: 'Suriname', baselinePopulation: 620000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'ME', name: 'Montenegro', baselinePopulation: 600000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'CV', name: 'Cabo Verde', baselinePopulation: 600000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'MT', name: 'Malta', baselinePopulation: 530000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'MV', name: 'Maldives', baselinePopulation: 520000, birthsPerSec: 0.03, deathsPerSec: 0.01 },
    { code: 'BN', name: 'Brunei', baselinePopulation: 450000, birthsPerSec: 0.03, deathsPerSec: 0.01 },
    { code: 'BS', name: 'Bahamas', baselinePopulation: 410000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'BZ', name: 'Belize', baselinePopulation: 400000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'IS', name: 'Iceland', baselinePopulation: 398000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'VU', name: 'Vanuatu', baselinePopulation: 330000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'BB', name: 'Barbados', baselinePopulation: 290000, birthsPerSec: 0.02, deathsPerSec: 0.03 },
    { code: 'NC', name: 'New Caledonia', baselinePopulation: 290000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'PF', name: 'French Polynesia', baselinePopulation: 280000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'WS', name: 'Samoa', baselinePopulation: 200000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'LC', name: 'Saint Lucia', baselinePopulation: 180000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'GU', name: 'Guam', baselinePopulation: 170000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'CW', name: 'Curaçao', baselinePopulation: 150000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'KI', name: 'Kiribati', baselinePopulation: 130000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'GD', name: 'Grenada', baselinePopulation: 125000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'FM', name: 'Micronesia', baselinePopulation: 115000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'VC', name: 'Saint Vincent', baselinePopulation: 110000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'TO', name: 'Tonga', baselinePopulation: 105000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'SC', name: 'Seychelles', baselinePopulation: 100000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'AG', name: 'Antigua and Barbuda', baselinePopulation: 94000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'AD', name: 'Andorra', baselinePopulation: 80000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'DM', name: 'Dominica', baselinePopulation: 72000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'LI', name: 'Liechtenstein', baselinePopulation: 39000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'MC', name: 'Monaco', baselinePopulation: 36000, birthsPerSec: 0.01, deathsPerSec: 0.02 },
    // Remaining territories and micro-states (201-214)
    { code: 'SM', name: 'San Marino', baselinePopulation: 34000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'MH', name: 'Marshall Islands', baselinePopulation: 42000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'KN', name: 'Saint Kitts and Nevis', baselinePopulation: 47000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'FO', name: 'Faroe Islands', baselinePopulation: 54000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'GL', name: 'Greenland', baselinePopulation: 57000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'NR', name: 'Nauru', baselinePopulation: 12000, birthsPerSec: 0.05, deathsPerSec: 0.02 },
    { code: 'TV', name: 'Tuvalu', baselinePopulation: 11000, birthsPerSec: 0.04, deathsPerSec: 0.02 },
    { code: 'PW', name: 'Palau', baselinePopulation: 18000, birthsPerSec: 0.03, deathsPerSec: 0.02 },
    { code: 'AW', name: 'Aruba', baselinePopulation: 107000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'AI', name: 'Anguilla', baselinePopulation: 15000, birthsPerSec: 0.02, deathsPerSec: 0.01 },
    { code: 'VG', name: 'British Virgin Islands', baselinePopulation: 31000, birthsPerSec: 0.02, deathsPerSec: 0.01 },
    { code: 'TC', name: 'Turks and Caicos', baselinePopulation: 45000, birthsPerSec: 0.03, deathsPerSec: 0.01 },
    { code: 'GI', name: 'Gibraltar', baselinePopulation: 33000, birthsPerSec: 0.02, deathsPerSec: 0.02 },
    { code: 'VA', name: 'Vatican City', baselinePopulation: 800, birthsPerSec: 0.0001, deathsPerSec: 0.0001 },
];

const Home: React.FC = () => {
    const { snapshot, isConnected } = usePopulation(['WORLD']);
    const population = snapshot['WORLD']?.population;

    const [suggestedCountries, setSuggestedCountries] = React.useState<CountryData[]>(FALLBACK_COUNTRIES);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredCountries = React.useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        return suggestedCountries.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.code.toLowerCase().includes(lowerQuery)
        );
    }, [suggestedCountries, searchQuery]);

    React.useEffect(() => {
        fetch('http://localhost:4000/api/regions')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    const countries = data.data.filter((r: any) => r.code !== 'WORLD');
                    setSuggestedCountries(countries);
                }
            })
            .catch(err => console.error("Using fallback data:", err));
    }, []);

    const getYearlyGrowthRate = (c: CountryData) => {
        const netPerSec = c.birthsPerSec - c.deathsPerSec;
        const yearlyNet = netPerSec * 60 * 60 * 24 * 365;
        return (yearlyNet / c.baselinePopulation) * 100;
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center">
            <HeroCounter population={population} isConnected={isConnected} />

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full max-w-7xl px-4 py-12"
            >
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 border-b border-white/5 pb-6">
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-accent uppercase border-l-2 border-accent pl-4 mb-2 md:mb-0">
                        Global Directory ({filteredCountries.length} Regions)
                    </h3>
                    <SearchWithAutocomplete
                        suggestions={FALLBACK_COUNTRIES.map(c => c.name)}
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="SEARCH REGION..."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {!isConnected && filteredCountries.length === 0 ? (
                        // Loading skeletons
                        Array.from({ length: 10 }).map((_, i) => (
                            <CountryCardSkeleton key={i} />
                        ))
                    ) : (
                        filteredCountries.map((c) => (
                            <CountryCard
                                key={c.code}
                                name={c.name}
                                code={c.code}
                                population={c.baselinePopulation}
                                growthRate={getYearlyGrowthRate(c)}
                            />
                        ))
                    )}
                    {filteredCountries.length === 0 && isConnected && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No countries found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
