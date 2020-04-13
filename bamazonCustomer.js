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
            console.log("Id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + "|| Quantity: " + res[i].stock_quantity);
        }
        runSearch();
    })
}

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
                        console.log(`\x1b[32m%s\x1b[0m`, `\nSufficient quantity!`)
                        console.log(`\nYou chose ${answer.units} ${res[0].product_name}. Your total is: $ ${answer.units * res[0].price}\n`);
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

