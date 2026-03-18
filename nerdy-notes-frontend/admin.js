// admin.js

const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  alert("Access denied");
  window.location.href = "index.html";
}

const form = document.getElementById("uploadForm");
const uploadBtn = document.getElementById("uploadNote");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  uploadBtn.disabled = true;
  uploadBtn.innerText = "Uploading...";

  const token = localStorage.getItem("token");

  if (!token) {
  alert("You must login first");

  uploadBtn.disabled = false;
  uploadBtn.innerText = "Upload Note";

  return;
}

  const formData = new FormData();

  formData.append("title", document.getElementById("title").value);
  formData.append("subject", document.getElementById("subject").value);
  formData.append("year", document.getElementById("year").value);
  formData.append("module", document.getElementById("module").value);
  formData.append("type", document.getElementById("type").value);
  formData.append("pdf", document.getElementById("pdfFile").files[0]);

  try {
    const response = await fetch(
      "https://nerdy-notes-backend.onrender.com/api/notes/upload",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      },
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      alert(data.message || "Upload failed");

      uploadBtn.disabled = false;
      uploadBtn.innerText = "Upload Note";

      return;
    }

    alert("Notes uploaded successfully");

    form.reset();
    uploadBtn.disabled = false;
uploadBtn.innerText = "Upload Note";

  } catch (error) {
  console.error(error);
  alert("Server error");

  uploadBtn.disabled = false;
  uploadBtn.innerText = "Upload Note";
}
});

async function loadNotes() {
  const subjectFilter = document.getElementById("filterSubject").value;
  const yearFilter = document.getElementById("filterYear").value;

  const res = await fetch("https://nerdy-notes-backend.onrender.com/api/notes");

  let notes = await res.json();

  if (subjectFilter) {
    notes = notes.filter((n) => n.subject === subjectFilter);
  }

  if (yearFilter) {
    notes = notes.filter((n) => n.year == yearFilter);
  }

  const container = document.getElementById("notesList");

  container.innerHTML = "";

  // STEP 1: Group notes by module
  const grouped = {};

  notes.forEach((note) => {
    if (!grouped[note.module]) {
      grouped[note.module] = [];
    }
    grouped[note.module].push(note);
  });

  // STEP 2: Sort modules
  const sortedModules = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  // STEP 3: Render modules + notes
  sortedModules.forEach((moduleNumber) => {
    const moduleSection = document.createElement("div");
    moduleSection.classList.add("module-section");

    // Module heading
    const heading = document.createElement("h2");
    heading.innerText = `Module ${moduleNumber}`;
    moduleSection.appendChild(heading);

    // Notes inside module
    grouped[moduleNumber].forEach((note) => {
      const div = document.createElement("div");
      div.classList.add("admin-note");

      div.innerHTML = `
    <div class="note-info">
      <h3>${note.title}</h3>
      <p>${note.subject}</p>
      <p>Year ${note.year} • Module ${note.module}</p>
    </div>

    <div class="note-actions">
      <button class="preview-btn-a" onclick="previewNote('${note._id}')">
        Preview
      </button>

      <button class="delete-btn-a" onclick="deleteNote('${note._id}')">
        Delete
      </button>
    </div>
    `;

      moduleSection.appendChild(div);
    });

    container.appendChild(moduleSection);
  });
}

document.getElementById("filterSubject").addEventListener("change", loadNotes);
document.getElementById("filterYear").addEventListener("change", loadNotes);

loadNotes();

async function deleteNote(id) {
  const token = localStorage.getItem("token");

  if (!confirm("Delete this note?")) return;

  try {
    await fetch(`https://nerdy-notes-backend.onrender.com/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadNotes();
  } catch (error) {
    console.error(error);
  }
}

window.previewNote = function (noteId) {
  if (!noteId) {
    alert("Invalid note");
    return;
  }

  window.open(`/preview.html?id=${noteId}`, "_blank");
};