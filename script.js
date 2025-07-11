// File upload + display
document.getElementById('fileInput').addEventListener('change', function () {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  for (const file of this.files) {
    const li = document.createElement('li');
    li.textContent = file.name;
    fileList.appendChild(li);
  }
});

// Code runner
function runCode() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  try {
    const result = eval(code);
    output.textContent = result ?? '✅ No output';
  } catch (e) {
    output.textContent = '❌ Error: ' + e.message;
  }
}
