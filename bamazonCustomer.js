var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
var config = require('./config');
var connection = mysql.createConnection(config.databaseOptions);


connection.connect(function (err) {
    if (err) throw err;
    productsForSale();

});
function productsForSale() {
    var query = "SELECT * FROM products";
    // product_name, department_name, price, stock_quantity
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n")
        console.table(res)
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
                        console.log(`\x1b[32m%s\x1b[0m`, `\nSuccess!`)
                        console.log(`\nYou chose ${answer.units} ${res[0].product_name}. Your total is: $ ${answer.units * res[0].price}\n`);
                        var quantityLeft = res[0].stock_quantity - answer.units;
                        // console.log(quantityLeft);
                        var productSale = answer.units * res[0].price;
                        // console.log(productSale);
                       
                        connection.query(`UPDATE products SET stock_quantity=${quantityLeft}, product_sale= product_sale + ${productSale} WHERE item_id=${answer.id}`, function(err, res) {
                            if (err) throw err;
             
                    });
                }
                    runSearch();

                }
            );
        });
}

