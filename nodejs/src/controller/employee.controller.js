// create funtion to use in route.js
// controller file is where all the work are

const db = require("../util/db");
const bcrypt = require("bcrypt");
const removeFile = require("../util/help")

const getAll = async (req, res) => {
  const { textSerch } = req.query;
  var sqlSelect = "SELECT * FROM employee ";
  if (textSerch != null && textSerch != "") {
    sqlSelect +=
      "WHERE firstname LIKE '%" +
      textSerch +
      "%' OR lastname LIKE '%" +
      textSerch +
      "%' OR tel LIKE '%" +
      textSerch +
      "%'";
  }
  sqlSelect += "ORDER BY employee_id DESC"
  const employeeList = await db.query(sqlSelect);
  const total = await db.query(
    "SELECT COUNT(employee_id) as Total FROM employee"
  );
  res.json({
    list: employeeList,
    totalRecord: total,
  });
};

const getOne = (req, res) => {
  var { id } = req.params;
  const sqlFind = "SELECT * FROM `employee` WHERE employee_id = ?";
  const param = [id];

  db.query(sqlFind, param, (error, rows) => {
    if (!error) {
      if (rows.length === 0) {
        res.json({
          message: "No employee with id: " + id,
        });
      } else {
        res.json({
          employeeList: rows,
        });
      }

      // res.json({
      //     employeeList: rows
      // })
    } else {
      res.json({
        error: true,
        message: error,
      });
    }
  });
};

const create = (req, res) => {
  // request data from user
  // req.body = ask from body in postman
  const { 
    firstname, 
    lastname, 
    gender, 
    dob, 
    email, 
    tel, 
    role, 
    address 
  } = req.body;

  var filename = null

  if(req.file){
    filename = req.file.filename
  }
  // sql statement
  const sqlInsert =
    "INSERT INTO `employee` (`firstname`, `lastname`, `gender`, `dob`, `img` , `email`, `tel`, `role`, `address`) VALUES (?,?,?,?,?,?,?,?,?) ";
  const sqlParam = [
    firstname,
    lastname,
    gender,
    dob,
    filename,
    email,
    tel,
    role,
    address,
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
  const { tel, password, confirmPassword } = req.body;
  // validate param require
  var message = {};
  if (tel == null || tel == "") {
    message.tel = "Telephone require";
  }
  if (password == null || password == "") {
    message.password = "Password require";
  } else {
    if (password != confirmPassword) {
      message.password = "Password not match";
    }
  }
  // message object after if else function run
  // will get the following value
  // message = {
  //     tel : "Telephone require",
  //     password : "Password require" || "Password not match"
  // }

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
    var sql = "UPDATE employee SET password = ? WHERE tel = ?";
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
  const user = await db.query("SELECT * FROM employee WHERE tel = ?", [tel]);
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
  const { employee_id } = req.body;

  var sqlDelete = "DELETE FROM `employee` WHERE employee_id = ?";
  var sqlParam = [employee_id];

  db.query(sqlDelete, sqlParam, (error, rows) => {
    if (!error) {
      // if(rows.affectedRows != 0){
      //   removeFile(img)
      // }
      if (rows.affectedRows == 0) {
        res.json({
          message: "Employee not found",
          data: rows,
        });
      } else {
        res.json({
          message: "Employee Remove",
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
    employee_id,
    firstname,
    lastname,
    gender,
    dob,
    tel,
    email,
    role,
    address,
  } = req.body;
  const sqlUpdate =
    "UPDATE `employee` SET `firstname`=?,`lastname`=?,`gender`=?,`dob`=?,`email`=?,`tel`=?,`role`=?,`address`=? WHERE `employee_id` = ?";
  const sqlParam = [
    firstname,
    lastname,
    gender,
    dob,
    email,
    tel,
    role,
    address,
    employee_id,
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
  getOne,
  setPassword,
  login,
};
