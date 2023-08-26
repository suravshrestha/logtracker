const multer = require("multer");

// set storage
var storage = multer.diskStorage({
    destination : function ( req , file , cb ){
        cb(null, "public/uploads");
    },
    filename : function (req, file , cb){
        // image.jpg
        cb(null,  Date.now() + "-" + file.originalname);
    }
});

const store = multer({ storage: storage });

module.exports = store;
