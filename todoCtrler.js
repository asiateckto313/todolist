function add_newTodo(newToDo,toDoList){
    if(newToDo !== '' || newToDo !== ' ')
        if(!alreadyExist(newToDo,toDoList)){
            toDoList.push(newToDo)
            return {error: false,data: 'todo added'};
        }
        else
            return {error: true,error_msg: 'This ToDo is already in the list'};
        
 
    else
        return {error: true,error_msg: 'Can not add empty, spacy ToDo'};
}

let alreadyExist = function alreadyExist(newToDo,toDoList){
    for(let i = 0; i< toDoList.length;i++)
        if(newToDo.toLowerCase() == toDoList[i].toLowerCase()){
            
            return true;
            break;
        }
            

    return false;
}

exports.add_newTodo = add_newTodo;
exports.alreadyExist = alreadyExist;