import os
from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv # Used to load .env file
from google import genai
from google.genai import types

import base64


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'} 

# Load the environment variables from the .env file
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

# Create a Flask application instance
app = Flask(__name__)



# Sample data (usually this would come from a database)
api_data = {
    "status": "success",
    "message": "Welcome to the Flask API!",
    "version": "1.0"
}

# Define a route for the API endpoint
# By default, this accepts GET requests
@app.route('/api/status', methods=['GET'])
def get_status():
    """Returns the current API status as JSON."""
    # jsonify converts the Python dictionary into a JSON response
    # and sets the correct Content-Type header (application/json)
    return jsonify(api_data)

def allowed_file(filename):
    """Checks if a file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/foods', methods=['POST'])
def get_foods():
    """Returns the current API status as JSON."""
    """
    Handles image file uploads where the image is sent as a Base64 string
    in a JSON body.
    
    Expected JSON structure:
    {
        "image_data": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDvwjRIW0A... (Base64 string)",
        "file_extension": "png" 
    }
    """
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({'error': 'Missing JSON in request'}), 400

    data = request.json
    
    # Validate required fields
    base64_string = data.get('image_data')
    extension = data.get('file_extension', 'png') # Default to png if not provided

    if not base64_string:
        return jsonify({'error': 'Missing "image_data" field in JSON payload.'}), 400
    
    if not allowed_file(f'dummy.{extension}'):
        return jsonify({'error': f'File extension "{extension}" is not allowed.'}), 400


    # Get Gemini to process image
    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
        types.Part.from_bytes(
            data=base64_string,
            mime_type='image/jpeg',
        ),
        'Caption this image.'
        ]
    )

    print(response.text)

    return jsonify(api_data)



@app.route('/index.html')
def index_html():
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Image Analyzer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
        .card { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
    </style>
</head>
<body class="p-4 sm:p-8 flex items-center justify-center min-h-screen">
    <div class="card bg-white p-6 sm:p-10 rounded-xl max-w-2xl w-full">
        <h1 class="text-3xl font-bold text-indigo-700 mb-6 border-b pb-3">
            Gemini Food Image Analyzer
        </h1>
        <p class="text-gray-600 mb-6 text-sm">
            Upload an image of a food item. The client converts it to a Base64 string 
            and sends it via JSON <code>POST</code> to the Flask API for Gemini analysis.
        </p>

        <div class="space-y-6">
            <div>
                <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-2">
                    1. Select Food Image (JPG/PNG)
                </label>
                <input id="file-upload" type="file" accept="image/png, image/jpeg, image/gif"
                       class="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-green-50 file:text-green-700
                              hover:file:bg-green-100" />
            </div>

            <button id="analyze-button"
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-md
                           text-sm font-semibold text-white bg-indigo-600
                           hover:bg-indigo-700 focus:outline-none focus:ring-2
                           focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out
                           disabled:opacity-50 disabled:cursor-not-allowed"
                           disabled>
                2. Analyze Food with Gemini
            </button>
        </div>

        <div id="response-container" class="mt-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">Analysis Result</h2>
            <div id="loading-indicator" class="hidden text-center p-4 text-indigo-600 font-medium">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending image to Gemini... Please wait.
            </div>
            <div id="response-message" class="p-4 rounded-lg text-sm bg-gray-100 border border-gray-300 whitespace-pre-wrap">
                Upload an image and click "Analyze" to see the result here.
            </div>
        </div>
    </div>

    <!-- JavaScript for Base64 conversion and API call -->
    <script>
        const fileInput = document.getElementById('file-upload');
        const analyzeButton = document.getElementById('analyze-button');
        const responseDiv = document.getElementById('response-message');
        const loadingDiv = document.getElementById('loading-indicator');
        
        let base64String = null;
        let fileExtension = null;

        // Step 1: Convert selected file to Base64
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) {
                analyzeButton.disabled = true;
                return;
            }

            // Determine extension
            const parts = file.name.split('.');
            fileExtension = parts.length > 1 ? parts.pop().toLowerCase() : 'jpeg';

            const reader = new FileReader();
            reader.onloadstart = function() {
                 responseDiv.textContent = 'Reading file...';
            }
            reader.onloadend = function() {
                // The result includes the 'data:image/png;base64,' prefix 
                base64String = reader.result;
                analyzeButton.disabled = false;
                responseDiv.textContent = 'File successfully converted to Base64. Ready to analyze.';
            };
            reader.onerror = function() {
                base64String = null;
                analyzeButton.disabled = true;
                responseDiv.textContent = 'Error reading file.';
            };
            reader.readAsDataURL(file);
        });

        // Step 2: Send Base64 string in JSON to the API
        analyzeButton.addEventListener('click', async function() {
            if (!base64String) return;

            analyzeButton.disabled = true;
            loadingDiv.classList.remove('hidden');
            responseDiv.classList.remove('bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
            responseDiv.classList.add('bg-gray-100');
            responseDiv.textContent = '...'; 

            const payload = {
                image_data: base64String,
                file_extension: fileExtension
            };

            try {
                const response = await fetch('/api/foods', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                
                loadingDiv.classList.add('hidden');
                analyzeButton.disabled = false;

                if (response.ok && result.analysis_result) {
                    responseDiv.classList.remove('bg-gray-100');
                    responseDiv.classList.add('bg-green-100', 'text-green-800', 'border-green-400');
                    responseDiv.innerHTML = `<h3 class="font-bold mb-2">Gemini Analysis:</h3>${result.analysis_result}`;
                } else {
                    responseDiv.classList.remove('bg-gray-100');
                    responseDiv.classList.add('bg-red-100', 'text-red-800', 'border-red-400');
                    responseDiv.innerHTML = `<strong>Error:</strong> ${result.error || 'Unknown API error.'}`;
                }
            } catch (error) {
                loadingDiv.classList.add('hidden');
                analyzeButton.disabled = false;
                responseDiv.classList.remove('bg-gray-100');
                responseDiv.classList.add('bg-red-100', 'text-red-800', 'border-red-400');
                responseDiv.innerHTML = `<strong>Network Error:</strong> Could not connect to the Flask server.`;
            }
        });
    </script>
</body>
</html>
'''

# Run the application
# This block ensures the server only runs when the script is executed directly
if __name__ == '__main__':
    # debug=True allows for automatic reloading on code changes
    # and provides a debugger in the browser
    app.run(debug=True)