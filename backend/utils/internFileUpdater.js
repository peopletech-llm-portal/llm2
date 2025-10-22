import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTERNS_FILE_PATH = path.join(__dirname, '..', 'data', 'interns.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(INTERNS_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read current interns data
export const readInternsData = async () => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(INTERNS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Write interns data to file
export const writeInternsData = async (interns) => {
  try {
    await ensureDataDirectory();
    await fs.writeFile(INTERNS_FILE_PATH, JSON.stringify(interns, null, 2));
    return true;
  } catch (error) {
    throw new Error(`Failed to write interns data: ${error.message}`);
  }
};

// Update interns.json with current intern data from database
export const updateInternsFile = async () => {
  try {
    const { default: User } = await import('../models/User.js');
    const interns = await User.find({ role: 'INTERN' });
    
    const internsData = interns.map(intern => ({
      employeeId: intern.employeeId,
      fullName: intern.name,
      username: intern.username,
      contactNumber: intern.contactNumber,
      password: intern.password, // hashed password
      createdBy: intern.createdBy,
      createdAt: intern.createdAt
    }));

    await writeInternsData(internsData);
    return internsData;
  } catch (error) {
    throw new Error(`Failed to update interns file: ${error.message}`);
  }
};

// Get interns.json file for download
export const getInternsFile = async () => {
  try {
    const data = await fs.readFile(INTERNS_FILE_PATH, 'utf8');
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return '[]';
    }
    throw error;
  }
};
