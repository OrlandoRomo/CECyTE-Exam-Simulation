const express = require('express');
const app = express();
const Question = require('../models/question');
let { isAuth } = require('../middlewares/auth');
const multipar = require('connect-multiparty');
const multiparMiddleware = multipar();
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');


//Set Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
//Questions GET for IONIC
app.get('/question', isAuth, (req, res) => {
    Question.findRandom({}, 'questionDescription options imgs correctOption', { limit: 20 }, (err, questionsDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        return res.status(200).json({
            ok: true,
            questionsDB
        })
    });
});

app.get('/questions', isAuth, (req, res) => {
    Question.find().populate('category', 'nameCategory').exec((err, questionsDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        return res.status(200).json({
            ok: true,
            questionsDB
        })
    });
});

//Questions POST Method
app.post('/question', [isAuth, multiparMiddleware], (req, res) => {
    let requestFiles = [];
    let urlCloudinary = [];
    let imagesNameArray = [];
    let counter = 0;
    let body = req.body;
    if (Object.keys(req.files).length === 0) {
        let question = new Question(body);
        question.save((err, newQuestion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                question: newQuestion
            })
        });
    } else {
        //Converting the Object req.files to Array and passing by reference requestFiles
        body['imgs'] = convertObjectToArray(req, requestFiles);
        imagesNameArray = getImagesName(req, requestFiles);
        for (let i = 0; i < body['imgs'].length; i++) {

            cloudinary.uploader.upload(body.imgs[i], function(result) {
                deleteImagesServer(body.imgs);
                if (result.error) {
                    return res.status(500).json({
                        ok: false,
                        message: 'No se pudo conectar con el servidor, inténtelo más tarde.'
                    });
                }
                counter++;
                urlCloudinary.push(result.url);
                if (counter === body['imgs'].length) {
                    body['imgs'] = urlCloudinary
                    let question = new Question(body);
                    question.save((err, newQuestion) => {
                        if (err) {
                            deleteImagesCloudinary(imagesNameArray);
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }
                        return res.status(200).json({
                            ok: true,
                            question: newQuestion
                        })
                    });
                }

            }, { public_id: `${imagesNameArray[i]}` });
        }
    }
});

//Questions PUT except the images for the question
app.put('/question/:id', isAuth, (req, res) => {
    let idQuestion = req.params.id;
    let body = req.body;

    Question.findByIdAndUpdate(idQuestion, body, { new: true, runValidators: true, context: 'query' }, (err, updateQuestion) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        });
        if (!updateQuestion) return res.status(400).json({
            ok: false,
            err: {
                message: 'La pregunta no existe.'
            }
        });
        return res.status(200).json({
            ok: true,
            updateQuestion
        });
    });
});
//Questions PUT for Images
app.put('/question/images/:imageName', isAuth, (req, res) => {
    let requestFiles = [];
    let imageName = req.params.imageName;
    let body;
    if (req.files !== null) {
        requestFiles = req.files.images;
        body = convertObjectToArray(req, requestFiles);
    }
    Question.findOne({ imgs: imageName }, (err, questionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!questionDB) {
            return res.status(500).json({
                ok: false,
                err: { message: 'La imagen no se encuentra' }
            });
        }
        //Remove and update the image by the user request
        if (questionDB.imgs !== null) {
            questionDB.imgs.forEach((image, index) => {
                if (imageName === image) {
                    let pathImageURL = path.resolve(__dirname, `../../uploads/questions/${imageName}`);
                    if (fs.existsSync(pathImageURL)) {
                        fs.unlinkSync(pathImageURL);
                        questionDB.imgs.splice(index, 1);
                    }
                }
            });
        }
        questionDB.imgs.push(body);
        Question.findOneAndUpdate({ _id: questionDB._id }, questionDB, { new: true, runValidators: true, context: 'query' }, (err, updateImgsQuestion) => {
            saveImagesServer(requestFiles, req, res);
            if (err) {
                deleteImagesServer(requestFiles, req);
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                updateImgsQuestion
            })
        });
    });
});

//Questions GET for Images
app.get('/question/images/:id', isAuth, (req, res) => {
    let idQuestion = req.params.id;
    let imagesArray = [];
    Question.findOne({ _id: idQuestion }, (err, imagesDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!imagesDB) return res.status(401).json({
            ok: false,
            message: 'La pregunta no existe.'
        });
        if (imagesDB.imgs === null) {
            return res.status(200).json({
                message: 'No hay imágenes de la pregunta.'
            });
        }
        //Here is the cloudinary GET
    });
});

//Questions DELETE
app.delete('/question/:id', isAuth, (req, res) => {
    let idQuestion = req.params.id;
    let imagesArray = [];
    let urlPublicId = [];
    Question.findOne({ _id: idQuestion }).exec((err, findQuestion) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!findQuestion) return res.status(400).json({
            ok: false,
            err: {
                message: 'La pregunta no existe'
            }
        });
        if (findQuestion.imgs.length === 0) {
            Question.findByIdAndRemove({ _id: idQuestion }, (err, deleteQuestion) => {
                if (err) return res.status(500).json({
                    ok: false,
                    err
                });
                return res.status(200).json({
                    ok: true,
                    deleteQuestion
                })
            });
        } else {
            for (let i = 0; i < findQuestion.imgs.length; i++) {
                urlPublicId.push(getPublicIdAndDelete(findQuestion.imgs[i]));
                cloudinary.uploader.destroy(urlPublicId[i], function(result, error) {});
            }
            Question.findByIdAndRemove({ _id: idQuestion }, (err, deleteQuestion) => {
                if (err) return res.status(500).json({
                    ok: false,
                    err
                });
                return res.status(200).json({
                    ok: true,
                    deleteQuestion
                })
            });
        }
    });
});

//Function that convert the req.files object to array
function convertObjectToArray(req, requestFiles) {
    let imagesArray = [];
    //If exists images then the for will put the array the images's name
    if (Object.keys(req.files).length !== 0) {
        requestFiles = [].concat(req.files.images);
        for (let i = 0; i < requestFiles.length; i++)
            imagesArray.push(requestFiles[i]['path']);
    }
    return imagesArray;
}
//Function that gets the images name
function getImagesName(req, requestFiles) {
    let imagesArray = [];
    //If exists images then the for will put the array the images's name
    if (Object.keys(req.files).length !== 0) {
        requestFiles = [].concat(req.files.images);
        for (let i = 0; i < requestFiles.length; i++)
            imagesArray.push(requestFiles[i]['name']);
    }
    return imagesArray;
}
// Function that deletes the images in cloudinary by public_id url
function deleteImagesCloudinary(urlCloudinary) {
    urlCloudinary.forEach((url) => {
        cloudinary.uploader.destroy(url, function(result) {
            console.log(result);
        });
    });
}

//Function that gets the public_id in the cloudinary url
function getPublicIdAndDelete(imgsPublicId) {
    let extentionsArray = ['.jpg', '.png', '.jpeg'];
    let filename = imgsPublicId.split('/').pop();
    let extentionMatch;
    extentionsArray.every(extentions => {
        extentionMatch = extentions;
        return !filename.includes(extentions);
    });
    filename = filename.substr(0, filename.lastIndexOf(extentionMatch));
    return filename;
}
//Function that deletes the images in the server if there is an error saving a question
function deleteImagesServer(tmpUrl) {
    tmpUrl.forEach((url) => {
        if (fs.existsSync(url)) {
            fs.unlinkSync(url);
        }
    });
}
module.exports = app;