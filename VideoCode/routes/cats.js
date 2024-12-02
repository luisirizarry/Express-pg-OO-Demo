const express = require("express");
const Cat = require("../models/cat");

const router = new express.Router();


/** get all cats: [{id, name, age}, ...] */
router.get("/", async function (req, res, next) {
  try {
    const cats = await Cat.getAll();
    return res.json(cats);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const cat = await Cat.getByID(req.params.id)
    return res.json(cat);
  } catch (e) {
    return next(e);
  }
})



module.exports = router;

