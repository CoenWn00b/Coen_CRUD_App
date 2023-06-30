const env = process.env.NODE_ENV || "development";
const config = require("./knexfile.js")[env];
const knex = require("knex")(config);


//create account function
const register = async (firstName, lastName, username, password) => {
    return await knex("users")
        .insert({
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: password
        })
        .returning("id")
        .then(response => {
            return({
                id: response[0].id,
                firstName: firstName,
                lastName: lastName,
                username: username,
            })
        })
        .catch(err => {
            console.error(err)
            return(false)
        });
    
}


//function to determine if user exists
const userExists = async (username) => {
    let user =  await knex('users')
        .where("username", "=", username)
        .catch(err => {
            console.error(err)
        });
    if(user.length > 0){
        return true
    }else{
        return false
    }
}


//function to pull password from username
const getPassword = async (username) => {
    let result = await knex('users')
        .select('password')
        .where('username', '=', username)
        .catch(err => {
            console.error(err)
        });
    if(result.length > 0){
        let hash = result[0].password;
        return hash;
    }else{
        return false;
    }
}


//function to pull user info from username
const getUserInfo = async (username) => {
    let user = await knex('users')
        .where('username', '=', username)
        .catch(err => {
            console.error(err);
            return false;
        });
    if(user.length > 0){
        return user;
    }else{
        return false;
    }
}


//function to add a item
const addItem = async (item) => {
    return await knex('items')
        .insert(item)
        .returning("id")
        .then(response => {
            return(response[0].id)
        })
        .catch(err => {
            console.error(err)
            return(false)
        });
}

//function to determine if a item exists
const itemExists = async (id) => {
    return await knex('items')
        .where('id', '=', id)
        .then(response => {
            if(response.length > 0){
                return true;
            }else{
                return false;
            }
        })
        .catch(err => {
            console.error(err);
            return false;
        })
}

//function to delete a item
const deleteItem = async (id) => {
    return await knex('items')
        .where('id', '=', id)
        .del()
        .then(() => true)
        .catch(err => {
            console.error(err);
            return false;
        })
}

//function to update a item
const updateItem = async (item) => {
    let newItem = {};
    if(Object.keys('item_name')){
        newItem.item_name = item.item_name;
    }
    if(Object.keys('description')){
        newItem.description = item.description;
    }
    if(Object.keys('quantity')){
        newItem.quantity = item.quantity;
    }
    return await knex('items')
        .where('id', '=', item.id)
        .update(newItem)
        .returning('id', 'user_id', 'item_name', 'description', 'quantity')
        .then(response => true)
        .catch(err => {
            console.error(err);
            return false;
        })
}

//function to retrieve a item
const getItem = async (id) => {
    let item = await knex('items')
        .where('id', '=', id)
        .catch(err => {
            console.error(err);
            return false;
        })
    let user = await knex('users')
        .where('id', '=', item[0].user_id)
        .catch(err => {
            console.error(err);
        })
    item[0].firstName = user[0].first_name;
    item[0].lastName = user[0].last_name;
    if(item.length > 0){
        return item[0];
    }else{
        return false;
    }
}

//function to pull all items from a specific inventory manager
const getUserItems = async (userID) => {
    let items = await knex('items')
        .where('user_id', '=', userID)
        .orderBy('id', 'desc')
        .catch(err => {
            console.error(err);
            return false;
        })
    let users = await knex('users')
        .select('id', 'first_name', 'last_name')
        .catch(err => {
            console.error(err)
        });
    items.forEach((item, i) => {
        let user = users.find(user => user.id === item.user_id)
        if(user){
            items[i].firstName = user.first_name;
            items[i].lastName = user.last_name;
        }
    })
    return items;
}

//function to retrieve all items
const getItems = async () => {
    let items = await knex('items')
        .orderBy('id', 'desc')
        .catch(err => {
            console.error(err)
        });
    let users = await knex('users')
        .select('id', 'first_name', 'last_name')
        .catch(err => {
            console.error(err)
        });
    items.forEach((item, i) => {
        let user = users.find(user => user.id === item.user_id)
        if(user){
            items[i].firstName = user.first_name;
            items[i].lastName = user.last_name;
        }
    })
    if(items.length > 0){
        return items
    }else{
        return false
    }
}

//export all functions
module.exports = {
    register,
    userExists,
    getPassword,
    getUserInfo,
    addItem,
    itemExists,
    deleteItem,
    updateItem,
    getItem,
    getUserItems,
    getItems
}