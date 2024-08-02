
const productController = require("../controller/product.controller")
const {upload} = require("../util/help")

const product = (app) => {
    app.get("/api/product",productController.getAll)
    app.get("/api/product/:category",productController.getOne)
    app.post("/api/product",upload.single("img_product"),productController.create)
    app.put("/api/product",productController.update)
    app.delete("/api/product/:id",productController.remove)
}

module.exports = product 