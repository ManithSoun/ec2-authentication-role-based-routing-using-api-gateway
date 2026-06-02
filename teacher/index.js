const e1 = require("express");

const app = e1();
app.use(e1.json());

const assignments = [
  { id: 1, title: "API Implementation", due: "May 25, 2026" },
  { id: 2, title: "Microservice Implementation", due: "May 30, 2026" },
];

const students = [
  { name: "Maleina", emailid: "mn@aupp.com", pass: "abc", mobile: 12345678, role: "student" },
  { name: "MrSmith", emailid: "smith@aupp.com", pass: "abc", mobile: 87654321, role: "teacher" },
]

//  add assignment
app.post("/addassignment", (req, res) => {
  const { title, due } = req.body;
  const newAssignment = { id: assignments.length + 1, title, due };

  if (!title || !due) return res.send({ message: "All fields are required" });

  assignments.push(newAssignment);
  res.send({ message: "Assignment created", assignment: newAssignment });
});

// search student
app.get("/searchstudent", (req, res) => {
  const { name } = req.query
  const student = students.find((s) => s.name === name)
  if (!student) return res.send({ message: "Student not found." })
  res.send({ student: { name: student.name, emailid: student.emailid } })
})

// remove assignment
app.delete("/removeassignment", (rep, res) => {
  const { id } = rep.body;
  const index = assignments.findIndex((a) => a.id === id);
  if (index === -1) return res.send({ message: "Assignment not found." });

  assignments.splice(index, 1);
  res.send({ message: "Assignment removed" });
});

app.listen(5001, () => {
  console.log("Running on port 5001");
});
