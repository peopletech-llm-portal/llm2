import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INTERNS_FILE_PATH = path.join(__dirname, '..', 'data', 'interns.json');
const EXCEL_OUTPUT_PATH = path.join(__dirname, '..', 'data', 'interns.xlsx');

// Function to flatten nested objects
const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else if (Array.isArray(obj[key])) {
      // Convert arrays to comma-separated strings
      acc[`${pre}${key}`] = obj[key].join(', ');
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    
    return acc;
  }, {});
};

// Main conversion function
const convertInternsToExcel = async () => {
  try {
    console.log('Reading interns.json file...');
    const data = await fs.readFile(INTERNS_FILE_PATH, 'utf8');
    const interns = JSON.parse(data);
    
    if (!interns || !Array.isArray(interns) || interns.length === 0) {
      console.log('No intern data found or invalid format.');
      return;
    }
    
    console.log(`Found ${interns.length} intern records.`);
    
    // Flatten any nested objects in the data
    const flattenedInterns = interns.map(intern => flattenObject(intern));
    
    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(flattenedInterns);
    
    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Interns');
    
    // Write to Excel file
    await xlsx.writeFile(workbook, EXCEL_OUTPUT_PATH);
    
    console.log(`✅ Excel file created successfully at: ${EXCEL_OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error converting interns data to Excel:', error);
  }
};

// Execute the conversion
convertInternsToExcel();