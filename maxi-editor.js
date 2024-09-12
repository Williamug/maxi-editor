// Function to execute the formatting command
function formatText(command) {
    document.execCommand(command, false, null);
}

// Insert a link by prompting the user for a URL
function insertLink() {
    let url = prompt("Enter the URL:", "https://");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

// Insert an image into the editor
function insertImage() {
    let imageUrl = prompt("Enter the image URL:", "https://");
    if (imageUrl) {
        document.execCommand('insertImage', false, imageUrl);
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