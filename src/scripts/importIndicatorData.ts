import { createReadStream, createWriteStream } from "fs";
import { parse } from "csv-parse";
import { mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

const filename = `/Users/mattisaarinen/Downloads/WPP2024_Demographic_Indicators_Medium.csv`;

export async function importPopulationData(
  inputFilename: string = filename,
  outputDir: string = "src/data/snapshots/indicators"
): Promise<void> {
  // Create output directory if it doesn't exist
  await mkdir(outputDir, { recursive: true });

  // Map to store write streams for each country
  const writeStreams = new Map<string, fs.WriteStream>();
  let recordCount = 0;

  return new Promise((resolve, reject) => {
    createReadStream(inputFilename)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
        })
      )
      .on("data", (record: any) => {
        recordCount++;
        if (recordCount % 1000000 === 0) {
          console.log(`Processed ${recordCount} records...`);
        }

        const iso3Code = record.ISO3_code.trim();
        if (!iso3Code) return;

        // Get or create write stream for this country
        if (!writeStreams.has(iso3Code)) {
          const outputPath = path.join(outputDir, `${iso3Code}.json`);
          const stream = createWriteStream(outputPath);
          // Write opening bracket for JSON array
          stream.write("[\n");
          writeStreams.set(iso3Code, stream);
          stream.firstWrite = true;
        }

        //
        const dataPoint = [
          record.ISO3_code, // Country ISO3 code
          record.SDMX_code, // SDMX code
          parseInt(record.LocTypeID), // Location type ID
          record.LocTypeName, // Location type name
          record.ParentID, // Parent location ID
          record.Location, // Location name
          parseInt(record.VarID), // Variant ID
          record.Variant, // Variant name
          parseInt(record.Time), // Year
          parseFloat(record.TPopulation1Jan), // Total Population, as of 1 January (thousands)
          parseFloat(record.TPopulation1July), // Total Population, as of 1 July (thousands)
          parseFloat(record.TPopulationMale1July), // Male Population, as of 1 July (thousands)
          parseFloat(record.TPopulationFemale1July), // Female Population, as of 1 July (thousands)
          parseFloat(record.PopDensity), // Population Density, as of 1 July (persons per square km)
          parseFloat(record.PopSexRatio), // Population Sex Ratio, as of 1 July (males per 100 females)
          parseFloat(record.MedianAgePop), // Median Age, as of 1 July (years)
          parseFloat(record.NatChange), // Natural Change, Births minus Deaths (thousands)
          parseFloat(record.NatChangeRT), // Rate of Natural Change (per 1,000 population)
          parseFloat(record.PopChange), // Population Change (thousands)
          parseFloat(record.PopGrowthRate), // Population Growth Rate (percentage)
          parseFloat(record.DoublingTime), // Population Annual Doubling Time (years)
          parseInt(record.Births), // Births (thousands)
          parseInt(record.Births1519), // Births by women aged 15 to 19 (thousands)
          parseFloat(record.CBR), // Crude Birth Rate (births per 1,000 population)
          parseFloat(record.TFR), // Total Fertility Rate (live births per woman)
          parseFloat(record.NRR), // Net Reproduction Rate (surviving daughters per woman)
          parseFloat(record.MAC), // Mean Age Childbearing (years)
          parseFloat(record.SRB), // Sex Ratio at Birth (males per 100 female births)
          parseInt(record.Deaths), // Total Deaths (thousands)
          parseInt(record.DeathsMale), // Male Deaths (thousands)
          parseInt(record.DeathsFemale), // Female Deaths (thousands)
          parseFloat(record.CDR), // Crude Death Rate (deaths per 1,000 population)
          parseFloat(record.LEx), // Life Expectancy at Birth, both sexes (years)
          parseFloat(record.LExMale), // Male Life Expectancy at Birth (years)
          parseFloat(record.LExFemale), // Female Life Expectancy at Birth (years)
          parseFloat(record.LE15), // Life Expectancy at Age 15, both sexes (years)
          parseFloat(record.LE15Male), // Male Life Expectancy at Age 15 (years)
          parseFloat(record.LE15Female), // Female Life Expectancy at Age 15 (years)
          parseFloat(record.LE65), // Life Expectancy at Age 65, both sexes (years)
          parseFloat(record.LE65Male), // Male Life Expectancy at Age 65 (years)
          parseFloat(record.LE65Female), // Female Life Expectancy at Age 65 (years)
          parseFloat(record.LE80), // Life Expectancy at Age 80, both sexes (years)
          parseFloat(record.LE80Male), // Male Life Expectancy at Age 80 (years)
          parseFloat(record.LE80Female), // Female Life Expectancy at Age 80 (years)
          parseInt(record.InfantDeaths), // Infant Deaths, under age 1 (thousands)
          parseFloat(record.IMR), // Infant Mortality Rate (infant deaths per 1,000 live births)
          parseFloat(record.LBsurvivingAge1), // Live births Surviving to Age 1 (thousands)
          parseInt(record.Under5Deaths), // Deaths under age 5 (thousands)
          parseFloat(record.Q5), // Under-five Mortality Rate (deaths under age 5 per 1,000 live births)
          parseFloat(record.Q0040), // Mortality before Age 40, both sexes (deaths under age 40 per 1,000 live births)
          parseFloat(record.Q0040Male), // Male mortality before Age 40 (deaths under age 40 per 1,000 male live births)
          parseFloat(record.Q0040Female), // Female mortality before Age 40 (deaths under age 40 per 1,000 female live births)
          parseFloat(record.Q0060), // Mortality before Age 60, both sexes (deaths under age 60 per 1,000 live births)
          parseFloat(record.Q0060Male), // Male mortality before Age 60 (deaths under age 60 per 1,000 male live births)
          parseFloat(record.Q0060Female), // Female mortality before Age 60 (deaths under age 60 per 1,000 female live births)
          parseFloat(record.Q1550), // Mortality between Age 15 and 50, both sexes (deaths under age 50 per 1,000 alive at age 15)
          parseFloat(record.Q1550Male), // Male mortality between Age 15 and 50 (deaths under age 50 per 1,000 males alive at age 15)
          parseFloat(record.Q1550Female), // Female mortality between Age 15 and 50 (deaths under age 50 per 1,000 females alive at age 15)
          parseFloat(record.Q1560), // Mortality between Age 15 and 60, both sexes (deaths under age 60 per 1,000 alive at age 15)
          parseFloat(record.Q1560Male), // Male mortality between Age 15 and 60 (deaths under age 60 per 1,000 males alive at age 15)
          parseFloat(record.Q1560Female), // Female mortality between Age 15 and 60 (deaths under age 60 per 1,000 females alive at age 15)
          parseInt(record.NetMigrations), // Net Number of Migrants (thousands)
          parseFloat(record.CNMR), // Net Migration Rate (per 1,000 population)
        ];

        const stream = writeStreams.get(iso3Code)!;
        // Add comma if not first item
        // Track if this is the first write for this stream
        if (!stream.firstWrite) {
          stream.write(",\n");
        } else {
          stream.firstWrite = false;
        }

        stream.write(`${JSON.stringify(dataPoint)}`);
      })
      .on("end", async () => {
        try {
          // Close all streams properly
          for (const stream of writeStreams.values()) {
            stream.write("\n]"); // Close JSON array
            stream.end();
          }

          // Wait for all streams to finish
          await Promise.all(
            Array.from(writeStreams.values()).map(
              (stream) => new Promise((resolve) => stream.on("finish", resolve))
            )
          );

          console.log(`Finished processing ${recordCount} total records`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

await importPopulationData();
