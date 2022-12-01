const Employee = require("../model/Employee");

const employeesController = {
  getAll: async (req, res) => {
    const employees = await Employee.find();
    if (!employees)
      return res.status(204).json({ message: "No employees found" });
    console.log(employees);
    res.json(employees);
  },
  create: async (req, res) => {
    const { firstname, lastname } = req.body;
    console.log("creat", firstname, lastname);
    if (!firstname || !lastname) {
      return res
        .status(400)
        .json({ message: "First and last names are required." });
    }
    const result = await Employee.create({
      firstname,
      lastname,
    });
    console.log(result);
    res.status(201).json({ message: `employee created!` });
  },
  update: async (req, res) => {
    const id = req.body.id;
    if (!id)
      return res.status(400).json({ message: "ID parameter is required" });
    const employee = await Employee.findOne({ _id: id }).exec();
    if (!employee)
      return res.status(400).json({ message: `Employee ID ${id} not found ` });
    if (employee.firstname) employee.firstname = req.body.firstname;
    if (employee.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    res.status(200).json(result);
  },
  delete: async (req, res) => {
    console.log(req.body);
    if (!req?.body?.id)
      return res.status(400).json({ message: "Employee ID require" });
    const employee = await Employee.findOne({ _id: req.body.id });
    if (!employee)
      return res
        .status(400)
        .json({ message: `Employee ID ${req.body.id} not found ` });
    // delete employee
    const result = await employee.deleteOne({ _id: req.body.id });
    res.status(200).json(result);
  },
  getId: async (req, res) => {
    if (!req?.params?.id)
      return res.status(400).json({ message: "Employee ID require" });
    const employee = await Employee.findOne({ _id: req.params.id });
    if (!employee)
      return res
        .status(400)
        .json({ message: `Employee ID ${req.params.id} not found ` });
    res.json(employee);
  },
};

module.exports = employeesController;
