import os
import io
import uuid
from dotenv import load_dotenv # Used to load .env file
from google import genai
from google.genai.errors import APIError
from supabase import create_client, Client
from PIL import Image


# --- Configuration ---

load_dotenv()
# Use environment variables for secure access
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Supabase Storage Details
BUCKET_NAME = "Images"  # Replace with your actual bucket name
FILE_FORMAT = "png"
FILE_CONTENT_TYPE = f"image/{FILE_FORMAT}"

# Gemini Image Generation Prompt
PROMPT = "A futuristic cyborg cat wearing a small jetpack, digital art, high detail"

def generate_image_with_gemini(prompt: str) -> bytes | None:
    """
    Generates an image using the Gemini API's Imagen model and returns it as a bytes object.
    """
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return None

    try:
        print(f"Generating image for prompt: '{prompt}'...")
        client = genai.Client(api_key=GEMINI_API_KEY)

        # Call the Image Generation API
        result = client.models.generate_images(
            model='imagen-3.0-generate-002',
            prompt=prompt,
            config=dict(
                number_of_images=1,
                output_mime_type=FILE_CONTENT_TYPE,  # Use the specified file type
                aspect_ratio="1:1"  # Example aspect ratio
            )
        )
        
        # The result object contains a list of generated images.
        if result.generated_images:
            image_data = result.generated_images[0].image.image_bytes
            print("Image generated successfully.")
            return image_data
        else:
            print("Image generation failed: No images returned.")
            return None

    except APIError as e:
        print(f"Gemini API Error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during image generation: {e}")
        return None

def upload_to_supabase(image_bytes: bytes, file_name: str) -> str | None:
    """
    Uploads a bytes object to the specified Supabase Storage bucket.
    Returns the public URL of the uploaded file on success.
    """

    try:
        print(f"Connecting to Supabase and uploading '{file_name}'...")
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("Uploading image")
        # Upload the file
        supabase.storage.from_(BUCKET_NAME).upload(
            file=image_bytes,
            path=file_name,
            file_options={"content-type": FILE_CONTENT_TYPE}
        )

        print("Done uploading")
                
        # Construct the public URL (assuming your bucket has public access, or you use `get_public_url`)
        
        return
    
    except Exception as e:
        print(f"An error occurred during Supabase upload: {e}")
        return None

def main():
    """
    Main function to orchestrate the generation and upload process.
    """
    # --- End Configuration ---

    if not all([GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
        print("🛑 Missing required environment variables. Please set GEMINI_API_KEY, SUPABASE_URL, and SUPABASE_KEY.")
        return

    # 1. Generate the image
    image_data = generate_image_with_gemini(PROMPT)
    
    if image_data is None:
        print("🛑 Process terminated: Image generation failed.")
        return

    # 2. Define a unique file name
    unique_filename = f"{uuid.uuid4()}.{FILE_FORMAT}"

    # 3. Upload the image to Supabase
    upload_to_supabase(image_data, unique_filename)

    

if __name__ == "__main__":
    main()