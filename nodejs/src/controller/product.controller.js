const db = require("../util/db")

const getAll = async (req,res) => {
  var sqlSelect = "SELECT * FROM product"
  const listProduct = await db.query(sqlSelect)
  res.json({
    product: listProduct
  })
}

const getOne = async (req,res) => {
  var {category} = req.params
  var sqlSelectOne = "SELECT `name`, `category`, `price`, `year` FROM `product` WHERE `category` = ?";
  var param = [category]
  const listProductOne = await db.query(sqlSelectOne, param)
  res.json({
    product: listProductOne
  })
}

const create =  (req,res) => {
  var {
    name,
    category,
    price,
    year
  } = req.body
  var filename = null
  if(req.file){
    filename = req.file.filename
  }
  var sqlCreate = "INSERT INTO `product`(`name`, `category`, `price`, `year`, `img`) VALUES (?,?,?,?,?);";
  var param = [name,category,price,year,filename]
  db.query(sqlCreate,param, (error,rows) => {
    if (!error) {
      res.json({
        message: "Insert successfully",
        data: rows,
      });
    } else {
      res.json({
        error: true,
        message: error,
      });
    }
  });
}

const remove = async (req,res) => {
  var {id} = req.params
  var sqlDelete = "DELETE FROM product WHERE id = ?"
  var param = [id]
  const deleteProduct = await db.query(sqlDelete,param);
  res.json({
    message: deleteProduct.affectedRows != 0 ? "Remove success" : "Product not exist"
  })
}

const update = async (req,res) => {
  var {
    id,
    name,
    category,
    price,
    year
  } = req.body
  var sqlUpdate = "UPDATE `product` SET `name`=?,`category`=?,`price`=?,`year`=? WHERE id = ?";
  var param = [name,category,price,year,id]
  const updateProduct = await db.query(sqlUpdate,param)
  res.json({
    message: updateProduct.affectedRows != 0 ? "Update success" : "Update fail"
  })
}

module.exports = {
  getAll,
  getOne,
  create,
  remove,
  update,
};
