
let username = "";

function signIn() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter a username");
  document.getElementById("userLabel").textContent = username;
  document.getElementById("cloudUI").style.display = "block";
  loadFiles();
}

function upload() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Choose a file!");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("username", username);

  fetch("/upload", {
    method: "POST",
    body: formData
  }).then(() => loadFiles());
}

function loadFiles() {
  fetch("/list-files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
  .then(res => res.json())
  .then(files => {
    const list = document.getElementById("fileList");
    list.innerHTML = "";
    files.forEach(file => {
      const li = document.createElement("li");
      li.innerHTML = `${file} <a href="/download/${username}/${file}" download>⬇ Download</a>`;
      list.appendChild(li);
    });
  });
}
