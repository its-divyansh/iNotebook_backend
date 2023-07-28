const express = require("express");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

// Route 1 : get all notes of a logged in user using GET : /api/notes/fetchallnotes . Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
  } catch (error) {
    console.error(error);
      res.status(500).send("Internal server error");
  }
});
// Route 2 : add a  note of a logged in user using POST : /api/notes/addnotes . Login required

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title!").isLength({ min: 3 }),
    body("description", "Not a valid descripton").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {title, description, tags} =req.body;

    const note= new Notes({
        title,description, tags, user: req.user.id
    });
    const savedNote = await note.save();
    res.json(savedNote);
      
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 3 : update an existing note using PUT : /api/notes/updatenotes . Login required

router.put(
    "/updatenotes/:id",
    fetchuser,
    [
      body("title", "Enter a valid title!").isLength({ min: 3 }),
      body("description", "Not a valid descripton").isLength({ min: 5 }),
    ],
    
    async (req, res) => {
      const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors});
        try {
          const {title, description, tags}= req.body;
        let newNote ={};
        if(title)newNote.title= title;
        if(description)newNote.description=description;
        if(tags) newNote.tags= tags;

        let note= await Notes.findById(req.params.id);
        if(!note)return res.status(404).json("not found");
        
        if(note.user.toString()!==req.user.id)
        return res.status(401).json("Access denied");

        note =await Notes.findByIdAndUpdate(req.params.id, {$set :newNote}, {new:true});
        res.json(note);
          
        } catch (error) {
          console.error(error);
      res.status(500).send("Internal server error");
        }

    })

// Route 4 : delete an existing note using DELETE : /api/notes/deletenotes . Login required

router.delete(
    "/deletenotes/:id",
    fetchuser,
    
    async (req, res) => {
        try {
          let note= await Notes.findById(req.params.id);
        if(!note)return res.status(404).json("not found");
        
        if(note.user.toString()!==req.user.id)
        return res.status(401).json("Access denied");

        note =await Notes.findByIdAndDelete(req.params.id);
        res.json({Success : " Note has been deleted ", note : note});
          
        } catch (error) {
          console.error(error);
      res.status(500).send("Internal server error");
        }

        

    })

module.exports = router;
