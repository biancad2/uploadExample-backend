/*
 Arquivo para upload local 

*/
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

//Locais de armazenamento 
const storageTypes={
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        //Para não ter conflito com os nomes dos arquivos de imagens
        filename: (req, file, cb) => {
            //Hash de caracteres aleatórios para salvar a imagem + nome original
            crypto.randomBytes(16, (err, hash) =>{
                if(err) cb(err);

                file.key = `${hash.toString("hex")}-${file.originalname}`;
                
                cb(null, file.key);
            });
        }

    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'uploadexample-biancad2',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) =>{
                if(err) cb(err);

                const fileName = `${hash.toString("hex")}-${file.originalname}`;
                
                cb(null, fileName);
            });
        },

    }),
};
module.exports = {
    //pasta aonde serão salvas as imagens do upload
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        // máximo de 2MB por arquivo
        fileSize: 2 * 1024 * 1024,
    },
        
    //tipos de arquivos aceitos no upload
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];
        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error('Invalid file type'));
        }
    },
 };