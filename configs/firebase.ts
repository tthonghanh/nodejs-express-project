import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "nodejs-6abcd",
  storageBucket: "nodejs-6abcd.appspot.com"
}

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);