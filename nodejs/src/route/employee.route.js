// import to use it's function
// route.js is where to ask the work funtion and connect to route and export it to use in root file
const employeeController = require("../controller/employee.controller")
const {upload} = require("../util/help")
// create route
const employee = (app) => {
    
    // register route and use function from import file employee controller file
    app.get("/api/employee",employeeController.getAll)
    app.get("/api/employee/:id",employeeController.getOne)
    app.post("/api/employee",upload.single("img_emp"),employeeController.create)
    app.post("/api/employee/set-password",employeeController.setPassword)
    app.post("/api/employee/login",employeeController.login)
    // add :id to route to dynamic delete data using id
    app.delete("/api/employee",employeeController.remove)
    app.put("/api/employee",employeeController.update)

}
module.exports = employee