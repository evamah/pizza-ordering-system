class Order {
    constructor(id, customer, pizzas, priceDetails, delivery, payment) {
        this.id = String(id);

        this.customerName = customer.name;
        this.phone = customer.phone;
        this.deliveryAddress = customer.deliveryAddress;

        this.pizzas = pizzas;
        this.priceDetails = priceDetails;
        this.totalPrice = priceDetails.totalPrice;

        this.delivery = delivery;
        this.payment = payment;
        this.paymentStatus = payment.status;

        this.status = "new";
        this.createdAt = new Date().toISOString();
    }

    updateStatus(newStatus) {
        this.status = newStatus;
    }
}

module.exports = Order;