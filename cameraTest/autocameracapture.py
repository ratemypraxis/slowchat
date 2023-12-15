import os
import time
import picamera

# Directory to save the captures
save_directory = "./captures"

# Create the directory if it doesn't exist
os.makedirs(save_directory, exist_ok=True)

# Initialize the PiCamera
camera = picamera.PiCamera()

try:
    while True:
        # Get the current date and time
        current_datetime = time.strftime("%Y%m%d-%H%M%S")

        # Define the file name with the current date and time
        file_name = f"{current_datetime}.jpg"

        # Capture an image and save it to the specified directory
        camera.capture(os.path.join(save_directory, file_name))

        print(f"Image captured: {file_name}")

        # Wait for 30 seconds before capturing the next image
        time.sleep(30)

except KeyboardInterrupt:
    # Handle keyboard interrupt (Ctrl+C) to gracefully exit the script
    print("\nScript interrupted. Exiting...")
finally:
    # Release the camera resources
    camera.close()
