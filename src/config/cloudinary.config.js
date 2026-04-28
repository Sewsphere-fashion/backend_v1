import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

// doing this cos i am using es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point dotenv exactly to your .env in the project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// handling image upload
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sewsphere/profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
    gravity: "face",
  },
});

const imageFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(file.originalname.toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadImage = multer({
  storage:imageStorage,
  fileFilter:imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// pdf storage
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:'sewsphere/documents',
    allowed_formats: ['pdf'],
    // needed by cloudinary
    resource_type:'raw'   
  }
})

const pdfFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'), false)
  }
}

export const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB for PDFs
})

