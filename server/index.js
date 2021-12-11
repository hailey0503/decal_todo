const express = require("express");
const port = process.env.PORT || 3700;
const app = express();

var router = express.Router()
const cors = require("cors")
app.use(express.json()); // Utilities for request bodies
app.use(express.urlencoded({ extended: true })); // Utilities for query params
app.use(cors());

// begin mongoose setup
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/database-tutorial'

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url);
})

db.on('error', err => {
  console.error('connection error:', err);
})
// end setup

// define mongoose schema
const Schema = mongoose.Schema;

const item = new Schema({
  
	task: String,
	
})

const TODO = mongoose.model("TODO", item);
// GET Request
router.get("/", (req, res) => {
	// Homepage
	res.send("TODO APP");
});

router.get("/list", (req, res) => {
	// Get all items from the DB
	TODO.find().then((todos) => {
		//console.log(todos)
		var tasks = []
		for(var i = 0; i < todos.length; i++) {
			var obj = todos[i];
			tasks.push(obj.task)
			//console.log(obj.task);
		}
		res.json({ message: 'Return all todos.', tasks});
	});
});

// POST Request

router.post("/add", (req, res) => {
	const todo = new TODO({        // Create TODO item with the appropriate fields
		task: req.body.task,
	})
	console.log(req.body)
	todo.save((error, document) => {
		if (error) {
			res.json({ status: "failure" })
		} else {
			res.json({               // Save TODO item to the database
				status: "success",	
				})
			}
		})
});

// DELETE Request

router.delete("/delete", (req, res) => {
	console.log(req.body.task)
	TODO.findOneAndDelete({ task: req.body.task }, (error, todo) => {
		if (error) {
			res.status(500).json({ status: "failure"})
		} else {
			res.json(todo)
			
		}
	});
});
app.use('/api', router);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});