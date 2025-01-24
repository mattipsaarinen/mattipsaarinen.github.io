import { createReadStream, createWriteStream } from "fs";
import { parse } from "csv-parse";
import { mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

const defaultFilenames = [
  `/Users/mattisaarinen/Downloads/WPP2024_PopulationBySingleAgeSex_Medium_1950-2023.csv`,
  `/Users/mattisaarinen/Downloads/WPP2024_PopulationBySingleAgeSex_Medium_2024-2100.csv`,
];

export async function importPopulationData(
  inputFilenames: string[] = defaultFilenames,
  outputDir: string = "src/data/snapshots/population"
): Promise<void> {
  // Create output directory if it doesn't exist
  await mkdir(outputDir, { recursive: true });

  // Map to store write streams for each country
  const writeStreams = new Map<string, fs.WriteStream>();
  let recordCount = 0;

  // Process each file sequentially
  for (const inputFilename of inputFilenames) {
    await new Promise((resolve, reject) => {
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

          const dataPoint = [
            parseInt(record.Time),
            parseInt(record.AgeGrp),
            parseFloat(record.PopMale),
            parseFloat(record.PopFemale),
            parseFloat(record.PopTotal),
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
            console.log(`Finished processing file: ${inputFilename}`);
            resolve(null);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  // Close all streams after processing all files
  try {
    for (const stream of writeStreams.values()) {
      stream.write("\n]"); // Close JSON array
      stream.end();
    }

    await Promise.all(
      Array.from(writeStreams.values()).map(
        (stream) => new Promise((resolve) => stream.on("finish", resolve))
      )
    );

    console.log(`Finished processing ${recordCount} total records`);
  } catch (error) {
    throw error;
  }
}

await importPopulationData();
