
import fs from 'fs';
import path from 'path';

const valdiate = async () => {
    const jsonPath = path.join(__dirname, 'countries.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`Total Countries: ${data.length}`);

    // check specific targets
    const india = data.find((c: any) => c.code === 'IN');
    console.log(`India Population: ${india.baselinePopulation.toLocaleString()} (Expected ~1.46B)`);

    const china = data.find((c: any) => c.code === 'CN');
    console.log(`China Population: ${china.baselinePopulation.toLocaleString()} (Expected ~1.41B)`);

    // Check for outliers
    console.log('\n--- Outlier Check ---');
    let outliers = 0;
    data.forEach((c: any) => {
        const netRate = c.birthsPerSec - c.deathsPerSec + c.migrationPerSec;
        const yearlyChange = (netRate * 31536000) / c.baselinePopulation;
        const yearlyChangePercent = yearlyChange * 100;

        if (yearlyChangePercent > 4.0 || yearlyChangePercent < -2.0) {
            console.log(`[ALERT] ${c.name} has unusual growth: ${yearlyChangePercent.toFixed(2)}%`);
            outliers++;
        }
    });

    if (outliers === 0) {
        console.log("✅ No extreme anomalies found. Growth rates are within realistic bounds (-2% to +4%).");
    } else {
        console.log(`⚠️  Found ${outliers} potential outliers.`);
    }

    // Check Sort Order
    const first = data[0];
    const second = data[1];
    if (first.baselinePopulation < second.baselinePopulation) {
        console.log('❌ EXACT SORT ORDER FAIL: Data is not sorted descending!');
    } else {
        console.log('✅ Sort Order looks correct (Descending).');
    }
};

valdiate();
