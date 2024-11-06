const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const appError = require("../errors/appError.js");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../..", "uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        cb(null, uuid.v4() + ext);
    }
});


const uploadProfile = multer({
    storage,
    limits: {
        fileSize: (1 * 1024 /* Converteu para 1Kb */ * 1024) /* Converteu para 1MB */ * 5 /* 5MB */
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            return cb(null, true);
        }

        return cb(appError("Invalid file type. Supported types: image/png, image/jpg", 400));
    }
});


const uploadProfileMiddleware = (req, res, next) => {
    const upload = uploadProfile.single("profilePhoto");

    upload(req, res, (error) => {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            next(appError("File size limit exceeded. Maximum allowed size is 5MB.", 400));
        }

        return next();
    });
};

module.exports = {
    uploadProfileMiddleware
};