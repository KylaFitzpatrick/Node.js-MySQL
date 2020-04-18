var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
var config = require('./config');
var connection = mysql.createConnection(config.databaseOptions);

connection.connect(function (err) {
    if (err) throw err;
    productSalesByDepartment();

});
//prompt for selection
function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Product Sales by Department":
          productSalesByDepartment();
          break;
  
        case "Create New Department":
          newDepartment();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }
//   When a supervisor selects Create New Department, it should allow the supervisor 
// to add a completely new department to the store.
function newDepartment(){
    inquirer
    .prompt([
        {
            name: "department",
            type: "input",
            message: "What is the department would you like to add to the store?"
        },
        {
            name: "over_head_costs",
            type: "input",
            message: "How much is the over head cost of the department you would like to add to the store?"
        }
    ])
    .then(function(answer) {
        // console.log(`department_name: ${answer.department}, over_head_costs: ${answer.over_head_costs}`)
            
            var statement = 
            "INSERT INTO ?? (??,??) VALUES (?,?) ";
               var sqlstmt= connection.query(statement, ["departments", "department_name", "over_head_costs",answer.department, 
                answer.over_head_costs], (err, results) => {
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


// When a supervisor selects View Product Sales by Department, the app should display a summarized 
// table in their terminal/bash window. Use the table below as a guide.
//   The total_profit column should be calculated on the fly using the difference 
// between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.
function productSalesByDepartment() {
    var query = 
    "SELECT department_id, departments.department_name, over_head_costs, SUM(products.product_sale) product_sales, SUM(over_head_costs - products.product_sale) total_profit FROM departments left join products on departments.department_name=products.department_name GROUP BY departments.department_id, departments.department_name, over_head_costs";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\n")
        console.table(res)
        runSearch();
    })
}



