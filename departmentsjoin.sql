use bamazon;

select * from departments;

select * from products;

select department_id, departments.department_name, over_head_costs, SUM(products.product_sale) product_sales, SUM(products.product_sale - over_head_costs) total_profit
from departments left join products on departments.department_name=products.department_name GROUP BY departments.department_id,
 departments.department_name, over_head_costs


