//require the dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
//generates a unique id https://www.npmjs.com/package/uniqid
const uniqid = require("uniqid");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//starting page is the index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public.index.html"));
});
//once get started is clicked, it will refer to the notes application
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// if there is any other url entered, they will be directed toward the starting page
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

//get method for the notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, note) => {
    let notes = JSON.parse(note);
    if (err) {
      return console.log(err);
    }
    res.json(notes);
  });
});

//post method
app.post("/api/notes", (req, res) => {
  const previousNote = req.body;
  //reading the file from db.json file
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    notes = JSON.parse(data);
    let id = uniqid(); //id is randomly assigned
    //create new note object
    let newInput = {
      title: previousNote.title,
      text: previousNote.text,
      id: id,
    };
    //add the inputted note to array
    let noteArray = notes.concat(newInput);
    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(noteArray),
      (err) => {
        if (err) {
          return console.log(err);
        }
        res.json(noteArray);
      }
    );
  });
});

app.listen(PORT, function () {
  console.log("listening on Port:" + PORT);
});
