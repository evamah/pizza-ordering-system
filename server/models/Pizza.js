class Pizza {
    constructor(pizzaId, sizeId, toppings = []) {
        this.pizzaId = pizzaId;
        this.sizeId = sizeId;
        this.toppings = toppings;
    }
}

module.exports = Pizza;