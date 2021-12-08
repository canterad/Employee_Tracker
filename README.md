# Employee Tracker

Employee Taker for UNH Boot Camp # 12 SQL assignment.<br>
This repository was created for the Homework Assignment dealing with SQL.<br><br>

Developer: Duane Cantera<br>
Date: Dec. 9, 2021<br>
Assignment: #12 - SQL - Employee Taker<br><br>

This application is used to manage a company's employee database.  It allows the user to view and
manage the departments, roles and employees.  The user can perform the following operations:
<br><br>
View All Departments, Roles or Employees.
<br>
View Employees By Manager or Department.
<br>
Add A Department, Role or Employee.
<br>
Update An Employee Role or Employee Manager.
<br>
Delete Departments, Roles or Employees.
<br>
View the Combined Salaries of all Employees for all Departments.
<br><br>

### Technologies Used:
Node.js, Inquirer and mysql2
<br><br>

#### Mysql2 Design Issue:
For all of my database commands I used Prepared Statements by using the execute() command.  I also used the Promise function on connections.
"db.promise.execute()"
<br><br>

#### Displaying Table Data:
I used console.table() commands to display of the table data for this application.
<br><br>

### User Interface Design

I first allow the user to select the Database operation (CRUD) that they want to perform or "Exit".
<br>
<img src="images/SelectCRUD.jpg" height="125">
<br><br>
Then the user can select what Table operation to perform for the Database operation or select "Cancel" to start over:
<br>
CREATE:
<img src="images/SelectCreate.jpg" height="100">
<br>
A Department - The user enters the Department Name and then all Departments are displayed.
<br>An Employee - The user enters the First Name, Last Name, Selects the Role and Manager, then all Employees are displayed.
<br>A Role - The user enters a Title and Salary and selects the Department, then all Roles are displayed.
<br><br>
READ:
<img src="images/SelectRead.jpg" height="175">
<br>
All Departments Displayed - Sorted By Name in Ascending Order.
<br>All Employees Displayed - Sorted By Last, First Name in Ascending Order.
<br>All Roles Displayed - Sorted By Title in Ascending Order.
<br>All Employees By Manager Are Displayed - Sorted by Manager Last, First Name followed by Employee First Last Name in Ascending order.
<br>All Employees By Department Are Displayed- Sorted By Department, followed by Employee Last, First Name in Ascending order.
<br>Combined Salaries of All Employees By Department Are Displayed - Sorted by Department Name in Ascending order.
<br><br>
UPDATE:
<img src="images/SelectUpdate.jpg" height="100">
<br>An Employee Role - Select Employee, Select Rule, then all Employees are displayed.
<br>An Employee Manager - Select Employee, Select Manager, then all Employees are displayed.
<br><br>
DELETE:
<img src="images/SelectDelete.jpg" height="100">
<br>A Department - Select Department, then all Departments are displayed.
<br>An Employee - Select Employee, then all Employees are displayed.
<br>A Role - Select Role, then all Roles are displayed.
<br><br>
EMPLOYEE MANAGERS:
<br>If an Employee does not have a Manager the user can select the "None" option when Managers are displayed for selection.
<br>When Mangers are displayed the Manager Column will contain the text "NONE" if an employee does not have a manager.
<br><br>

### CODE LAYOUT AND DESIGN:
<img src="images/WorkFlow.jpg" height="500">
<br><br>

### LINKS:

Git Hub Link To Code For Project:<br> 
https://github.com/canterad/Employee_Tracker.git
<br><br>
Links to walkthrough videos on Google Drive:<br>
https://drive.google.com/file/d/1YxsFJS4cytlRszdo8rk8r0Ywx-nOufEB/view?usp=sharing


