alert("Welcome to your grade tracker!");

// Load students from localStorage or start empty
let students = JSON.parse(localStorage.getItem("students")) || [];
let idCounter = students.length > 0
    ? Math.max(...students.map(s => s.id)) + 1
    : 1;

const nameInput = document.getElementById("studentName");
const gradeInput = document.getElementById("studentGrade");
const studentList = document.getElementById("studentList");
const averageDisplay = document.getElementById("average");
const error = document.getElementById("error");

// Add student button
document.getElementById("addStudent").addEventListener("click", addStudent);

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Add student
function addStudent() {
    const name = nameInput.value.trim();
    const grade = Number(gradeInput.value);

    // Validation
    if (name === "" || isNaN(grade) || grade < 0 || grade > 100) {
        error.textContent = "Please enter a valid name and a grade between 0 and 100.";
        return;
    }

    error.textContent = "";

    const student = {
        id: idCounter++,
        name,
        grade
    };

    students.push(student);
    saveToLocalStorage();
    updateUI();

    nameInput.value = "";
    gradeInput.value = "";
}

// Delete student
function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    saveToLocalStorage();
    updateUI();
}

// Calculate average
function calculateAverage() {
    if (students.length === 0) return 0;

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    return Math.round(total / students.length);
}

// Display students
function displayStudents() {
    studentList.innerHTML = "";
    const average = calculateAverage();

    students.forEach(student => {
        const row = document.createElement("tr");

        if (student.grade > average) {
            row.classList.add("above-average");
        }

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.grade}</td>
            <td>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;

        studentList.appendChild(row);
    });

    averageDisplay.textContent = average;
}

// Update UI instantly
function updateUI() {
    displayStudents();
}

// Load saved data on page refresh
updateUI();
