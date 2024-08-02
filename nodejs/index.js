// http
const express = require("express");
const app = express()
const cors = require("cors")
// req.body // allow express to get json data by default it can't get json data
app.use(express.json())
// need to allow cross origin was block by CORS 
app.use(cors({origin:"*"}))

const employee = require("./src/route/employee.route")
const customer = require("./src/route/customer.route")
const product = require("./src/route/product.route")

employee(app)
customer(app)
product(app)


// define port to server
const port = 8081;
app.listen(8081,()=>{
    console.log("http:localhost:"+port)
})
