import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
    url: process.env.MONGO_URI || "mongodb://localhost:27017/ott-plateform",
    //options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: "uploads"
        };
    }
});

const upload = multer({ storage });

export default upload;
