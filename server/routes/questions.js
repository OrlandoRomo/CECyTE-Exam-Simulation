const express = require('express');
const app = express();
const Question = require('../models/question');
let { isAuth } = require('../middlewares/auth');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

//Call fileUpload Middleware
app.use(fileUpload());

//Questions GET
app.get('/question', isAuth, (req, res) => {
    Question.findRandom({}, 'questionDescription options imgs correctOption', (err, questionsDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        return res.status(200).json({
            ok: true,
            questionsDB
        })
    });
})

//Questions POST Method
app.post('/question', isAuth, (req, res) => {
    let requestFiles = [];
    let body = req.body;
    if (req.files !== null) {
        requestFiles = req.files.images;
        //Converting the Object req.files to Array and passing by reference requestFiles
        body['imgs'] = convertObjectToArray(req, requestFiles);
    }
    let question = new Question(body);
    question.save((err, newQuestion) => {
        saveImagesServer(requestFiles, req, res)
        if (err) {
            deleteImagesServer(requestFiles, req);
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
                message: 'La pregunta no existe'
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

//Questions DELETE
app.delete('/question/:id', isAuth, (req, res) => {
    let idQuestion = req.params.id;
    let imagesArray = [];
    Question.findByIdAndRemove({ _id: idQuestion }, (err, deleteQuestion) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!deleteQuestion) return res.status(400).json({
            ok: false,
            err: {
                message: 'La pregunta no existe'
            }
        });
        if (deleteQuestion.imgs !== null) {
            deleteQuestion.imgs.forEach((image, index) => {
                let pathImageURL = path.resolve(__dirname, `../../uploads/questions/${image}`);
                if (fs.existsSync(pathImageURL))
                    fs.unlinkSync(pathImageURL);
            });
        }
        return res.status(200).json({
            ok: true,
            deleteQuestion,
            message: 'Pregunta eliminada correctamente.'
        })

    });
});

//Function that convert the req.files object to array
function convertObjectToArray(req, requestFiles) {
    let imagesArray = [];
    //If exists images then the for will put the array the images's name
    if (Object.keys(req.files).length !== 0) {
        requestFiles = [].concat(req.files.images);
        for (let i = 0; i < requestFiles.length; i++)
            imagesArray.push(requestFiles[i]['name']);
    }
    return imagesArray;
}

//Function that saves the files in the server after recording data in mongodb
function saveImagesServer(requestFiles, req, res) {

    if (req.files !== null) {
        requestFiles = [].concat(req.files.images);
        for (let i = 0; i < requestFiles.length; i++) {
            let newImageName = requestFiles[i]['name'];
            requestFiles[i].mv(`uploads/questions/${newImageName}`, (err) => {
                return res.status(500).end();
            });
        }
    } else return;
}

//Function that deletes the images in the server if there is an error saving a question
function deleteImagesServer(requestFiles, req) {
    if (req.files !== null) {
        requestFiles = [].concat(req.files.images);
        for (let i = 0; i < requestFiles.length; i++) {
            let imageName = requestFiles[i]['name'];
            let pathImageURL = path.resolve(__dirname, `../../uploads/questions/${imageName}`);
            if (fs.existsSync(pathImageURL)) {
                fs.unlinkSync(pathImageURL);
            }
        }
    }
}
module.exports = app;