class Payment {
    constructor(amount) {
        this.amount = amount;
        this.status = "paid";
        this.method = "cash";
    }
}

module.exports = Payment;