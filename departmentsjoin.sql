use bamazon;

select * from departments;

select * from products;

select department_id, departments.department_name, over_head_costs, product_sale,product_sale - over_head_costs profit
from departments left join products on departments.department_name=products.department_name