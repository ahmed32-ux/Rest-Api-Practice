const express = require ('express');
const fs = require("fs");
const users = require("./MOCK_DATA.json");


const app = express();
const PORT = 8000;


// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// GET all users
app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);

        return res.json(user);
    })

    .patch((req, res) => {
        const id = Number(req.params.id);

        const user = users.find((user) => user.id === id);

        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "User Not Found"
            });
        }

        Object.assign(user, req.body);

        fs.writeFile(
            "./MOCK_DATA.json",
            JSON.stringify(users),
            (error) => {

                if (error) {
                    return res.status(500).json({
                        status: "Error",
                        message: "Failed to update user"
                    });
                }

                return res.json({
                    status: "Success",
                    user: user
                });
            }
        );
    })
    .delete((req, res) => {

        return res.json({status: "pending"});
    });
    app.post("/api/users", (req, res) => {
        const body = req.query;
        const newUser = {...body, id: users.length +1}
        users.push(newUser);
        fs.writeFile( "./MOCK_DATA.json", JSON.stringify(users), (error, data) => { 
        return res.json({
        status: "Success",
        id: users.length
});
        } );

    });


app.get ("/users", (req,res) => {
    const html = `
    <ul>
        ${users.map((user) => `
    <li>${user.first_name}</li>
    <li>${user.email}</li>`).join("")}
    <ul/>`
    res.send(html);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))