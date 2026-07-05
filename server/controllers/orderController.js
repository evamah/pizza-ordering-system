const pizzaSystem = require("../models/PizzaSystem");

const Customer = require("../models/Customer");
const Pizza = require("../models/Pizza");
const Payment = require("../models/Payment");
const Delivery = require("../models/Delivery");
const Order = require("../models/Order");

function createOrder(req, res) {
    const error = pizzaSystem.validateOrder(req.body);

    // code 400 if the order is invalid
    if (error) {
        return res.status(400).json({ error });
    }

    const { customerName, phone, deliveryAddress, deliveryType, pizzas } = req.body;

    const finalDeliveryType = deliveryType || "delivery";

    const finalAddress =
        finalDeliveryType === "pickup" ? "Pickup from store" : deliveryAddress;

    const customer = new Customer(customerName, phone, finalAddress);

    const pizzaObjects = pizzas.map(
        (item) => new Pizza(item.pizzaId, item.sizeId, item.toppings)
    );

    const priceDetails = pizzaSystem.calculatePrice(pizzaObjects);

    const payment = new Payment(priceDetails.totalPrice);
    const delivery = new Delivery(finalAddress, finalDeliveryType);

    const order = new Order(
        pizzaSystem.getNextOrderId(),
        customer,
        pizzaObjects,
        priceDetails,
        delivery,
        payment
    );

    pizzaSystem.createOrder(order);

    // code 201 if the order is created successfully
    res.status(201).json(order);
}

function getOrders(req, res) {
    const { status } = req.query;

    // code 200 if the orders are retrieved successfully
    if (status) {
        const orders = pizzaSystem.getOrdersByStatus(status);
        return res.status(200).json(orders);
    }
    res.status(200).json(pizzaSystem.getAllOrders());
}

function getOrderById(req, res) {
    const order = pizzaSystem.getOrderById(req.params.id);

    // code 404 if the order is not found
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
}

function updateOrderStatus(req, res) {
    const order = pizzaSystem.getOrderById(req.params.id);

    // code 404 if the order is not found
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    const { status } = req.body;

    // code 400 if the status is missing or invalid
    if (!status) {
        return res.status(400).json({ error: "Missing status" });
    }

    const validStatuses = ["new", "preparing", "ready", "delivered"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    // code 409 if the status change is invalid
    if (!pizzaSystem.isValidStatusChange(order.status, status)) {
        return res.status(409).json({
            error: `Invalid status change from ${order.status} to ${status}`
        });
    }

    order.updateStatus(status);

    if (status === "delivered" && order.delivery) {
        order.delivery.markDelivered();
    }

    res.status(200).json(order);
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
};