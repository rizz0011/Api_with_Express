const express = require("express");
const userList = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const router = express.Router()
const port = 8000;

app.use(express.urlencoded({ extended: false }));

// REST API


// Middleware 

function logger(req, res, next){
  console.log('middleware')
  next()
}

app.use(logger)


// get user
app.get("/user", (req, res) => {
  return res.status(200).json(userList);
});


// get user with specfic id
app.get("/user/:id", (req, res) => {
  const userId = Number(req.params?.id);
  const user = userList.find((i) => i.id === userId);
  return res.status(200).json(user);
});

// create new user
app.post("/user/create", (req, res) => {
  const body = req.body;
  console.log(body, "body----------");
  userList.push({ ...body, id: userList.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(userList), (err, data) => {
    res.status(201).json({ status: "success", message: "user craeted successfully" });
  });
});

//  update user
app.patch("/user/update/:id", (req, res) => {
  const userId = Number(req.params.id);
  const updateUser = { ...req.body, id: userId };
  const userIndex = userList.findIndex((i) => i.id === userId);

  if (userIndex !== -1) {
    userList[userIndex] = updateUser;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(userList), (err, data) => {
      res.status(201).json({ status: "success", message: "user updated successfully" });
    });
  } else {
    res.json({ status: "error", message: "user not found!" });
  }
});

// Delete user
app.delete("/user/:id", (req, res) => {
  userId = Number(req.params.id);
  const userIndex = userList.findIndex((i) => i.id === userId);
 
  if (userIndex !== -1) {
    const filterData = userList.filter((i) => i?.id !== userId);
    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(filterData),
      (err, data) => {
        res.json({ status: "User Deleted Succesfully" });
      }
    );
  } else {
    res.json({ error: "User Not Found!" });
  }
});

app.listen(port, () => {
  console.log("Port is running on 8000");
});
