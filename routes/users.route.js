// const mainData = mongoClient.db("apidata").collection("main");
// const usersData = mongoClient.db("apidata").collection("users");

// app.post("/login", (req, res) => {
//     const { username, password } = req.body;

//     if (username === "my_username" && password === "my_secret_password") {
//       const token = jwt.sign({ username }, process.env.JWT_SECRET);
//       res.send({ token });
//     } else {
//       res.status(401).json({ message: "Incorrect username or password" });
//     }
//   });

//   app.get("/users", (req, res) => {
//     const query = {};
//     const users = usersData.find(query).toArray((err, doc) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Error retrieving users from database");
//       }
//       res.status(200).send(docs);
//     });
//   });

//   app.post("/users", (req, res) => {
//     const newUser = req.body;

//     const result = usersData.insertOne(newUser, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Error adding user to database");
//       }

//       res.send(result.ops[0]);
//     });
//   });
