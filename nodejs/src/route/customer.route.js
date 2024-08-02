const {upload} = require("../util/help")
const customerController = require("../controller/customer.controller")

const customer = (app) => {
    app.get("/api/customer",customerController.getAll)
    // app.get("/api/customer:id",customerController.getOne)
    app.post("/api/customer",upload.single("img_user"),customerController.create)
    app.post("/api/customer/set-password",customerController.setPassword)
    app.post("/api/customer/login",customerController.login)
    app.put("/api/customer",customerController.update)
    app.delete("/api/customer/:id",customerController.remove)
}

module.exports = customer