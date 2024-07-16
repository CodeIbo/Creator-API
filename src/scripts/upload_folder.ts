import fs from "fs";
import path from "path";

const uploadFolder = path.join(__dirname, "..", "..", "dist", "uploads");

function createUploadFolder() {
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
    console.log("Upload folder created:", uploadFolder);
  } else {
    console.log("Upload folder already exists:", uploadFolder);
  }
}

createUploadFolder();
