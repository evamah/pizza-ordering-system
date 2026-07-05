class Delivery {
    constructor(address, type) {
        this.address = address;
        this.type = type; // delivery or pickup
        this.status = "pending";
    }

    markDelivered() {
        this.status = "delivered";
    }
}

module.exports = Delivery;