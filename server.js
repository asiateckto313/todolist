const PORT = 3001,
    EventEmitter = require('events').EventEmitter,
    express = require('express'), // Framework utilisé
    bodyParser = require('body-parser'), // Charger de la gestion de params (pour le formulaire)
    session = require('cookie-session'), //Utilisation des sessions
    app = express(),
    todoCtrler = require('./todoCtrler'),
    server = require('http').createServer(app), // Création d'un serveur avec Express
    urlencodedParser = bodyParser.urlencoded({extended : false});

let session_event = new EventEmitter(),
    //There is my function to check the expiration manually
    hasExpired = (req, res) => {
    if(req.sessionOptions.expires){
        let date_from_now = new Date(Date.now()),expired_time = req.sessionOptions.expires
        if( date_from_now == expired_time)
            session_event.emit('hasExpired')
    }

}


//app configuration
app.use('./public',express.static('public'))
.use(session({
    secret : 'Super@dminP@bloToDoList2020',
    expires:new Date(Date.now()+ 30 * 1000)
}))


/* S'il n'y a pas de todolist dans la session,
    on en crée une vide sous forme d'array avant la suite 
*/
.use( (req, res, next)=>{
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    if(typeof(req.session.doneTaskList) == 'undefined'){
        req.session.doneTaskList = [];
    }
    next();
})


//I got an issue here, it's said hasExpired(my function) has to be callBack one
.use( (req, res, next)=>{
    setInterval(hasExpired(req,res),1)
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
    console.log("tab[i] = ",req.session.todolist[req.params.id])
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

.get("/timeleft", (req, res)=>{
    try{
    res.end(req.session.cookie.expires)
    console.log(req.session.cookie.expires)
    }catch(e){
        console.log("erreur e")
        try {
            console.log(req.session.maxAge)
            console.log(req.sessionOptions.maxAge)
            console.log(req.sessionOptions.secret)
            console.log(req.sessionOptions.expires)
            console.log(req.sessionOptions.expires.toString())
            hasExpired(req,res)
            
        } catch (f) {
            console.log("erreur f")
            console.log(f)
            try {
                console.log(req.sessionOptions.maxAge)
            } catch (g) {
                console.log("Bah aucun de tous ça")
                console.log(req.sessionOptions.expires)

            }
        }
    }
    res.end()
})

//setInterval(hasExpired(req,res),1)
session_event.on('hasExpired', () => {
    console.log("hasExpired event emitted")

})
server.listen(PORT, ()=>{
    console.log("Serveur is listening on port ", PORT)
})