const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');
const mime = require('mime');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up auth
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    //input your own service user with keyFilename:
    //you must have your json file in the home directory
    keyFilename: './keyfile.json',
    //intput your own projectId:
    projectId: 'proven-fx-199323'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Google Cloud API Test', body: "" });
});

router.post('/', upload.single('image'), async(req, res, next) => {
    // Choose what the Vision API should detect

    // Send the image to the Cloud Vision API
    let fileName = `uploads/${req.file.filename}`;
    console.log(`image is located at ${fileName}`);
    // client
    //     .faceDetection(fileName)
    //     .then(results => {
    //         const faces = results[0].faceAnnotations;
    //
    //         result += ('Faces:');
    //         faces.forEach((face, i) => {
    //             console.log(`  Face #${i + 1}:`);
    //             console.log(`    Joy: ${face.joyLikelihood}`);
    //             console.log(`    Anger: ${face.angerLikelihood}`);
    //             console.log(`    Sorrow: ${face.sorrowLikelihood}`);
    //             console.log(`    Surprise: ${face.surpriseLikelihood}`);
    //         });
    //     })
    //     .catch(err => {
    //         console.log(`ERROR: ${err}`);
    //     });
    let result = "";
        switch (req.body.thing) {
            case 'face':
                console.log("face");
                detectFaces(fileName, res);
                console.log(result);
                break;
            case 'labels':
                console.log("labels");
                detectLabels(fileName, res);
                console.log(result);
                break;
            case 'landmarks':
                console.log("landmarks");
                detectLandmarks(fileName, res);
                console.log(result);
                break;
            case 'text':
                console.log("text");
                detectText(fileName, res);
                console.log(result);
                break;
            case 'logos':
                console.log("logos");
                detectLogos(fileName, res);
                console.log(result);
                break;
            case 'properties':
                console.log("properties");
                detectProperties(fileName, res);
                console.log(result);
                break;
            case 'safesearch':
                console.log("safesearch");
                detectSafeSearch(fileName, res);
                console.log(result);
                break;
            case 'crophints':
                console.log("crophints");
                detectCropHints(fileName, res);
                console.log(result);
                break;
            case 'web':
                console.log("web");
                detectWeb(fileName, res);
                console.log(result);
                break;
            case 'fulltext':
                console.log("fulltext");
                detectFulltext(fileName, res);
                console.log(result);
                break;
            default:
                return res.render('index', {title: 'Google Cloud API Test', body: "Please select an option!"});
        }
});

async function detectFaces(fileName, res) {
    // [START vision_face_detection]
    // Imports the Google Cloud client library
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
    let result = "";
    await client
        .faceDetection(fileName)
        .then(results => {
            const faces = results[0].faceAnnotations;

            result += ('Faces:');
            faces.forEach(async(face, i) => {
                result += `  Face #${i + 1}:<BR>`;
                result += (`    Joy: ${face.joyLikelihood}<BR>`);
                result += (`    Anger: ${face.angerLikelihood}<BR>`);
                result += (`    Sorrow: ${face.sorrowLikelihood}<BR>`);
                result +=(`    Surprise: ${face.surpriseLikelihood}<BR>`);
            });
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})
        })
        .catch(err => {
            result+=(`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: error occurred`})
        });

    // [END vision_face_detection]
}

async function detectLabels(fileName, res) {
    // [START vision_label_detection]
    // Imports the Google Cloud client library
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
    let result = "";
    // Performs label detection on the local file
    await client
        .labelDetection(fileName)
        .then(results => {
            const labels = results[0].labelAnnotations;
            result += ('Labels:<BR>');
            labels.forEach(label => result += (`${JSON.stringify(label)}<BR>`));
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})
        })
        .catch(err => {
            result += (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})
        });

    // [END vision_label_detection]
}

async function detectLandmarks(fileName, res) {
    // [START vision_landmark_detection]

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Performs landmark detection on the local file
    await client
        .landmarkDetection(fileName)
        .then(results => {
            const landmarks = results[0].landmarkAnnotations;
            result+=('Landmarks:<BR>');
            landmarks.forEach(landmark => result += (`${JSON.stringify(landmark)}<br>`));
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})
        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})
        });
    // [END vision_landmark_detection]
}

async function detectText(fileName, res) {
    // [START vision_text_detection]
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Performs text detection on the local file
    await client
        .textDetection(fileName)
        .then(results => {
            const detections = results[0].textAnnotations;
            result+=('Text:<BR>');
            detections.forEach(text => result+=(`${JSON.stringify(text)}<BR>`));
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})
        });
    // [END vision_text_detection]
}

async function detectLogos(fileName, res) {
    // [START vision_logo_detection]

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Performs logo detection on the local file
    await client
        .logoDetection(fileName)
        .then(results => {
            const logos = results[0].logoAnnotations;
            result+=('Logos:<BR>');
            logos.forEach(logo => result+=(`${JSON.stringify(logo)}<BR>`));
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        });
    // [END vision_logo_detection]
}


async function detectProperties(fileName, res) {
    // [START vision_image_property_detection]

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Performs property detection on the local file
    await client
        .imageProperties(fileName)
        .then(results => {
            const properties = results[0].imagePropertiesAnnotation;
            const colors = properties.dominantColors.colors;
            colors.forEach(color => result+=(`${JSON.stringify(color)} <BR>`));
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        });
    // [END vision_image_property_detection]
}

async function detectSafeSearch(fileName, res) {
    // [START vision_safe_search_detection]

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Performs safe search detection on the local file
    await client
        .safeSearchDetection(fileName)
        .then(results => {
            const detections = results[0].safeSearchAnnotation;

            result+=(`Adult: ${detections.adult}<BR>`);
            result+=(`Spoof: ${detections.spoof}<BR>`);
            result+=(`Medical: ${detections.medical}<BR>`);
            result+=(`Violence: ${detections.violence}<BR>`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        });
    // [END vision_safe_search_detection]
}

async function detectCropHints(fileName, res) {

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Find crop hints for the local file
    await client
        .cropHints(fileName)
        .then(results => {
            const cropHints = results[0].cropHintsAnnotation;

            cropHints.cropHints.forEach((hintBounds, hintIdx) => {
                result+=(`Crop Hint ${hintIdx}:<BR>`);
                hintBounds.boundingPoly.vertices.forEach((bound, boundIdx) => {
                    result+=(`  Bound ${boundIdx}: (${bound.x}, ${bound.y})<BR>`);
                });
            });
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        });
    // [END vision_crop_hint_detection]
}

async function detectWeb(fileName, res) {

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Detect similar images on the web to a local file
    await client
        .webDetection(fileName)
        .then(results => {
            const webDetection = results[0].webDetection;

            if (webDetection.fullMatchingImages.length) {
                result+=(
                    `Full matches found: ${webDetection.fullMatchingImages.length}<BR>`
                );
                webDetection.fullMatchingImages.forEach(image => {
                    result+=(`  URL: ${image.url}<BR>`);
                    result+=(`  Score: ${image.score}<BR>`);
                });
            }

            if (webDetection.partialMatchingImages.length) {
                result+=(
                    `Partial matches found: ${webDetection.partialMatchingImages.length}<BR>`
                );
                webDetection.partialMatchingImages.forEach(image => {
                    result+=(`  URL: ${image.url}<BR>`);
                    result+=(`  Score: ${image.score}<BR>`);
                });
            }

            if (webDetection.webEntities.length) {
                result+=(`Web entities found: ${webDetection.webEntities.length}<BR>`);
                webDetection.webEntities.forEach(webEntity => {
                    result+=(`  Description: ${webEntity.description}<BR>`);
                    result+=(`  Score: ${webEntity.score}<BR>`);
                });
            }
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        });
    // [END vision_web_detection]
}

async function detectFulltext(fileName, res) {

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';
let result = "";
    // Read a local image as a text document
    await client
        .documentTextDetection(fileName)
        .then(results => {
            const fullTextAnnotation = results[0].fullTextAnnotation;
            result+=(`${fullTextAnnotation.text}<BR>`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        })
        .catch(err => {
            result+= (`ERROR: ${err}`);
            return res.render('index', {title: 'Google Cloud API Test', body: `Your results are: ${result}`})

        });
    // [END vision_fulltext_detection]
}



module.exports = router;
