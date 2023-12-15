# sender.py / use w normal webcam
import time
import socket
import cv2
from io import BytesIO

# Configurations
image_filename = "captured_image.jpg"  # Specify the desired file path
receiver_ip = "receiver_pi_ip"  # Replace with the IP of the receiver Pi
receiver_port = 80

while True:
    try:
        # Capture image from the built-in webcam
        cap = cv2.VideoCapture(0)
        ret, frame = cap.read()
        cap.release()

        # Save the captured image to a file
        cv2.imwrite(image_filename, frame)

        # Convert image to JPEG format
        _, img_encoded = cv2.imencode('.jpg', frame)
        img_bytes = img_encoded.tobytes()

        # Connect to receiver Pi and send image
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((receiver_ip, receiver_port))
            s.sendall(img_bytes)

        print(f"Image saved to {image_filename} and sent successfully")

    except Exception as e:
        print(f"Error: {e}")

    time.sleep(30)
