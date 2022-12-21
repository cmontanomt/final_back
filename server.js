require('dotenv').config()
const express = require('express') 
const mysql = require('mysql') 
const myconn = require('express-myconnection') 
const routes = require('./routes')
const cors = require('cors')

const app = express()

app.use(cors())

app.set('port',process.env.PORT_SERVER)

const dbOptions = {
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
}

//middleware ----- procesos en el intermedio entre una petición y una respuesta
app.use(myconn(mysql,dbOptions,'single'))
app.use(express.json()) //formato de entrega y recepción

// routes -----
app.get('/',(req,res)=>{
    res.send('Welcome to my APP2')
})

// se usa use, porque la petición esta creada en routes
app.use('/api',routes)

app.listen(app.get('port'),()=>{
    console.log(`server running on port ${app.get('port')}`);
})


/*%
const dbOptions = {
    host:'150.230.185.202',
    port:'3306',
    user:'newuser',
    password:'PQssw0rd',
    database:'base_marcadores'
}*/