const queries = require("./database_handler");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const express = require('express');
const cors = require("cors");
const app = express();

var corsOptions = {
    "origin": "*",
    "methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "headers": "X-Requested-With, content-type, authorization",
    "credentials": true,
};
app.use(express.json());
app.use(cors(corsOptions)); 
app.options('*', cors())

// MIDDLEWARE
function authenticateToken(request, response, next) {
    if (!request.headers || !request.headers["authorization"]) {
      return response.sendStatus(400);
    }
    const authHeader = request.headers["authorization"];
    const token = authHeader.split(" ")[1];
    console.log(token);
    if (token == null) return response.sendStatus(401);
  
    jwt.verify(token, "79D125AAE12D29F728EABA4C9C9FB8054966AED1EBBE4A50115DE78D32507BC3", (err, user) => {
      if (err) return response.sendStatus(401);
      request.user = user;
      response.status(201);
      next();
    });
  }


// ENDPOINTS
app.get('/', (req, res) => res.status(200).send());

// Create account
app.post('/register', async (req, res) => {
    console.log(req.body);
    if(!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password){
        res.status(400).send("Required fields are missing");
    }else if(await queries.userExists(req.body.username)){
        res.status(409).send("Username is already taken");
    }else{
        const hash = crypto.createHash('sha256').update(req.body.password + req.body.username).digest('base64');
        const registerResponse = await queries.register(req.body.firstName, req.body.lastName, req.body.username, hash)
        if(registerResponse){
            res.status(201).send(registerResponse);
        }else{
            res.status(500).send("Database error");
        }
        
    }
})


//Login
app.post('/login', async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).send("Required fields are missing");
    }else{
        let storedPassword = await queries.getPassword(req.body.username);
        let hash = crypto.createHash('sha256').update(req.body.password + req.body.username).digest('base64');
        if(storedPassword === hash){
            let user = await queries.getUserInfo(req.body.username);
            let token = jwt.sign(JSON.stringify(user), "79D125AAE12D29F728EABA4C9C9FB8054966AED1EBBE4A50115DE78D32507BC3");
            res.status(200).send({token: token});
        }else{
            res.status(400).send("Incorrect username or password");
        }
    }
})

//Retreiving an item by id
app.get('/item/:id', async (req, res) => {
    let id = req.params.id;
    let item = await queries.getItem(id);
    if(item){
        res.status(200).send(item)
    }else{
        res.status(404).send("No item was found")
    }
})

//Retrieving all items
app.get('/items', async (req, res) => {
    let items = await queries.getItems();
    if(items){
        res.status(200).send(items)
    }else{
        res.status(404).send("No items were found")
    }
})


//retrieve all items from a specific inventory manager
app.get('/items/:userID', authenticateToken, async (req, res) => {
    let user = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    let userID = req.params.userID;
    const num = Number(userID);
    if (!Number.isInteger(num) || num <= 0) {
        res.status(400).send('Invalid User ID')
    }else if(parseInt(userID) !== parseInt(user.id)){
        res.status(401).send();
    }else{
        let items = await queries.getUserItems(userID)
        res.status(200).send(items)
    }
})

//creating an item inventory manager
app.post('/item', authenticateToken, async (req, res) => {
    console.log(req.body);
    if(!req.body.item_name || !req.body.description || !req.body.quantity){
        res.status(400).send("Required fields are missing");
    }else{
        let userID = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", "")).id;
        let id = await queries.addItem({
            user_id: parseInt(userID),
            item_name: req.body.item_name,
            description: req.body.description,
            quantity: parseInt(req.body.quantity)
        })
        if(id){
            let items = await queries.getUserItems(userID)
            if(items){
                res.status(200).send(items)
            }else{
                res.status(500).send("Database error");
            }
        }else{
            res.status(500).send("Database error");
        }
    }
})


//deleting an item as an inventory manager
app.delete('/item', authenticateToken, async (req, res) => {
    let user = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    if(!req.body.id){
        res.status(400).send("Required fields are missing");
    }else{
        if(await queries.itemExists(req.body.id)){
            let item = await queries.getItem(req.body.id);
            if(parseInt(item.user_id) !== parseInt(user.id)){
                res.status(401).send()
            }else{
                if(await queries.deleteItem(req.body.id)){
                    res.status(200).send();
                }else{
                    res.status(500).send('Database error')
                }
            }
        }else{
            res.status(404).send('Could not find that item')
        }
    }
})

//editing an item
app.put('/item', authenticateToken, async (req, res) => {
    let user = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    if(!req.body.id || (!req.body.item_name && !req.body.description && !req.body.quantity)){
        res.status(400).send('No new item name, description, or quantity was provided.');
    }else if(await !queries.itemExists(req.body.id)){
        res.status(404).send('Could not find that item');
    }else{
        let item = await queries.getItem(req.body.id);
        if(parseInt(item.user_id) !== parseInt(user.id)){
            res.status(401).send()
        }else{
            let update = await queries.updateItem(req.body);
            if(update){
                let item = await queries.getItem(req.body.id)
                res.status(200).send(item);
            }else{
                res.status(500).send('Database error');
            }
        }
    }
})

module.exports = {app, authenticateToken};