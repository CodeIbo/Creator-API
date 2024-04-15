import { randomUUID } from "crypto";
import multer, { type FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
    cb(null, `${uniqueSuffix + path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, done: FileFilterCallback) => {
  const typesAllowed = ["image/jpg", "image/jpeg", "image/svg", "image/webp", "image/png"];
  const isAllowed = typesAllowed.includes(file.mimetype);
  if (isAllowed) {
    done(null, true);
  } else {
    console.error("file type not supported");
    console.log(file.mimetype);
    done(null, false);
  }
};
const limits = {
  fileSize: 5 * 1024 * 1024,
};

const multerUpload = multer({ storage, fileFilter, limits });

export default multerUpload;
