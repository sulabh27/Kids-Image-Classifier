async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('camera').srcObject = stream;
}
setupCamera();

document.getElementById('capture').addEventListener('click', () => {
    const video = document.getElementById('camera');  //get video element
    const canvas = document.getElementById('myCanvas');  //get canvas element
    const context = canvas.getContext('2d');    // get 2d context from the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);    //use context to draw the video on the canvas

    classifyImage();
});

// Load Teachable Machine Model
const URL = "https://teachablemachine.withgoogle.com/models/pkX4EQg83/"; // Your model URL
let model;

async function loadModel() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    console.log("Model Loaded!");
}

// Function to classify the image from canvas
async function classifyImage() {
    const canvas = document.getElementById('myCanvas');
    const prediction = await model.predict(canvas);

    // Find the highest confidence prediction
    let highest = prediction.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);

    // Show result on the page
    document.getElementById('result').innerText = `${highest.className} (${(highest.probability * 100).toFixed(2)}%)`;
}

loadModel();