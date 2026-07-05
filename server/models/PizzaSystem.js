const menu = require("../data/menu");

class PizzaSystem {
    constructor() {
        this.orders = [];
        this.nextOrderId = 1;
    }

    getMenu() {
        return menu;
    }

    findPizza(pizzaId) {
        return menu.pizzas.find((pizza) => pizza.id === pizzaId);
    }

    findSize(sizeId) {
        return menu.sizes.find((size) => size.id === sizeId);
    }

    findTopping(toppingId) {
        return menu.toppings.find((topping) => topping.id === toppingId);
    }

    calculatePrice(pizzas) {
        let pizzaBaseTotal = 0;
        let sizeTotal = 0;
        let toppingsTotal = 0;

        for (const item of pizzas) {
            const pizza = this.findPizza(item.pizzaId);
            const size = this.findSize(item.sizeId);

            pizzaBaseTotal += pizza.price;
            sizeTotal += size.price;

            for (const toppingId of item.toppings) {
                const topping = this.findTopping(toppingId);
                toppingsTotal += topping.price;
            }
        }

        // personal rule number 9 according to my ID
        let discount = 0;

        if (pizzas.length >= 3) {
            discount = pizzaBaseTotal * 0.05;
        }

        const totalPrice = pizzaBaseTotal + sizeTotal + toppingsTotal - discount;

        return {
            pizzaBaseTotal,
            sizeTotal,
            toppingsTotal,
            discount,
            totalPrice
        };
    }

    // from the request body validate the order and return an error message if invalid
    validateOrder(body) {
        const { customerName, phone, deliveryAddress, pizzas } = body;

        if (!customerName || !phone || !deliveryAddress) {
            return "Missing customer name, phone or delivery address";
        }

        if (!Array.isArray(pizzas) || pizzas.length === 0) {
            return "Order must include at least one pizza";
        }

        // Validate each pizza in the order
        for (const item of pizzas) {
            if (!this.findPizza(item.pizzaId)) {
                return "Invalid pizza id";
            }

            if (!this.findSize(item.sizeId)) {
                return "Invalid size id";
            }

            if (!Array.isArray(item.toppings)) {
                return "Toppings must be an array";
            }

            if (item.toppings.length > 3) {
                return "Each pizza can have up to 3 toppings";
            }

            for (const toppingId of item.toppings) {
                if (!this.findTopping(toppingId)) {
                    return "Invalid topping id";
                }
            }
        }

        return null;
    }

    createOrder(order) {
        this.orders.push(order);
        return order;
    }

    getNextOrderId() {
        return this.nextOrderId++;
    }

    getAllOrders() {
        return this.orders;
    }

    getOrderById(id) {
        return this.orders.find((order) => order.id === id);
    }

    getOrdersByStatus(status) {
        return this.orders.filter((order) => order.status === status);
    }

    getReadyDeliveryOrders() {
        return this.orders.filter(
            order =>
                order.status === "ready" &&
                order.delivery.type === "delivery"
        );
    }

    isValidStatusChange(currentStatus, newStatus) {
        const statuses = ["new", "preparing", "ready", "delivered"];

        const currentIndex = statuses.indexOf(currentStatus);
        const newIndex = statuses.indexOf(newStatus);

        return newIndex === currentIndex + 1;
    }
}

module.exports = new PizzaSystem();