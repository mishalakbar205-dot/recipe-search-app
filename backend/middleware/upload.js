import multer from "multer";
import path from 'path';
import crypto from 'crypto';


const storage = multer.diskStorage({
    destination(req,file, cb){
        cb(null, 'uploads/') 
    },
    filename(req, file, cb){
        const ext = path.extname(file.originalname)
        const base = crypto.randomBytes(8).toString('hex')
        cb(null, `${Date.now()}-${base}${ext}`)
    }
})

function fileFilter(req, file, cb){
    // accept only images
    if(file.mimetype && file.mimetype.startsWith('image/')){
        cb(null, true)
    }
    else{
        cb(new Error("Only image files are allowed"))
    }
}
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024} // 5 mb
})

export default upload