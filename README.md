# Pizza Ordering System - Ex2

## Student
Name: Eva Mahmood
ID: 214985509

## Repository Link:
https://github.com/evamah/pizza-ordering-system


## Running the Project
1. Install server dependencies:
Terminal 1:
cd server
npm install

2. Install client dependencies:
Terminal 2:
cd client
npm install

3. Run the server:
Terminal 1:
npm run dev

The server runs on:
http://localhost:3001


4. Run the client:
Terminal 2:
npm run dev

The client runs on:
http://localhost:5173


5. Testing the Server
Open:
http://localhost:3001/api/menu

If the server is running correctly, the menu JSON will be returned.


## Project Description
The project implements a simple pizza ordering system.

Client (React): 
The system has three types of users:
1. Customer
- view the menu
- choose pizzas
- choose sizes
- choose toppings
- choose quantity
- choose delivery or pickup
- perform mock payment
- create orders
- track order status

2. Employee
- view new and active orders
- update order status from new to preparing
- update order status from preparing to ready

3. Delivery Person
- view ready delivery orders
- view customer information
- update orders from ready to delivered

The client stores temporary user data using React useState hook and communicates with the server using the fetch() API.
The client displays an estimated price to the user, but the final price is calculated only by the server.

Server Side (Node.js + Express):
The server side is responsible for the business logic of the application, and it follows the MVC architecture:
Models - Contain the business entities.
Controllers - Contain the application logic.
Routes - Contain the REST API endpoints.

The server performs the following tasks:
- Creates and manages orders.
- Validates orders.
- Calculates the total price of the order.
- Applies the personal business rule.
- Handles order status transitions.
- Returns responses to the client.
- Stores all orders in memory.


## Project Files Description
## Server:
- package.json - Contains the server dependencies and npm scripts.
- server.js - Initializes the Express server, connects the routes, and starts the application.
Data:
- menu.js - Contains the menu data (pizzas, sizes, and toppings).
Models:
- Customer.js - Represents customer information.
- Pizza.js - Represents a selected pizza.
- Topping.js - Represents pizza toppings.
- Payment.js - Represents payment information.
- Delivery.js - Represents delivery information.
- Order.js - Represents an order and its details.
- Employee.js - Represents employee actions.
- DeliveryPerson.js - Represents delivery person actions.
- PizzaSystem.js - Contains the main business logic, validation, and price calculation.
Controllers:
- menuController.js - Handles menu requests.
- orderController.js - Handles order operations (creating orders, retrieving orders, and updating order statuses).
Routes:
- menuRoutes.js - Defines menu API endpoints.
- orderRoutes.js - Defines order API endpoints.

## Client
- package.json - Contains the client dependencies and npm scripts.
- App.jsx - Contains the main application logic and user interfaces.
- App.css - Contains the application styling.
- main.jsx - The entry point of the React application. 


## Price Calculation:
The total price is calculated only on the server that calculates the pizza prices, size prices, toppings prices discounts separately and then returns the total.
This prevents the client from modifying the final price before sending the order.


## Personal Rule
Rule number 9 was implemented:
If the order contains three or more pizzas, a 5% discount is applied to the base pizza price only.

The rule is implemented in server/models/PizzaSystem.js in calculatePrice().


## Order Statuses
The system supports the following statuses:
new -> preparing -> ready -> delivered

Illegal status transitions are rejected by the server.


## Changes from the Original Design
Only changes were made to simplify the system:
- function and variables names were changed to simplify the process.
- the MVC architecture was added.


## Questions
1. The client side is responsible for the user interface and sending requests to the server.
The server side is responsible for validation, business logic, price calculation, and order management.

2. The total price is calculated only on the server to prevent price manipulation by the client.

3. The server validates the order and returns an HTTP 400 error with an appropriate error message.

4. The server creates a new order, calculates the total price, stores the order in memory, and returns the order confirmation to the client.

5. If an order contains three or more pizzas, a 5% discount is applied to the base pizza price only.

6. The most challenging part of the project was designing the MVC structure and separating the responsibilities between the models, controllers, routes, and client components.

7. I decided to implement the project using the MVC architecture and separate model classes in order to improve readability, and code organization.
