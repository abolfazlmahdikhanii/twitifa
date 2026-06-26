const ImageKit = require("@imagekit/nodejs");
const fs = require("fs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
];

/**
 * Validate formidable file
 */
const validateFile = (file) => {
  if (!file?.filepath) {
    throw new Error("Invalid file: No file path");
  }

  if (!fs.existsSync(file.filepath)) {
    throw new Error("File not found in temporary location");
  }

  const stats = fs.statSync(file.filepath);
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error("File too large (max 100MB)");
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_TYPES.join(", ")}`);
  }
};

/**
 * Generate clean filename
 */
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const cleanName = originalName
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "");
  return `${timestamp}_${random}_${cleanName}`;
};

/**
 * Upload formidable file to ImageKit
 */
const uploadFile = async (file, folder = "uploads") => {
  try {
    validateFile(file);

    const fileBuffer = fs.readFileSync(file.filepath);
    const isVideo = file.mimetype.startsWith("video/");

    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: generateFileName(file.originalFilename || (isVideo ? "video" : "image")),
      folder: `/${folder}`,
      useUniqueFileName: true,
    });

    try {
      fs.unlinkSync(file.filepath);
    } catch (cleanupError) {
      console.warn("Could not delete temporary file:", cleanupError.message);
    }

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      type: isVideo ? "video" : "image",
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Upload file from buffer (alternative method)
 */
const uploadFileFromBuffer = async (buffer, originalName, folder = "uploads") => {
  try {
    const isVideo = originalName.match(/\.(mp4|webm|mov|avi)$/i);

    const result = await imagekit.upload({
      file: buffer,
      fileName: generateFileName(originalName),
      folder: `/${folder}`,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      type: isVideo ? "video" : "image",
    };
  } catch (error) {
    console.error("ImageKit upload from buffer error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Delete file from ImageKit
 */
const deleteFile = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

module.exports = {
  uploadFile,
  uploadFileFromBuffer,
  deleteFile,
  validateFile,
  generateFileName,
};