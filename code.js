let transitionScreen = document.querySelector(".transition-screen");
let transitionText = document.querySelector(".transition-text");
let newNoteBtn = document.querySelector(".new-note-btn");
let noteForm = document.querySelector(".note-form");
let noteTitleInput = document.querySelector(".note-title");
let noteDescriptionInput = document.querySelector(".note-description");
let addNoteBtn = document.querySelector(".add-note-btn");
let emptyNote = document.querySelector(".empty-note");
let noteSection = document.querySelector(".note-section");

transitionText.addEventListener("click", () => {
  transitionScreen.classList.add("hide");
});

newNoteBtn.addEventListener("click", () => {
  noteForm.classList.remove("hidden");
  emptyNote.classList.add("hidden");
  noteSection.classList.add("hidden");
});

addNoteBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let title = noteTitleInput.value;
  let description = noteDescriptionInput.value;

  let note = {
    id: Date.now(), // Generate a unique identifier for the note
    title: title,
    description: description,
    tasks: [],
  }; if (!note.title || !note.description) {
    alert('Both title and description are required to create a note.');
    return;
  }

  let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
  existingNotes.push(note);
  localStorage.setItem("notes", JSON.stringify(existingNotes));
  noteTitleInput.value = "";
  noteDescriptionInput.value = "";
  renderNoteDiv(note, note.id);
});

// Function to handle note div click event
function handleNoteClick(id) {
  let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
  let note = existingNotes.find((note) => note.id === id);

  if (!note) {
    return;
  }

  noteForm.classList.add("hidden");
  emptyNote.classList.add("hidden");
  noteSection.classList.remove("hidden");

  const tasksHTML = renderTasks(note.tasks);

  const noteHTML = `
      <h1>${note.title}</h1>
      <h3>${note.description}</h3>
      <div> 
        <button onclick="addTaskToNote(${note.id})" class="addtaskBtn">Add Task</button>
        <button onclick="deleteNote(${note.id})" class="deleteBtn">Delete Note</button>
      </div>
      <ul>${tasksHTML}</ul>
  `;

  noteSection.innerHTML = noteHTML;
}

// Function to render a note div
function renderNoteDiv(note, id) {
  const noteContainer = document.querySelector(".note-container");

  const noteHTML = `
    <div class="note" data-id="${id}" onclick="handleNoteClick(${id})">
      <p>${note.title}</p>
    </div>
  `;

  noteContainer.innerHTML += noteHTML;
}

// Function to render saved notes on page load
function renderSavedNotes() {
  const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];

  const noteContainer = document.querySelector(".note-container");
  noteContainer.innerHTML = "";

  existingNotes.forEach((note) => renderNoteDiv(note, note.id));

  if (existingNotes.length > 0) {
    // Render the first note
    handleNoteClick(existingNotes[0].id);
  } else {
    // Display the empty-note message
    noteForm.classList.add("hidden");
    emptyNote.classList.remove("hidden");
    noteSection.classList.add("hidden");
  }
}

// Function to add Tasks in the note section
function addTaskToNote(id) {
  const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
  const note = existingNotes.find((note) => note.id === id);

  if (!note) {
    return;
  }

  const task = prompt("Enter a task:");
  if (task) {
    note.tasks.push(task);
    localStorage.setItem("notes", JSON.stringify(existingNotes));

    // Update the rendered tasks immediately
    const tasksHTML = renderTasks(note.tasks);
    const tasksContainer = document.querySelector(".note-section ul");
    tasksContainer.innerHTML = tasksHTML;
  }
}

//
function renderTasks(tasks) {
  let tasksHTML = "";

  for (const taskId in tasks) {
    let task = tasks[taskId];

    // Skip if task is null or undefined
    if (!task) {
      continue;
    }

    tasksHTML += `
      <li class="task-list">
        <input type="checkbox" id="task-${taskId}"  />
        <p>${task}</p>
      </li>
    `;
  }

  return tasksHTML;
}

// Delete note function
function deleteNote(id) {
  let existingNotes = JSON.parse(localStorage.getItem("notes")) || [];

  // Find the index of the note with the specified ID
  let noteIndex = existingNotes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return;
  }

  // Remove the note from the array
  existingNotes.splice(noteIndex, 1);

  // Update the notes in the localStorage
  localStorage.setItem("notes", JSON.stringify(existingNotes));

  // Remove the note div from the sidebar
  let noteContainer = document.querySelector(".note-container");
  let noteDiv = noteContainer.querySelector(`.note[data-id="${id}"]`);
  noteDiv.remove();

  // Re-render the note container
  renderSavedNotes();
}

// Initialize App
renderSavedNotes(); 