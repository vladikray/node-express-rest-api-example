var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")
const cors = require('cors');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var allowedOrigins = ['http://localhost:3000',
    'http://yourapp.com'];

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/posts", (req, res, next) => {
    var sql = "select * from posts"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/posts/:id", (req, res, next) => {
    var sql = "select * from posts where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


app.post("/api/posts/", (req, res, next) => {
    var errors=[]
    if (!req.body.body){
        errors.push("No body specified");
    }
    var data = {
        title: req.body.title,
        body: req.body.body
    }
    var sql ='INSERT INTO posts (title, body) VALUES (?,?);'
    var params =[data.title, data.body]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})



app.patch("/api/posts/:id", (req, res, next) => {
    var data = {
        title: req.body.title,
        body: req.body.body
    }
    db.run(
        `UPDATE posts set 
           title = coalesce(?,title), 
           body = COALESCE(?,body)
           WHERE id = ?`,
        [data.title, data.body, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})


app.delete("/api/posts/:id", (req, res, next) => {
    db.run(
        'DELETE FROM posts WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})


// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

