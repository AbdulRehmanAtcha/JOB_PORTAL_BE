import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedPDFType = "application/pdf";

  if (
    allowedImageTypes.includes(file.mimetype) ||
    file.mimetype === allowedPDFType
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, PNG, WebP images, and PDF files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const fileUploadMiddleware = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
]);
