class DeliveryPerson {
    markOrderDelivered(order) {
        order.updateStatus("delivered");

        if (order.delivery) {
            order.delivery.markDelivered();
        }
    }
}

module.exports = DeliveryPerson;