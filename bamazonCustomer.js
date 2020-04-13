var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Lucy!123",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    productsForSale();

});
function productsForSale() {
    var query = "SELECT * FROM products";
    // product_name, department_name, price, stock_quantity
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + "|| Quantity: " + res[i].stock_quantity);
        }
        runSearch();
    })
}

// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Find products by id",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Find products by id":
                    idSearch();
                    break;

                case "Find units of product":
                    unitsSearch();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function idSearch() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the id of the product you would like to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product you would like to buy?"
            }
        ])
        .then(function(answer) {
            connection.query("SELECT item_id, product_name, stock_quantity, price FROM products WHERE ?",
                {item_id: answer.id}, function (err, res) {
                    if (err) throw err;

                    if (answer.units > res[0].stock_quantity) {
                        console.log(`\x1b[31m%s\x1b[0m`, `\nInsufficient quantity!`)
                        console.log(`\nSorry, there is ${res[0].stock_quantity} left!\n`)
                    }
                    else {
                        console.log(`You chose ${answer.units} ${res[0].product_name}. Your total is: $ ${answer.units * res[0].price}`);
                        var quantityLeft = res[0].stock_quantity - answer.units;
                        console.log(quantityLeft);
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: quantityLeft
                                },
                                {
                                    item_id: answer.id
                                }
                            ],
                            function (error) {
                                if (error) throw err;

                            });
                    }
                    runSearch();

                }
            );
        });
}

