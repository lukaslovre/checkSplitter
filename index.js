const express = require("express");
const Datastore = require("nedb");
const multer = require("multer");

const app = express();
const db = new Datastore({ filename: "database.db", autoload: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + ".jpg";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/*

    ^^ SETUP ABOVE ^^

*/

// home page
app.get("/", (req, res) => {
  db.find({}, (err, docs) => {
    for (let i = 0; i < docs.length; i++) {
      delete docs[i].notes;
      delete docs[i].members;
      delete docs[i].img;
      delete docs[i].given;
      delete docs[i].needed;
    }
    res.render("home", { titles: docs });
  });
});

//new item
app.get("/newItem", (req, res) => {
  res.render("newitem");
});
app.post("/newItem", upload.single("img"), (req, res) => {
  if (req.file == undefined) {
    req.body.img = "disii.jpg";
  } else {
    req.body.img = req.file.filename;
  }
  if (Array.isArray(req.body.members)) {
    req.body.given = [];
    req.body.needed = [];
    for (let i = 0; i < req.body.members.length; i++) {
      req.body.given[i] = 0;
      req.body.needed[i] = "N/A";
    }
  } else {
    req.body.given = 0;
    req.body.needed = "N/A";
  }

  console.log(req.body);
  db.insert(req.body, (err, newDoc) => {
    res.redirect("/item/" + newDoc._id);
  });
});

// view check
app.get("/item/:itemId", (req, res) => {
  db.findOne({ _id: req.params.itemId }, (err, docs) => {
    res.render("itemView", { item: docs });
  });
});
app.post("/updateMoney", (req, res) => {
  console.log(req.body);
  db.update(
    { _id: req.body.id },
    { $set: { given: req.body.given, needed: req.body.needed } },
    {},
    function (err, numReplaced) {
      console.log(numReplaced);
    }
  );
  res.end();
});

app.get("/edit/:itemId", (req, res) => {
  db.findOne({ _id: req.params.itemId }, (err, docs) => {
    res.render("editItem", { item: docs });
  });
});
app.post("/editItem", upload.single("img"), (req, res) => {
  if (Array.isArray(req.body.members)) {
    req.body.given = [];
    req.body.needed = [];
    for (let i = 0; i < req.body.members.length; i++) {
      req.body.given[i] = 0;
      req.body.needed[i] = "N/A";
    }
  } else {
    req.body.given = 0;
    req.body.needed = "N/A";
  }

  if (req.body.members) {
    if (req.file == undefined) {
      // ako nije uploadana nova slika
      if (Array.isArray(req.body.members)) {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
            },
            $push: {
              members: {
                $each: req.body.members,
              },
              given: {
                $each: req.body.given,
              },
              needed: {
                $each: req.body.needed,
              },
            },
          }
        );
      } else {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
            },
            $push: {
              members: req.body.members,
              given: req.body.given,
              needed: req.body.needed,
            },
          }
        );
      }
    } else {
      // ako je uploadana nova slika
      if (Array.isArray(req.body.members)) {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
              img: req.file.filename,
            },
            $push: {
              members: {
                $each: req.body.members,
              },
              given: {
                $each: req.body.given,
              },
              needed: {
                $each: req.body.needed,
              },
            },
          }
        );
      } else {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
              img: req.file.filename,
            },
            $push: {
              members: req.body.members,
              given: req.body.given,
              needed: req.body.needed,
            },
          }
        );
      }
    }
  } else {
    if (req.file == undefined) {
      // ako nije uploadana nova slika
      if (Array.isArray(req.body.members)) {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
            },
          }
        );
      } else {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
            },
          }
        );
      }
    } else {
      // ako je uploadana nova slika
      if (Array.isArray(req.body.members)) {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
              img: req.file.filename,
            },
          }
        );
      } else {
        db.update(
          { _id: req.body.id },
          {
            $set: {
              title: req.body.title,
              date: req.body.date,
              notes: req.body.notes,
              img: req.file.filename,
            },
          }
        );
      }
    }
  }

  console.log(req.body);
  res.redirect("/");
});

//The 404 Route
app.get("*", (req, res) => {
  res.status(404).render("404");
});

//server start
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
