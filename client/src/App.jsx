import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/api";

function App() {
  // Initialize states
  const [menu, setMenu] = useState(null);

  const [selectedPizzaId, setSelectedPizzaId] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");

  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  const [trackId, setTrackId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);

  const [employeeOrders, setEmployeeOrders] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    // Fetch menu from the server
    const response = await fetch(`${API_URL}/menu`);
    const data = await response.json();
    setMenu(data);

    // Set default selections 
    setSelectedPizzaId(data.pizzas[0].id);
    setSelectedSizeId(data.sizes[0].id);
  }

  function handleToppingChange(toppingId) {
    // Check if the topping is already selected
    const exists = selectedToppings.includes(toppingId);

    if (exists) {
      // Remove the topping 
      const updatedToppings = selectedToppings.filter(
        (id) => id !== toppingId
      );
      setSelectedToppings(updatedToppings);
    } else {
      // Add the topping, max 3 toppings allowed
      if (selectedToppings.length >= 3) {
        setError("You can choose up to 3 toppings for each pizza");
        return;
      }

      const updatedToppings = [...selectedToppings, toppingId];
      setSelectedToppings(updatedToppings);
    }

    setError("");
  }

  function addToCart() {
    const amount = Number(quantity);

    if (amount < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    const newItems = [];

    for (let i = 0; i < amount; i++) {
      newItems.push({
        pizzaId: selectedPizzaId,
        sizeId: selectedSizeId,
        toppings: selectedToppings
      });
    }

    setCart([...cart, ...newItems]);
    setSelectedToppings([]);
    setQuantity(1);
    setError("");
  }

  function getPizzaName(id) {
    for (const pizza of menu.pizzas) {
      if (pizza.id === id) {
        return pizza.name;
      }
    }

    return "";
  }

  function getSizeName(id) {
    for (const size of menu.sizes) {
      if (size.id === id) {
        return size.name;
      }
    }

    return "";
  }

  function getToppingName(id) {
    for (const topping of menu.toppings) {
      if (topping.id === id) {
        return topping.name;
      }
    }

    return "";
  }

  function calculateEstimatedPrice() {
    if (!menu) return 0;

    let pizzaBaseTotal = 0;
    let sizeTotal = 0;
    let toppingsTotal = 0;

    for (const item of cart) {
      const pizza = menu.pizzas.find((p) => p.id === item.pizzaId);
      const size = menu.sizes.find((s) => s.id === item.sizeId);

      pizzaBaseTotal += pizza.price;
      sizeTotal += size.price;

      for (const toppingId of item.toppings) {
        const topping = menu.toppings.find((t) => t.id === toppingId);
        toppingsTotal += topping.price;
      }
    }

    // Personal rule number 9 according to my ID
    let discount = 0;
    if (cart.length >= 3) {
      discount = pizzaBaseTotal * 0.05;
    }

    return pizzaBaseTotal + sizeTotal + toppingsTotal - discount;
  }

  async function checkout() {
    setError("");

    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    const finalAddress =
      deliveryType === "pickup" ? "Pickup from store" : deliveryAddress;

    const order = {
      customerName,
      phone,
      deliveryAddress: finalAddress,
      deliveryType,
      pizzas: cart
    };

    // Send the order to the server
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    // Get the response from the server
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    // Clear the cart and show confirmation
    setConfirmation(data);
    setCart([]);
    setCustomerName("");
    setPhone("");
    setDeliveryAddress("");
  }

  async function trackOrder() {
    setError("");
    setTrackedOrder(null);

    // Fetch the order with trackId from the server
    const response = await fetch(`${API_URL}/orders/${trackId}`);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    setTrackedOrder(data);
  }

  async function loadEmployeeOrders() {
    // Fetch orders with status new and preparing from the server
    const newResponse = await fetch(`${API_URL}/orders?status=new`);
    const preparingResponse = await fetch(`${API_URL}/orders?status=preparing`);

    const newOrders = await newResponse.json();
    const preparingOrders = await preparingResponse.json();

    setEmployeeOrders([...newOrders, ...preparingOrders]);
  }

  async function loadDeliveryOrders() {
    // Fetch orders with status ready from the server
    const response = await fetch(`${API_URL}/orders?status=ready`);
    const data = await response.json();
    setDeliveryOrders(data);
  }

  async function updateStatus(orderId, status) {
    setError("");

    // Update the order status on the server
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    // Refresh the orders after the update
    loadEmployeeOrders();
    loadDeliveryOrders();
  }

  if (!menu) {
    return <h2>Loading...</h2>;
  }

  // Main application UI
  return (
    <div className="app">
      <h1>Pizza Ordering System</h1>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>Customer Screen</h2>

        <div data-testid="menu-list">
          <h3>Menu</h3>

          <label>Pizza:</label>
          <select
            value={selectedPizzaId}
            onChange={(e) => setSelectedPizzaId(e.target.value)}
          >
            {menu.pizzas.map((pizza) => (
              <option key={pizza.id} value={pizza.id}>
                {pizza.name} - {pizza.price}
              </option>
            ))}
          </select>

          <label>Size:</label>
          <select
            value={selectedSizeId}
            onChange={(e) => setSelectedSizeId(e.target.value)}
          >
            {menu.sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name} - {size.price}
              </option>
            ))}
          </select>

          <h4>Toppings</h4>
          {menu.toppings.map((topping) => (
            <label key={topping.id}>
              <input
                type="checkbox"
                checked={selectedToppings.includes(topping.id)}
                onChange={() => handleToppingChange(topping.id)}
              />
              {topping.name} - {topping.price}
            </label>
          ))}

          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button onClick={addToCart}>Add to Cart</button>
        </div>

        <div data-testid="cart">
          <h3>Cart</h3>

          {cart.length === 0 && <p>No pizzas in cart</p>}

          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>
                {getPizzaName(item.pizzaId)} | {getSizeName(item.sizeId)}
              </p>
              <p>
                Toppings:{" "}
                {item.toppings.length === 0
                  ? "No toppings"
                  : item.toppings.map(getToppingName).join(", ")}
              </p>
            </div>
          ))}
        </div>

        <div data-testid="order-summary-panel">
          <h3>Order Summary</h3>
          <p>Number of pizzas: {cart.length}</p>
          <p>Estimated price: {calculateEstimatedPrice()}</p>
          {cart.length >= 3 && <p>5% discount applied on pizza base price</p>}
        </div>

        <h3>Customer Details</h3>

        <input
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
        >
          <option value="delivery">Delivery</option>
          <option value="pickup">Pickup from store</option>
        </select>

        {deliveryType === "delivery" && (
          <input
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        )}

        <button data-testid="checkout-button" onClick={checkout}>
          Pay and Place Order
        </button>

        {confirmation && (
          <div data-testid="order-confirmation">
            <h3>Order Confirmed</h3>
            <p>Order ID: {confirmation.id}</p>
            <p>Status: {confirmation.status}</p>
            <p>Payment: {confirmation.paymentStatus}</p>
            <p>Total price from server: {confirmation.totalPrice}</p>
          </div>
        )}

        <h3>Track Order</h3>

        <input
          placeholder="Enter order id"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />

        <button onClick={trackOrder}>Track</button>

        {trackedOrder && (
          <div>
            <p>Order ID: {trackedOrder.id}</p>
            <p>Status: {trackedOrder.status}</p>
            <p>Payment: {trackedOrder.paymentStatus}</p>
          </div>
        )}
      </section>

      <section>
        <h2>Employee Screen</h2>

        <button onClick={loadEmployeeOrders}>Load Employee Orders</button>

        <div data-testid="employee-orders">
          {employeeOrders.length === 0 && <p>No active orders</p>}

          {employeeOrders.map((order) => (
            <div key={order.id} className="order-card">
              <p>Order ID: {order.id}</p>
              <p>Customer: {order.customerName}</p>
              <p>Phone: {order.phone}</p>
              <p>Address: {order.deliveryAddress}</p>
              <p>Price: {order.totalPrice}</p>
              <p>Status: {order.status}</p>

              {order.status === "new" && (
                <button onClick={() => updateStatus(order.id, "preparing")}>
                  Move to Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button onClick={() => updateStatus(order.id, "ready")}>
                  Move to Ready
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Delivery Person Screen</h2>

        <button onClick={loadDeliveryOrders}>Load Ready Orders</button>

        <div data-testid="delivery-orders">
          {deliveryOrders.length === 0 && <p>No ready delivery orders</p>}

          {deliveryOrders.map((order) => (
            <div key={order.id} className="order-card">
              <p>Order ID: {order.id}</p>
              <p>Customer: {order.customerName}</p>
              <p>Phone: {order.phone}</p>
              <p>Address: {order.deliveryAddress}</p>
              <p>Price: {order.totalPrice}</p>

              <button onClick={() => updateStatus(order.id, "delivered")}>
                Mark as Delivered
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;