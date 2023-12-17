import subprocess
import socket
import time
from io import BytesIO

# Configurations
receiver_ip = "10.23.11.42"  # Replace with the IP of the receiver Pi
receiver_port = 8080
capture_interval = 30  # seconds

while True:
    try:
        # Generate a unique filename based on the current timestamp
        timestamp = time.strftime("%Y%m%d%H%M%S")
        image_filename = f"image_{timestamp}.jpg"

        # Run libcamera-still command
        subprocess.run(["libcamera-still", "-o", image_filename])

        print(f"Image captured: {image_filename}")

        # Read the captured image
        with open(image_filename, "rb") as image_file:
            img_bytes = image_file.read()

        # Connect to receiver Pi and send image
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((receiver_ip, receiver_port))
            s.sendall(img_bytes)

        print(f"Image sent successfully")

    except Exception as e:
        print(f"Error: {e}")

    # Wait for the next capture interval
    time.sleep(capture_interval)
