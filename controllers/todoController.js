const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//connect to db
mongoose.connect('mongodb://test:test1234@ds141654.mlab.com:41654/todo', { useNewUrlParser: true });

//create a schema - this is like a blueprint
const todoSchema = new mongoose.Schema({
    item: String //this is what our db is expecting
});

const Todo = mongoose.model('Todo', todoSchema); //creating the model

/*
//create and save an item when running the app.js
let itemOne = Todo({item: 'get milk'}).save(function(err){
    if(err) throw err;
    console.log('Items saved');
});*/

//let data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'play basketball'}];
const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){

    app.get('/todo', function(req, res, next){
        //get data from mongodb and pass it to the view
        Todo.find({}, function(err, data){  //find() retrieve desired data, if empty is passed it will retrieve all the data
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, function(req, res, next){
        console.log(req.body);
        //get data from the view and add it to mongodb
        const newTodo = Todo(req.body).save(function(err, data){
            if(err) throw err;
            res.json(data);
        });
        //data.push(req.body);
    });

    app.delete('/todo/:item', function(req, res, next){
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if(err) throw err;
            res.json(data);
        }); //replacing because spaces are filled with - before
        
        /*data = data.filter(function(todo){
            //this function returns true or false (if true it reamains in the array, else it is removed)
            return todo.item.replace(/ /g, '-') !== req.params.item;
        });*/
    });

};