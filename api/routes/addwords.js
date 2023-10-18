const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Word = require("../modules/addword");

router.post("/", (req, res, next) => {
  const word = new Word({
    _id: req.body._id,
    eng: req.body.eng,
    uzb_first: req.body.uzb_first,
    uzb_second: req.body.uzb_second,
    trueAnswer: req.body.trueAnswer,
  });
  word
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Successfully!",
        createdWord: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/allwords", (req, res, next) => {
  Word.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});
router.get("/words", (req, res, next) => {
  const page = req.query.page || 0;
  const wordsPerPage = req.query.count || 100;
  let nextPage;
  Word.find()
    .skip(page * wordsPerPage)
    .limit(wordsPerPage)
    .exec()
    .then((result) => {
      res.status(200).json({
        nextPage: nextPage,
        result: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});
router.get("/:wordId", async (req, res, next) => {
  const id = req.params.wordId;
  await Word.findById(id)
    .exec()
    .then((doc) => {
      const response = {
        _id: doc._id,
        eng: doc.eng,
        uzb_first: doc.uzb_first,
        uzb_second: doc.uzb_second,
        trueAnswer: doc.trueAnswer,
        request: {
          type: "GET",
          url: "localhost:3000/words/" + doc._id,
        },
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.patch("/:wordId", async (req, res, next) => {
  try {
    const id = req.params.wordId;
    const updates = req.body;
    const options = { new: true };
    const result = await Word.findByIdAndUpdate(id, updates, options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

router.delete("/:wordId", async (req, res, next) => {
  const _id = req.params.wordId;
  try {
    const result = await Word.findByIdAndDelete(_id);
    if (!result) {
      res.status(404).json({
        message: "Word not found!",
      });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
module.exports = router;
