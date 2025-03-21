import express from "express";
import {sequelize} from "./models/index.js";
import {router as cocktailRoutes} from "./controllers/cocktailController.js";
import {router as ingredientRoutes} from "./controllers/ingredientController.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/cocktails", cocktailRoutes);
app.use("/api/ingredients", ingredientRoutes);

app.get("/", (req, res) => {
    res.send("Witam i Pozdrawiam :D");
});

sequelize
    .sync()
    .then(() => {
        console.log("Sequelize successful");
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => console.error("Sequelize error:", err));