import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';

export const sendImageCloudinary = async(imageName:string, path:string):Promise<Record<string, unknown>> => {
      // Configuration
  cloudinary.config({ 
    cloud_name: config.clouddinary_cloud_name, 
    api_key: config.cloudinary_cloud_api_key, 
    api_secret: config.cloudinary_api_secret // Click 'View API Keys' above to copy your API secret
});

try{
  const uploadResult = await cloudinary.uploader
.upload(
    path, {
        public_id:imageName,
    }
)

return uploadResult;

}catch(error:any){
    console.log('Cloudinary upload failed',error);
    throw error;
};
//console.log(uploadResult);
}

//from multer npm js, create storage
const storage = multer.diskStorage({    
    destination: function (req, file, cb) {
      cb(null, process.cwd()+'/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const upload = multer({ storage: storage })