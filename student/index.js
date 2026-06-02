const e1 = require("express");

const app = e1();
app.use(e1.json());

const students = [
  { name: "Maleina", emailid: "mn@aupp.com", pass: "abc", mobile: 12345678, role: "student" },
]

const assignments = [
  { id: 1, title: "API Implementation", due: "May 25, 2026" },
  { id: 2, title: "Microservice Implementation", due: "May 30, 2026" },
];

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url)
  next()
})

//  login
app.post("/studentlogin", (req, res) => {
  const { emailid, pass } = req.body
  const student = students.find(s => s.emailid === emailid && s.pass === pass)
  if (!student) return res.send({ message: 'Wrong credentials' })
  res.send({ message: "Login Successful" })
})

// view assignment
app.get("/viewassignment", (req, res) => {
  res.send({ assignments });
});

// profile update
app.put("/studentupdateprofile", (req, res) => {
  const { name, newName, newEmail } = req.body
  const student = students.find((s) => s.name === name)
  if (!student) return res.send({ message: "User not found" })
  student.name = newName
  student.emailid = newEmail
  res.send({ message: "Student profile updated!" })
})

app.listen(5004, () => {
  console.log("Running on port 5004");
});
