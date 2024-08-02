// create funtion to use in route.js
// controller file is where all the work are

const db = require("../util/db");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  const { textSerch } = req.query;
  var sqlSelect = "SELECT * FROM customer ";
  if (textSerch != null && textSerch != "") {
    sqlSelect +=
      "WHERE username LIKE '%" +
      textSerch +
      "%' OR tel LIKE '%" +
      textSerch +
      "%'";
  }
  sqlSelect += "ORDER BY customer_id DESC"
  const userList = await db.query(sqlSelect);
  const total = await db.query(
    "SELECT COUNT(customer_id) as Total FROM customer"
  );
  res.json({
    list: userList,
    totalRecord: total,
  });
};

// const create = (req, res) => {
//   const { 
//     username, 
//     tel, 

//   } = req.body;
//   // sql statement
//   const sqlInsert =
//     "INSERT INTO `customer` (`username`, `tel`) VALUES (?,?) ";
//   const sqlParam = [
//     username,
//     tel
//   ];

//   db.query(sqlInsert, sqlParam, (error, rows) => {
//     if (!error) {
//       res.json({
//         message: "Insert successfully",
//         data: rows,
//       });
//     } else {
//       res.json({
//         error: true,
//         message: error,
//       });
//     }
//   });
// };
const create = (req, res) => {
  const { 
    username, 
    tel,
    password // Add password parameter
  } = req.body;

  // Validate if the required parameters are present
  if (!username || !tel || !password) {
    return res.json({
      error: true,
      message: "Username, telephone, and password are required fields",
    });
  }

  // sql statement
  const sqlInsert =
    "INSERT INTO `customer` (`username`, `tel`, `password`) VALUES (?,?,?)";
  const sqlParam = [
    username,
    tel,
    bcrypt.hashSync(password, 10) // Hash the password before storing
  ];

  db.query(sqlInsert, sqlParam, (error, rows) => {
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
};


const setPassword = async (req, res) => {
  // update column password
  const { tel, password } = req.body;
  // validate param require
  var message = {};
  if (tel == null || tel == "") {
    message.tel = "Telephone require";
  }
  if (password == null || password == "") {
    message.password = "Password require";
  }

  if (Object.keys(message).length) {
    res.json({
      message: message,
    });
    return false;
  }

  const user = await checkExistUser(tel);
  if (!user) {
    res.json({
      message: "User doesn't exist",
    });
  } else {
    // bcrypt : hash password
    const hashPassword = await bcrypt.hashSync(password, 10);
    var sql = "UPDATE customer SET password = ? WHERE tel = ?";
    const data = await db.query(sql, [hashPassword, tel]);
    // delete password : we don't want to show password of user
    delete user.password
    res.json({
      message: data.affectedRows ? "Password set success" : "Something wrong",
      profile: user
    });
  }
};

const checkExistUser = async (tel) => {
  const user = await db.query("SELECT * FROM customer WHERE tel = ?", [tel]);
  if (user) {
    return user[0];
  } else {
    return null;
  }
};

const login = async (req, res) => {
  const { tel, password } = req.body;
  var message = {};
  if (tel == null || tel == "") {
    message.tel = "Please input telephone";
  }
  if (password == null || password == "") {
    message.password = "Password require";
  }
  if (Object.keys(message).length > 0) {
    res.json({
      message: message,
    });
    return;
  }
  const user = await checkExistUser(tel);
  if (!user) {
    res.json({
      message: "User does not exist",
    });
  } else {
      // verify password (passwordFromClient, passwordInDB)
      const isCorrectPassword = await bcrypt.compareSync(
        password,
        user.password
      );
      delete user.password
      res.json({
        isSuccess : isCorrectPassword ? true : false,
        message: isCorrectPassword ? "Login success" : "Incorrect Password",
        profile: isCorrectPassword ? user : null
      });
    }
};

const remove = (req, res) => {
  // request data {id} from user to delete the record
  // req.params = ask from route
  var { id } = req.params;

  const sqlDelete = "DELETE FROM `customer` WHERE customer_id = ?";
  const sqlParam = [id];

  db.query(sqlDelete, sqlParam, (error, rows) => {
    if (!error) {
      if (rows.affectedRows == 0) {
        res.json({
          message: "Customer not found",
          data: rows,
        });
      } else {
        res.json({
          message: "Customer Remove",
          data: rows,
        });
      }
    } else {
      res.json({
        error: true,
        message: error,
      });
    }
  });
};

const update = (req, res) => {
  // request data from user to update what information
  // req.body = make change of data in body in postman
  var {
    customer_id,
    username,
    tel,
  } = req.body;

  const sqlUpdate =
    "UPDATE `customer` SET `username`=?,`tel`=? WHERE `customer_id` = ?";
  const sqlParam = [
    username,
    tel,
    customer_id,
  ];

  db.query(sqlUpdate, sqlParam, (error, rows) => {
    if (!error) {
      res.json({
        message: "Update sucessfully",
        data: rows,
      });
    } else {
      res.json({
        error: true,
        message: error,
      });
    }
  });
};

// export all function
module.exports = {
  getAll,
  create,
  remove,
  update,
  setPassword,
  login,
};
