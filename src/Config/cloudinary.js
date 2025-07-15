import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: "abduls-cloud",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

class CloudinaryService {
  static uploadToCloudinary(
    fileBuffer,
    folder,
    resource_type,
    filename,
    options = {}
  ) {
    return new Promise((resolve, reject) => {
      const cleanFilename = filename
        .replace(/^.*[\\/]/, "")
        .replace(/\.[^/.]+$/, "");

      // Add timestamp to make it unique
      const public_id = `${folder}/${cleanFilename}_${Date.now()}`;

      const uploadOptions = {
        public_id,
        resource_type,
        use_filename: false,
        unique_filename: false,
        overwrite: false, // Changed to false to avoid conflicts
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  static async uploadPDF(fileBuffer, filename) {
    return await this.uploadToCloudinary(fileBuffer, "pdfs", "raw", filename, {
      format: "pdf",
      // Remove flags: 'attachment' to allow direct browser access
      // Or use it only when generating download URLs
    });
  }

  static getDownloadURL(public_id, filename) {
    console.log(public_id);
    console.log(filename);
    const encodedFilename = encodeURIComponent(
      filename.endsWith(".pdf") ? filename : `${filename}`
    );

    // Generate a signed URL for secure access with download behavior
    return cloudinary.url(public_id, {
      resource_type: "raw",

      flags: `attachment:${encodedFilename}`,
      secure: true,
      sign_url: true, // This creates a signed URL for secure access
      type: "upload",
    });
  }

  // Add a method to get viewable URL (without forcing download)
  static getViewURL(public_id) {
    return cloudinary.url(public_id, {
      resource_type: "raw",

      secure: true,
      type: "upload",
      // No flags here - allows inline viewing
    });
  }

  static async uploadImage(fileBuffer, filename) {
    return await this.uploadToCloudinary(
      fileBuffer,
      "images",
      "image",
      filename
    );
  }
}

export default CloudinaryService;
