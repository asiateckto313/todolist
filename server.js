const PORT = 3001,
    express = require('express'), // Framework utilisé
    bodyParser = require('body-parser'), // Charger de la gestion de params (pour le formulaire)
    session = require('cookie-session'), //Utilisation des sessions
    app = express(),
    todoCtrler = require('./todoCtrler'),
    server = require('http').createServer(app), // Création d'un serveur avec Express
    urlencodedParser = bodyParser.urlencoded({extended : false});


//app configuration
app.use('./public',express.static('public'))
.use(session({
    secret : 'Super@dminP@bloToDoList2020'
}))

/* S'il n'y a pas de todolist dans la session,
    on en crée une vide sous forme d'array avant la suite 
*/
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    if(typeof(req.session.doneTaskList) == 'undefined'){
        req.session.doneTaskList = [];
    }
    next();
})


//Routes of my application
app.get('/', (req,res) => {
    res.render('index.ejs')
})

.get('/show_my_todo_list', (req, res) => {
    res.render('todo.ejs',{todolist: req.session.todolist})

})

.get('/show_my_doneTask_list', (req, res) => {
    if(req.params.tmp)
        console.log("tmp = ",tmp)
    if(req.session.doneTaskList !== undefined)
    res.render('done.ejs',{doneTask: req.session.doneTaskList})
})

.post('/todo/add', urlencodedParser,(req, res) => {
    let result = todoCtrler.add_newTodo(req.body.newtodo,req.session.todolist)
    if(result.error)
        console.log("Error raised, error_msg : ",result.error_msg)
    else
        console.log("add_newTodo invoked")
    //After adding a todo we redirect the user to the page thath shows his todolist
    res.redirect("/show_my_todo_list")
})

.get('/todo/delete/:id', (req, res) => {
    console.log("id = ",req.params.id)
    req.session.todolist.splice(req.params.id,1)
    req.session.doneTaskList.push(req.session.todolist[req.params.id])
    //As we did with the adding part, we redirect the user to show to him the update todolist
    res.redirect("/show_my_todo_list");

})

.get("/reset_todolist", (req,res) => {
    req.session.todolist = [];
    res.render('todo.ejs',{todolist:req.session.todolist})
})

.get("/reset_doneTaskList", (req,res) =>{
    req.session.doneTaskList = []
    res.render('done.ejs',{doneTask:req.session.doneTaskList})
})

server.listen(PORT, ()=>{
    console.log("Serveur is listening on port ", PORT)
})