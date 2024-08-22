import { Request } from "express";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { readFileSync, unlinkSync } from "fs";
import fs from "fs-extra";
import multer from "multer";
import path from "path";

export const uploadToFolder = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ): void => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10000000000, files: 1 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(null, true);
  },
});

export const upload = multer({ dest: "uploads" });

export const convertFileToBase64String = (
  file: Express.Multer.File,
  isDelete: boolean = true
) => {
  const fileReaded = readFileSync(file.path);
  const encodeFile = fileReaded.toString("base64");

  if (isDelete) unlinkSync(file.path);

  return encodeFile;
};

// upload file to firebase

const firebaseConfig = {
  projectId: "nodejs-6abcd",
  storageBucket: "nodejs-6abcd.appspot.com",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const getUploadedImageUrl = async (
  imagePath: string,
  folderName: string
) => {
  const storageRef = ref(storage, folderName);

  const metadata = {
    contentType: "image/jpeg",
  };

  // Read image file and convert to base64
  const img = fs.readFileSync(imagePath);
  const encodeImage = img.toString("base64");

  const uploadTask = await uploadString(
    storageRef,
    encodeImage,
    "base64",
    metadata
  );

  const imageUrl = await getDownloadURL(uploadTask.ref);

  return imageUrl;
};
