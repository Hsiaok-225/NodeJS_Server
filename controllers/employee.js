const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const employeesController = {
  getAll: (req, res) => {
    res.json(data.employees);
  },
  create: (req, res) => {
    const newEmployee = {
      id: data.employees[data.employees.length - 1].id + 1 || 1,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
      return res
        .status(400)
        .json({ message: "First and last names are required." });
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
  },
  update: (req, res) => {
    // returns the first element
    const employee = data.employees.find(
      (emp) => emp.id === parseInt(req.body.id)
    );
    if (!employee)
      return res
        .status(400)
        .json({ message: `Employee ID ${req.body.id} not found ` });
    if (employee.firstname) employee.firstname = req.body.firstname;
    if (employee.lastname) employee.lastname = req.body.lastname;

    // update employee
    const newEmployees = data.employees.map((emp) => {
      if (emp.id !== employee.id) return emp;
      return {
        id: employee.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      };
    });
    data.setEmployees(newEmployees);
    res.status(201).json(data.employees);
  },
  delete: (req, res) => {
    const employee = data.employees.find(
      (emp) => emp.id === parseInt(req.body.id)
    );
    if (!employee)
      return res
        .status(400)
        .json({ message: `Employee ID ${req.body.id} not found ` });
    const newEmployees = data.employees.filter((emp) => emp.id !== req.body.id);
    data.setEmployees(newEmployees);
    res.status(201).json("delete success");
  },
  getId: (req, res) => {
    const employee = data.employees.filter((emp) => emp.id === 1);
    if (!employee)
      return res
        .status(400)
        .json({ message: `Employee ID ${req.body.id} not found ` });
    res.json(employee);
  },
};

module.exports = employeesController;
