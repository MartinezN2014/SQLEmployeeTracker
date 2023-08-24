use company_db

insert into department (name) 
values 
('Sales'),
('Engineering'), 
('Legal'), 
('Finance');

insert into role (title, salary, department_id)
values 
('Sales Lead', 10000, 1),
('Salesperson', 20000, 1),
('Lead Engineer', 30000, 2),
('Software Engineer', 40000, 2),
('Legal Team Lead', 50000, 3),
('Lawyer', 60000, 3),
('Accountant', 7000, 4);

insert into employee (first_name, last_name, role_id, manager_id)
values 
('Andre', 'Rowland', 1, null),
('Nelson','Martin', 3, null),
('Alex', 'Collazo', 4, 2),
('Pheonix', 'Wright', 6, null),
('Garry', 'Sanchez', 2, 1),
('Mason', 'Cruz', 2, 1);