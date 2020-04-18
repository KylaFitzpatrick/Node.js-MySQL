var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
var config = require('./config');
var connection = mysql.createConnection(config.databaseOptions);

connection.connect(function (err) {
    if (err) throw err;
    productsForSale();

});
//prompt for selection
function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
          productsForSale();
          break;
  
        case "View Low Inventory":
          lowInventory();
          break;
          
        case "Add to Inventory":
          addInventory();
          break;
  
        case "Add New Product":
          addNewProduct();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }
  // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNewProduct(){
    inquirer
    .prompt([
        {
            name: "product",
            type: "input",
            message: "What is the product would you like to add to the store?"
        },
        {
            name: "units",
            type: "input",
            message: "How many units of the product you would like to add to inventory"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price per unit of this new product?"
        },
        {
            name: "department",
            type: "input",
            message: "What department is this product being added to?"
        }
    ])
    .then(function(answer) {
        // console.log(`product: ${answer.product}, department: ${answer.department}, 
        //     price: ${answer.price}, stock_quantity: ${answer.units}`)
            var statement = 
            "INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?) ";
               var sqlstmt= connection.query(statement, ["products","product_name", "department_name", "price", "stock_quantity",answer.product, 
                answer.department, 
                answer.price, 
                answer.units], (err, results) => {
                    if (err) {
                      return console.error(err.message);
                    }
                    // get inserted rows
                    // console.log('Row inserted:' + results.affectedRows);
                  });


                //   console.log(sqlstmt.sql)
                //   connection.end();
                runSearch();
                
            }
        );
        
    };

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory(){
    inquirer
    .prompt([
        {
            name: "id",
            type: "input",
            message: "What is the id of the product you would like to add to inventory?"
        },
        {
            name: "units",
            type: "input",
            message: "How many units of the product you would like to add to inventory"
        }
    ])
    .then(function(answer) {
        connection.query("SELECT item_id, product_name, stock_quantity, price FROM products WHERE ?",
            {item_id: answer.id}, function (err, res) {
                if (err) throw err;
                    console.log(`\nYou chose ${answer.units} unit(s) of ${res[0].product_name}.\n`);
                    var quantityAdded = answer.units;
                    // console.log(quantityAdded);
                    connection.query(`UPDATE products SET stock_quantity= stock_quantity + ${quantityAdded} WHERE item_id=${answer.id}`, function(err, results) {
                            if (err) throw err;

                        });
                // }
                runSearch();

            }
        );
    });
}


  // If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

  function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, res) {
        if (err) throw err;
      
            console.table(res);
          
        runSearch();
    })
}
  
  // If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

function productsForSale() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n")
        console.table(res)
        runSearch();
    })
}

