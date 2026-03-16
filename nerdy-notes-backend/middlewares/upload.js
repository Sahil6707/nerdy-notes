const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "nerdy-notes",
    resource_type: "raw",
    type: "upload",
    access_mode: "public",
    public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
  })
});
const upload = multer({ storage });

module.exports = upload;