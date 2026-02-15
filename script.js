const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const tableWrapper = document.getElementById("tableWrapper");
const totalCount = document.getElementById("totalCount");
const editingIndex = document.getElementById("editingIndex");
const LOCAL_KEY = "students";

let students = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];

function render() {
  totalCount.textContent = students.length;
  if (students.length === 0) {
    tableWrapper.innerHTML = '<p class="empty">No students added yet.</p>';
    return;
  }

  tableWrapper.innerHTML = "";
  students.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.innerHTML = `
      <div class="student-info">
        <p><strong>${s.name}</strong></p>
        <p>ID: ${s.id}</p>
        <p>Email: ${s.email}</p>
        <p>Contact: ${s.contact}</p>
      </div>
      <div class="actions">
        <button class="edit" onclick="editStudent(${i})">Edit</button>
        <button class="delete" onclick="deleteStudent(${i})">Delete</button>
      </div>
    `;
    tableWrapper.appendChild(card);
  });
}

function save() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(students));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const id = idInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();

  if (!name || !id || !email || !contact) return alert("All fields required!");
  if (!/^[A-Za-z\s]+$/.test(name)) return alert("Name must contain letters only");
  if (!/^\d+$/.test(id)) return alert("ID must be numeric");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Invalid email");
  if (!/^\d{10,}$/.test(contact)) return alert("Contact ≥10 digits");

  const idx = parseInt(editingIndex.value, 10);
  if (idx >= 0) students[idx] = { name, id, email, contact };
  else students.push({ name, id, email, contact });

  save();
  render();
  form.reset();
  editingIndex.value = -1;
  document.getElementById("submitBtn").textContent = "Add Student";
});

function editStudent(i) {
  const s = students[i];
  nameInput.value = s.name;
  idInput.value = s.id;
  emailInput.value = s.email;
  contactInput.value = s.contact;
  editingIndex.value = i;
  document.getElementById("submitBtn").textContent = "Save Changes";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteStudent(i) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(i, 1);
    save();
    render();
  }
}

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  editingIndex.value = -1;
  document.getElementById("submitBtn").textContent = "Add Student";
});

document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (confirm("Clear all student records?")) {
    students = [];
    save();
    render();
  }
});

render();
