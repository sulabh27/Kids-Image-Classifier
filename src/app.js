const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const predictionElement = document.getElementById('prediction');

let model;

// Load the Teachable Machine model
async function loadModel() {
    const URL = "https://teachablemachine.withgoogle.com/models/M4Zpl49V9/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    try {
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Failed to load the model", error);
        predictionElement.innerText = 'Failed to load the model.';
    }
}

// Set up the camera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        console.log("Camera is ready and streaming");
    } catch (error) {
        console.error('Error accessing the camera:', error);
        predictionElement.innerText = 'Error accessing the camera.';
    }
}

// Capture the image from the video stream and classify it
function captureAndClassify() {
    if (!model) {
        console.log("Attempted to classify without a loaded model.");
        predictionElement.innerText = 'Model not loaded, please wait...';
        return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    model.predict(canvas).then(predictions => {
        console.log(predictions);
        predictionElement.innerText = `Predicted: ${predictions[0].className} with ${Math.round(predictions[0].probability * 100)}% confidence.`;
    }).catch(err => {
        console.error('Error during prediction:', err);
        predictionElement.innerText = 'Error making a prediction.';
    });
}

document.getElementById('capture').addEventListener('click', () => {
    console.log("Capture button clicked");
    captureAndClassify();
});

// Initialize the app
async function initApp() {
    await loadModel();
    await setupCamera();
}

initApp();
