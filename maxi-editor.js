// Function to execute the formatting command
function formatText(command, value = null) {
    document.execCommand(command, false, null);
}

// Function to handle Heading change
function formatHeading() {
    const headingValue = document.getElementById('headingSelect').value;
    document.execCommand('formatBlock', false, headingValue);
}

// Function to handle Font Size change
function formatFontSize() {
    const fontSizeValue = document.getElementById('fontSizeSelect').value;
    document.execCommand('fontSize', false, fontSizeValue);
}

// Function to handle Font Name change
function formatFontName() {
    const fontNameValue = document.getElementById('fontNameSelect').value;
    document.execCommand('fontName', false, fontNameValue);
}

function insertLink() {
    let url = prompt("Enter the URL:", "https://");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}


function uploadImage() {
    let input = document.getElementById('imageUpload');
    let file = input.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        let img = document.createElement('img');
        img.src = e.target.result;
        document.getElementById('editor').appendChild(img);
    };

    reader.readAsDataURL(file);
}

function saveContent() {
    let editorContent = document.getElementById('editor').innerHTML;
    console.log(editorContent);  // Here you can send the content to the server using an AJAX request
}