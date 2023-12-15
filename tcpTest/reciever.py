# receiver_pi.py
import socket
import subprocess
from io import BytesIO
from PIL import Image

# Configurations
server_ip = "0.0.0.0"
server_port = 80

# Create a socket to listen for incoming connections
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
    server_socket.bind((server_ip, server_port))
    server_socket.listen()

    print("Waiting for connections...")

    while True:
        conn, addr = server_socket.accept()
        with conn:
            print(f"Connected by {addr}")

            # Receive image data
            image_data = conn.recv(1024)
            while image_data:
                image_data += conn.recv(1024)

            print("Image received successfully")

            # Process the image
            image_stream = BytesIO(image_data)
            image = Image.open(image_stream)

            # Save the image to a file
            image_path = "received_image.jpg"
            image.save(image_path)

            print(f"Image saved to {image_path}")

            # Print the image using lp command
            print_command = f"lp {image_path}"
            try:
                subprocess.run(print_command, shell=True, check=True)
                print("Image printed successfully")
            except subprocess.CalledProcessError as e:
                print(f"Error printing image: {e}")
