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
    for (let i = 0; i < req.body.members.length; i++) {
      req.body.given[i] = 0;
    }
  } else {
    req.body.given = 0;
    //req.body.members.needed=0;
  }

  console.log(req.body);
  db.insert(req.body);
  res.redirect("/");
});

// item
app.get("/item/:itemName", (req, res) => {
  db.findOne({ title: req.params.itemName }, (err, docs) => {
    console.log(docs);
    res.render("itemView", { item: docs });
  });
});
app.post("/updateMoney", (req, res) => {
  console.log(req.body);
  db.update(
    { title: req.body.title },
    { $set: { given: req.body.given } },
    {},
    function (err, numReplaced) {
      console.log(numReplaced);
    }
  );
  res.end();
});

//The 404 Route
app.get("*", (req, res) => {
  res.status(404).render("404");
});

//server start
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
