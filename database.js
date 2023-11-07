var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text, 
            body text
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO posts (title, body) VALUES (?,?)'
            db.run(insert, ["admin","admin@example.com"])
            db.run(insert, ["posts","posts@example.com"])
        }
    })  
    }
})


module.exports = db

