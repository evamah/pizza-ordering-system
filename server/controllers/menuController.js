const pizzaSystem = require("../models/PizzaSystem");

function getMenu(req, res) {
    res.status(200).json(pizzaSystem.getMenu());
}

module.exports = {
    getMenu
};