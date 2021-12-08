///////////////////////////////////////////
// Packages needed for this application.
///////////////////////////////////////////
const inquirer = require('inquirer');
const mysql = require('mysql2');

////////////////////////////////////////////////////
// Variables Defined to be used by all functions:
////////////////////////////////////////////////////
let nDeptID = 0;
let szDeptName = "";
let nRoleID = 0;
let szRoleTitle = "";
let nRoleSalary = 0.0;
let szEmpFirstName = "";
let szEmpLastName = "";
let nManagerID = 0;
let nEmpID = 0;

////////////////////////////
// Connect to database
////////////////////////////
const db = mysql.createConnection
(
  {
    host: 'localhost',
    user: 'root',
    password: 'MySQLis#1',
    database: 'tracker_db'
  },
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Test if we have a connection error.  If have an error then tell the user they may need to use
// mysql source command on the schema and seeds sql files to fix this problem.  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
db.connect(function(err) 
{
  if (err) 
  {
    return console.error('error: ' + err.message + 
           "\r\n\r\nYou may need to use mysql 'source' command on the schema and seeds sql files to fix this problem.");
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Call function to start application so user can choose the database operation that they want to perform.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
ChooseOperation();


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ChooseOperation - This function will use the inquirer object to ask the user what type of
// (CRUD) operation that they want perform.  If the user select the "Exit" option then the process is stopped.
// Otherwise call the SelectTable function to select the database table to perform the operation on.
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function ChooseOperation()
{
  let szOperation = "";

  // Reset the variables:
  nDeptID = 0;
  szDeptName = "";
  nRoleID = 0;
  szRoleTitle = "";
  nRoleSalary = 0.0;
  szEmpFirstName = "";
  szEmpLastName = "";
  nManagerID = 0;
  nEmpID = 0;

  inquirer
  .prompt([
    {
      type: 'list',
      message: 'Select The Database Operation (CRUD) That You Want To Perform.  Select "Exit" To Stop The Selection Operation And Terminate Application.',
      name: 'operation_type',
      choices: ['Create', 
                'Read', 
                'Update',
                'Delete',
                'Exit'],
    },
  ])
  .then(function(data)  
  {
    szOperation = data.operation_type;

    // If the user selected the "Exit" option then tell the user and stop the process.
    if (data.operation_type == 'Exit')
    {
      console.log("Exit Option Selected.  Application Terminated.");
      process.exit(); 
      return;      
    }
    else
    {
      // Call function to select the database table to perform the operation on.
      SelectTable(szOperation);
    }
  })
  // Catch any errors - Tell the user that the Inquirer Prompt operation failed.
  .catch((error) => {
    console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");
    process.exit(); 
    return;          
  })        
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: SelectTable - This function will test the Operation string passed in. It will set the Message string
// and add the operation choices to the OperationChoices array based on the operation being performed.
// The inquirer object is used so the user can select the operation to be performed.  Based on the operation
// selected the appropriate function is called.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SelectTable(szOperation)
{
  let szMessage = "";
  let OperationChoices = [];
 
  if (szOperation == "Read")
  {
    szMessage = "Select The Type Of 'Read' Operation To Perform.  Select 'Cancel' To Select A Different Operation.";
    OperationChoices.push("All Departments", "All Employees", "All Roles", "All Employees By Manager",
                          "All Employee By Department", "Combined Salaries Of All Employees By Department",
                          "Cancel");
  }
  else if (szOperation == "Delete")
  {
    szMessage = "Select The Type Of 'Delete' Operation To Perform.  Select 'Cancel' To Select A Different Operation.";
    OperationChoices.push("A Department", "An Employee", "A Role", "Cancel");
  }
  else if (szOperation == "Update")
  {
    szMessage = "Select The Type Of 'Update' Operation To Perform.  Select 'Cancel' To Select A Different Operation.";
    OperationChoices.push("An Employee Role", "An Employee Manager", "Cancel");
  }
  else if (szOperation == "Create")
  {
    szMessage = "Select The Type Of 'Create' Operation To Perform.  Select 'Cancel' To Select A Different Operation.";
    OperationChoices.push("A Department", "An Employee", "A Role", "Cancel");
  }

  console.log("\r\n");

  // Use inquirer to display the operation choices for the user to select. 
  inquirer
  .prompt([
    {
      type: 'list',
      message: szMessage,
      name: 'table_type',
      choices: OperationChoices,
    },
  ])
  .then(function(data)  
  {
    // Perform the following operations if the "Cancel" item was selected.
    if (data.table_type == "Cancel")
    {
      // Tell user operation stopped.
      console.log("Cancel Operation Selected.  Operation Stopped.");

      // Call routine to choose another operation.
      ChooseOperation();      
    }
    else
    {
      // For the Read operation test the item selected and call the appropriate function.
      if (szOperation == "Read")
      {
        switch (data.table_type)
        {
          case "All Departments":
            ReadOperation(1, 0);
            break;
  
          case "All Employees":
            ReadOperation(2, 0);
            break;
              
          case "All Roles":
            ReadOperation(3, 0);
            break;            
  
          case "All Employees By Manager":
            ReadOperation(4, 0);
            break;          
  
          case "All Employee By Department":
            ReadOperation(5, 0);
            break;          
  
          case "Combined Salaries Of All Employees By Department":
            ReadOperation(6, 0);
            break;           
        }
      }
      // else for the Create operation test the item selected and call the appropriate function. 
      else if (szOperation == "Create")
      {
        switch (data.table_type)
        {
          case "A Department":
            EnterDeptInfo(1);
            break;
  
          case "A Role":
            EnterRoleInfo(2);
            break;
  
          case "An Employee":
            EnterEmpInfo(3);
            break;
        }
      }
      // else for the Update operation test the item selected and call the appropriate function.
      else if (szOperation == "Update")
      {
        switch (data.table_type)
        {
          case "An Employee Role":
            ChooseEmployee(10);
            break;
  
          case "An Employee Manager":
            ChooseEmployee(11);
            break; 
        }        
      }
      // else for the Delete operation test the item selected and call the appropriate function.
      else if (szOperation == "Delete")
      {
        switch (data.table_type)
        {
          case "A Department":
            ChooseDepartment(20);
            break;
        
          case "An Employee":
            ChooseEmployee(21);
            break;

          case "A Role":
            ChooseRole(22);
            break;              
        }        
      }
    }
  })
  // Catch any error caused by the Inquirer Prompt Operation.  Tell the user what caused the problem.
  .catch((error) => {
    console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

    // Call routine to choose another operation.
      ChooseOperation();          
  });      
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: CreateOperation - Based on the Operation number passed into this function a Title and Select strings
// are created.  When creating the Select string if the manager ID value is zero we replace it with a null value.
// The database operation is executed to insert a new record into the appropriate table.  After the insert operation
// is performed the ReadOperation function is called to display the new record that was added to the table to the
// user.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function CreateOperation(nOperation)
{
  let szSelect = "";
  let szTitle = "";
 
  // Create an Insert statement based on the nOperation value.
  switch (nOperation)
  {
    case 1: // Create A Department.
      szTitle = "\r\nDepartment Record Created Successfully.";
      szSelect = "INSERT INTO department(name) VALUES('" +  szDeptName + "');";
      break;

    case 2: // Create A Role.
      szTitle = "\r\nRole Record Created Successfully."
      szSelect = "INSERT INTO role(title, salary, department_id) VALUES('" + szRoleTitle + "', ";
      szSelect += nRoleSalary.toString() + ", " + nDeptID.toString() + ");";
      break;

    case 3: // Create An Employee
      szTitle = "\r\nEmployee Record Created Successfully."
      szSelect = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('" + szEmpFirstName + "', ";
      szSelect += "'" + szEmpLastName + "', " + nRoleID.toString() + ", ";
      
      // Only add the mangerID if we have the value.
      if (nManagerID > 0)
      {
        szSelect += nManagerID.toString() + ");";   
      }
      // Otherwise put in a null value.
      else
      {
        szSelect += "null);";           
      }   
      break;
  }  
  
  // Call the database execute routine to perform the insert operation.
  db.promise().execute (szSelect)
      .then ( ([rows, fields]) => {

        console.log(szTitle);

        if (nOperation == 1)
        {
          // Call read operation to display all department records.
          ReadOperation(1, 0);
        }
        else if (nOperation == 2)
        {
          // Call read operation to display all employee records.
          ReadOperation(3, 0);
        }
        else if (nOperation == 3)
        {
          // Call read operation to display all role records.
          ReadOperation(2, 0);
        }        
      })

      // Catch error, Tell user the insert operation failed.           
      .catch(function (error) 
      {
        console.log("\r\nThe Insert Operation Failed.  The Following Error Ocurred: " + error.message + "\r\n");
        
        // Call function to choose another operation.
        ChooseOperation();
      }); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: UpdateOperation - Based on the Operation number passed into this function a Title and Select strings
// are created.  The database operation is executed to update a record in the appropriate table.  After the update 
// operation is performed the ReadOperation function is called to display the record that was updated to the
// user.
//
// For the Manager ID - If the value is zero then replace it with a null value.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function UpdateOperation(nOperation)
{
  let szSelect = "";
  let szTitle = "";

  // Create an Update statement based on the nOperation value.
  switch (nOperation)
  {
    case 10: // Update an Employee Role.
      szTitle = "\r\n Employee Role Updated Successfully. \r\n";
      szSelect = "UPDATE employee SET role_id = " + nRoleID.toString() + " WHERE id = " + nEmpID.toString() + ";";
      break;
      
    case 11: // Update an Employee Manager.
      szTitle = "\r\n Employee Manager Updated Successfully. \r\n";  
      szSelect = "UPDATE employee SET manager_id = ";

      // Only add the mangerID if we have the value.
      if (nManagerID > 0)
      {
        szSelect += nManagerID.toString();   
      }
      // Otherwise put in a null value.
      else
      {
        szSelect += "null";           
      }   

      // Set the employee ID value in the select statement as part of the WHERE clause.
      szSelect += " WHERE id = " + nEmpID.toString() + ";";
      break;        
  }

  // Call the database execute routine to perform the Update operation.
  db.promise().execute (szSelect)
      .then ( ([rows, fields]) => {

        console.log(szTitle);

        // Display all of the employees.
        ReadOperation(2, 0);
      })

      // Catch error, Tell user the update operation failed.
      .catch(function (error) 
      {
        console.log("\r\nThe Update Operation Failed.  The Following Error Ocurred: " + error.message + "\r\n");
        
        // Call function to choose another operation.
        ChooseOperation();
      });   
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: DeleteOperation - Based on the Operation number passed into this function a Title and Select strings
// are created.  The database operation is executed to delete a record from the appropriate table.  After the delete 
// operation is performed the ReadOperation function is called to display all the records left in the table.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DeleteOperation(nOperation)
{
  let szSelect = "";
  let szTitle = "";

  // Create a Delete statement based on the nOperation value.
  switch (nOperation)
  {
    case 20: // Delete a Department.
      szTitle = "\r\n Department Record Deleted Successfully. \r\n";
      szSelect = "DELETE FROM department WHERE id = " + nDeptID.toString() + ";";
      break;  

      case 21: // Delete an Employee.
      szTitle = "\r\n Employee Record Deleted Successfully. \r\n";
      szSelect = "DELETE FROM employee WHERE id = " + nEmpID.toString() + ";";
      break;   
      
      case 22: // Delete a Role.
      szTitle = "\r\n Role Record Deleted Successfully \r\n";
      szSelect = "DELETE FROM role WHERE id = " + nRoleID.toString() + ";";
      break;        
  }

  // Call the database execute routine to perform the delete operation.
  db.promise().execute (szSelect)
      .then ( ([rows, fields]) => {

        console.log(szTitle);

        // Call read operation to display all department records.
        if (nOperation == 20)
        {
          ReadOperation(1, 0);
        }
        // Call read operation to display all employee records.
        else if (nOperation == 21)
        {
          ReadOperation(2, 0);
        }
        // Call read operation to display all role records.
        else if (nOperation == 22)
        {
          ReadOperation(3, 0);
        }        
      })

      // Catch error, Tell user the delete operation failed.           
      .catch(function (error) 
      {
        console.log("\r\nThe Delete Operation Failed.  The Following Error Ocurred: " + error.message + "\r\n");
        
        // Call function to choose another operation.
        ChooseOperation();
      });   
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ReadOperation - Create Select and Title strings based on the Operation number passed to this routine.
// The database execute command is performed to read the data from the database table.  The function ChooseOperation
// is called so the user can perform another database operation.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ReadOperation(nOperation)
{
  let szSelect = "";
  let szTitle = "";

  // Create the Select statement based on the nOperation value.
  switch (nOperation)
  {
    case 1: // All Departments Sorted By name in ascending order.
      szTitle = "\r\n ***  ALL DEPARTMENTS  ***\r\n";
      szSelect = "SELECT id AS ID, name AS Name FROM department ORDER BY name;";
      break;
    
    case 2: // All Employees Sorted By last name, first name in ascending order.
      szTitle = "\r\n                         **********          ALL EMPLOYEES          **********\r\n";
      szSelect = "SELECT e.id AS ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Tite, r.salary AS Salary, ";
      szSelect += "d.name AS Department, CASE WHEN e2.last_name IS NULL THEN 'NONE' ELSE CONCAT(e2.first_name, ' ', e2.last_name) END AS Manager ";
      szSelect += "FROM employee e LEFT JOIN employee e2 ON e.manager_id = e2.id LEFT JOIN role r ON  e.role_id = r.id ";
      szSelect += "LEFT JOIN department d ON r.department_id = d.id ORDER BY e.last_name, e.first_name;";
      break;

    case 3: // All Roles Sorted by title in ascending order.
      szTitle = "\r\n     **********          ALL ROLES          **********\r\n";      
      szSelect = "SELECT r.id AS ID, r.title AS Title, r.salary AS Salary, d.name AS Department FROM role r ";
      szSelect += "LEFT JOIN department d ON r.department_id = d.id ORDER BY r.title;";
      break;

    case 4: // All Employees By Manager Sorted by Manager Last, First name, then Employee Last, First Name ascending order.
      szTitle = "\r\n               **********          ALL EMPLOYEES BY MANAGER          **********\r\n";      
      szSelect = "SELECT TRIM(CONCAT(IFNULL(e2.first_name, ''), ' ',  IFNULL(e2.last_name, ''))) AS Manager, ";
      szSelect += "e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Title, r.salary AS Salary, ";
      szSelect += "d.name AS Department FROM employee e LEFT JOIN employee e2 ON e.manager_id = e2.id ";
      szSelect += "LEFT JOIN role r ON  e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id ";
      szSelect += "WHERE e.manager_id IS NOT NULL GROUP BY Manager, First_Name, Last_Name, Title, Salary, Department ";
      szSelect += "ORDER BY e2.last_name, e2.first_name, e.last_name, e.first_name;"      
      break;

    case 5: // All Employees By Department Sorted By Department name, employee last, first name in ascending order.
      szTitle = "\r\n                    **********          ALL EMPLOYEES BY DEPARTMENT          **********\r\n";        
      szSelect = "SELECT d.name AS Department, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Title, "; 
      szSelect += "r.salary AS Salary, CASE WHEN e2.last_name IS NULL THEN 'NONE' ELSE CONCAT(e2.first_name, ' ', e2.last_name) END AS Manager ";
      szSelect += "FROM employee e LEFT JOIN employee e2 ON e.manager_id = e2.id LEFT JOIN role r ON  e.role_id = r.id ";
      szSelect += "LEFT JOIN department d ON r.department_id = d.id GROUP BY Department, First_Name, Last_Name, Title, "
      szSelect += "Salary, Manager ORDER BY d.name, e.last_name, e.first_name;";       
      break;

    case 6: // Combined Saleries Of All Employees By Department Sorted by department name in ascending order.
      szTitle = "\r\n   ***   SALARY FOR EACH DEPARTMENT   ***\r\n";            
      szSelect = "SELECT d.name AS Department, SUM(r.salary) AS Department_Salary ";
      szSelect += "FROM employee e LEFT JOIN employee e2 ON e.manager_id = e2.id LEFT JOIN role r ON  e.role_id = r.id ";
      szSelect += "LEFT JOIN department d ON r.department_id = d.id GROUP BY Department ORDER BY d.name;";            
      break;
  }

  // Call the database execute command to read the data from the database table.
  db.promise().execute (szSelect)
      .then ( ([rows, fields]) => {

        console.log(szTitle);
        console.table(rows);
        console.log("\r\n");
        
        // Call function to choose another operation.
        ChooseOperation();
      })

      // Catch error, Tell user the read operation failed.           
      .catch(function (error) 
      {
        console.log("\r\nThe Read Operation Failed.  The Following Error Ocurred: " + error.message + "\r\n");
        
        // Call function to choose another operation.
        ChooseOperation();
      }); 
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ChooseEmployee - This function will get all of the employees from the database table and use the inquirer
// object so the user can select an employee.  The nOperation number value is used to determine what function needs
// to be called next in the process.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ChooseEmployee(nOperation)
{
  let Emps = [];
  let nIndex = 0;
  let nPos = -1;
  
  // Call the database execute command to get all of the employees from the database table.
  db.promise().execute ("SELECT id, CONCAT(first_name, ' ', last_name) AS EmpName FROM employee ORDER BY last_name, first_name;")
  .then ( ([rows, fields]) => 
  {
    // Add the employee names to the Emps array.
    for (nIndex = 0; nIndex < rows.length; ++nIndex)
    {
      Emps.push(rows[nIndex].EmpName);      
    }

    // Use the inquirer object so the user can select an employee.
    inquirer
    .prompt([
      {
        type: 'list',
        message: "Select An Employee",
        name: 'emp_type',
        choices: Emps,
      },
    ])
    .then(function(data)  
    {
      nPos = Emps.indexOf(data.emp_type);

      // Get and save the Employee ID value for the employee selected by the user.
      if (nPos != -1)
      {
        nEmpID = rows[nPos].id;
      }

      // nOperation value 10 = Update operation for an employee role. So choose role next.
      if (nOperation == 10)
      {
        ChooseRole(nOperation);
      }
      // nOperation value 11 = Update opeation for employee manager. So Choose manager next.
      else if (nOperation == 11)
      {
        ChooseManager(nOperation);
      }
      // nOperation = 21 = Delete operation for employee.  So call Delete Operation function next.
      else if (nOperation == 21)
      {
        DeleteOperation(nOperation);
      }
      // else - Doing a create operation.
      else
      {
        // Call routine to perform the create operation.
        CreateOperation(nOperation);
      }
    })
    
    // Catch Inquirer errors - Tell user what caused the problem.
    .catch((error) => {
      console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

      // Error occurred call routine to start over.
      ChooseOperation();      
    })    
  })

  // Catch error, MySQL query to get employees failed.           
  .catch(function (error) 
  {
    console.log("\r\nThe Read Operation For Choosing Employees Failed.  The Following Error Ocurred: " + error.message + "\r\n");
    
    // Error Occurred call routine to start over.
    ChooseOperation();
  }); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function ChooseRole - This function will get all of the Roles from the database table and use the Inquirer object
// so the user can select a role.  Tne nOperation number passed into this function is used to determine what function
// will be called next in this process.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ChooseRole(nOperation)
{
  let Roles = [];
  let nIndex = 0;
  let nPos = -1;
 
  // Call the database execute command to get all of the roles from the database table.
  db.promise().execute ("SELECT id, title FROM role ORDER BY title;")
  .then ( ([rows, fields]) => 
  {
    // Add the role titles to the Roles Array object.
    for (nIndex = 0; nIndex < rows.length; ++nIndex)
    {
      Roles.push(rows[nIndex].title);      
    }
  
    // Use the inquirer object to display the roles and let the user select one.
    inquirer
    .prompt([
      {
        type: 'list',
        message: "Select A Role",
        name: 'role_type',
        choices: Roles,
      },
    ])
    .then(function(data)  
    {
      nPos = Roles.indexOf(data.role_type);

      // Save the Role ID value for the role that was selected by the user.
      if (nPos != -1)
      {
        nRoleID = rows[nPos].id;
      }

      // If the nOperation value equal to 10 then call the function to perform
      // the update operation.
      if (nOperation == 10)
      {
        UpdateOperation(nOperation);
      }
      // If the nOperation value = 22 then doing delete role operation.
      // so call the Delete operation function next.
      else if (nOperation == 22)
      {
        DeleteOperation(nOperation);
      }
      // Otherwise call the function to perform the create operation.
      else
      {
        // Call routine to perform the create operation.
        CreateOperation(nOperation);
      }
    })
    
    // Catch any Inquirer errors and tell the user what caused this error.
    .catch((error) => {
      console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

      // Error occurred call routine to start over.
      ChooseOperation();      
    })    
  })

  // Catch error, MySQL query to get roles failed.           
  .catch(function (error) 
  {
    console.log("\r\nThe Read Operation For Choosing Roles Failed.  The Following Error Ocurred: " + error.message + "\r\n");
    
    // Error Occurred call routine to start over.
    ChooseOperation();
  }); 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ChooseDepartment - This function will get all of the Departments from the database table and use the 
// Inquirer object so the user can select a department.  Tne nOperation number passed into this function is used to 
// determine what function will be called next in this process. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ChooseDepartment(nOperation)
{
  let Depts = [];
  let nIndex = 0;
  let nPos = -1;
 
  // Call the database execute command to get all of the departments from the database table.
  db.promise().execute ("SELECT id, name FROM department ORDER BY name;")
  .then ( ([rows, fields]) => 
  {
    // Add all of the department names to the Depts Array object.
    for (nIndex = 0; nIndex < rows.length; ++nIndex)
    {
      Depts.push(rows[nIndex].name);      
    }

    // Use the inquirer object to display all of the departments and let the user select one.
    inquirer
    .prompt([
      {
        type: 'list',
        message: "Select A Department",
        name: 'dept_type',
        choices: Depts,
      },
    ])
    .then(function(data)  
    {
      nPos = Depts.indexOf(data.dept_type);

      // Save the department id for the department selected by the user.
      if (nPos != -1)
      {
        nDeptID = rows[nPos].id;
      }

      // If nOperation = 20 - Doing delete department operation so call
      // function to perform delete operation next.
      if (nOperation == 20)
      {
        DeleteOperation(nOperation);
      }
      // else - Call function to perform the create operation.
      else
      {
        // Call the function to perform the create operation.
        CreateOperation(nOperation);
      }
    })   
    // Catch any Inquirer errors and tell the user what caused the problem. 
    .catch((error) => {
      console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

      // Have an error so call routine to start over.
      ChooseOperation();      
    })        
  })

  // Catch error, Let user know read operation failed.           
  .catch(function (error) 
  {
    console.log("\r\nThe Read Operation For Choosing Departments Failed.  The Following Error Ocurred: " + error.message + "\r\n");
    
    // Have an error so call routine to start operation over.
    ChooseOperation();
  }); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ChooseManager: This function will get all of the Employees that are managers from the employee database 
// table and use the Inquirer object so the user can select a manager.  Tne nOperation number passed into this function 
// is used to determine what function will be called next in this process. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ChooseManager(nOperation)
{
  let Managers = [];
  let nIndex = 0;
  let nPos = -1;
  let szSelect = "";

  // Create select statement to get the id and manager names.
  szSelect = "SELECT id, CONCAT(first_name, ' ', last_name) AS Manager FROM employee WHERE manager_id ";
  szSelect += "IS NULL ORDER BY last_name, first_name;";

  // Call the database execute command to get all of the managers from the employee database table.
  db.promise().execute (szSelect)
  .then ( ([rows, fields]) => 
  {
    // Add the managers to the Managers Array object.
    for (nIndex = 0; nIndex < rows.length; ++nIndex)
    {
      Managers.push(rows[nIndex].Manager);      
    }

    // Add the addition option of "None" to the Managers Array object, so the user has the option of not
    // selecting a manager.
    Managers.push("None");

    // Use the inquirer object to display all of the managers and all the user to select one.
    inquirer
    .prompt([
      {
        type: 'list',
        message: "Select A Manager",
        name: 'manager_type',
        choices: Managers,
      },
    ])
    .then(function(data)  
    {
      // Set the Manager ID value based on the item selected by the user.
      if (data.manager_type == "None")
      {
        nManagerID = 0;
      }
      else
      {
        nPos = Managers.indexOf(data.manager_type);

        if (nPos != -1)
        {
          nManagerID = rows[nPos].id;
        }
      }

      // If the nOperation value = 11 then call the function to perform the update operation.
      if (nOperation == 11)
      {
        UpdateOperation(nOperation);
      }
      // Otherwise call the routine to Choose a Role.
      else
      {
        // Call the routine to choose the role.
        ChooseRole(nOperation);      
      }
    })    
    // Catch and Inquirer errors and tell the user what caused the problem.
    .catch((error) => {
      console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

      // Error occurred so call routine to start over.
      ChooseOperation();      
    })        
  })

  // Catch error, Tell the user that the database read operation to get the managers failed.           
  .catch(function (error) 
  {
    console.log("\r\nThe Read Operation For Choosing Managers Failed.  The Following Error Ocurred: " + error.message + "\r\n");
    
    // Error occurred so choose routine to start over.
    ChooseOperation();
  }); 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ValidateNumericInput - This function tests if the input string is a numeric value.  It returns
// true if the numeric values 0-9 or the decimal character "." has been entered, otherwise it returns a 
// message about what is wrong.
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateNumericInput(input)
{
  let szTemp = input.trim();

  if (szTemp.length === 0)
  {
    return "You must enter a value.";
  }

  let regex = /^[0-9.]+$/;
  if(szTemp.match(regex))
  {
      return true;
  }
  else
  {
    return "Please enter a numeric value.";
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ValidateInputEntered - This function test if the input string contains any characters.  If it does
// it returns true.  Otherwise it returns a message telling the user that they must enter a value.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateInputEntered(input)
{
  let szTemp = input.trim();

  if (szTemp.length === 0)
  {
    return "You must enter a value.";
  }
  else
  {
    return true;    
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: ValidateCharInput - This function validates if only characters have been entered.  It returns
// true if the characters a-z and A-Z have been entered, otherwise it returns a message about what is
// wrong.
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateCharInput(input)
{
  let szTemp = input.trim();

  if (szTemp.length === 0)
  {
    return "You must enter a value.";
  }

  let regex = /^[a-zA-Z]+$/;
  if(szTemp.match(regex))
  {
      return true;
  }
  else
  {
    return "Please enter letters only.";
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: EnterDeptInfo - This function uses the inquirer object to ask the user to enter the Department name.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function EnterDeptInfo(nOperation)
{
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: "Enter A Department: ",
      validate: ValidateInputEntered,
    },
  ])
  .then(function(data)  
  {
    // Set the department name variable.
    szDeptName = data.name;

    // Call the create operation to create a new department record.
    CreateOperation(nOperation);
  })    
  // Catch any Inquirer errors and tell the user what caused the problem.
  .catch((error) => {
    console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

    // Call the Choose Operation to start over.
    ChooseOperation();
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: EnterRoleInfo - This function will use the Inquirer object so the user can enter all of the role data.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function EnterRoleInfo(nOperation)
{
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'title',
      message: "Enter A Title: ",
      validate: ValidateInputEntered,
    },
    {
      type: 'input',
      name: 'salary',
      message: "Enter A Salary: ",
      validate: ValidateNumericInput, 
    },    
  ])
  .then(function(data)  
  {
    // Set the Role Title variable.
    szRoleTitle = data.title;

    // Set the Role Salary variable.
    nRoleSalary = data.salary;

    // Call the routine to choose the department.
    ChooseDepartment(nOperation);
  })    
  // Catch any Inquirer errors and tell the user what caused the problem.
  .catch((error) => {
    console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

    // Call the Choose Operation to start over.
    ChooseOperation();
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: EnterEmpInfo - This function will use the Inquirer object to all the user to enter employee data.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function EnterEmpInfo(nOperation)
{
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'firstname',
      message: "Enter Employee First Name: ",
      validate: ValidateCharInput,
    },
    {
      type: 'input',
      name: 'lastname',
      message: "Enter Employee Last Name: ",
      validate: ValidateCharInput,
    },    
  ])
  .then(function(data)  
  {
    // Set the Employee First Name variable.
    szEmpFirstName = data.firstname;

    // Set the Employee Last Name variable.
    szEmpLastName = data.lastname;

    // Call the Choose Manager function so user can select the manager.
    ChooseManager(nOperation);
  })    
  // Catch any Inquirer errors and tell the user what caused the problem.
  .catch((error) => {
    console.log("\r\nThe Inquirer Prompt Operation Failed.  The Following Error Occurred: " + error.message + "\r\n");

    // Call the Choose Operation to start over.
    ChooseOperation();
  });
}





