const express = require("express");
const Cat = require("../models/cat");
const ExpressError = require("../expressError");

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
    const { id } = req.params;
    const cat = await Cat.getByID(id)
    return res.json(cat);
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, age } = req.body;
    const cat = await Cat.create(name, age);
    return res.status(201).json({ created: cat })
  } catch (e) { 
    return next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const cat = await Cat.delete(req.params.id);
    return res.json({ deleted: cat })
  } catch (e) { 
    return next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, age } = req.body;
    const cat = await Cat.update(req.params.id, name, age);
    return res.json({ updated: cat })
  } catch (e) { 
    return next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const cat = await Cat.makeOlder(req.params.id);
    return res.json({ updated: cat })
  } catch (e) { 
    return next(e);
  }
});



module.exports = router;

