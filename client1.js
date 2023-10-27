import requests
import subprocess
import time

# Set the URL of your server
server_url = 'http://142.93.197.40/uploads'  # Replace with your actual server URL

while True:
    # Use the `fswebcam` command to capture an image from the USB webcam
    image_filename = 'captured_image.jpg'
    capture_command = f'fswebcam --no-banner -r 640x480 {image_filename}'
    subprocess.run(capture_command, shell=True)

    # Prepare the image file for upload
    files = {'image': open(image_filename, 'rb')}

    # Send the image to the server
    response = requests.post(server_url, files=files)

    if response.status_code == 200:
        print('Image uploaded successfully')
    else:
        print('Failed to upload image')

    # Sleep for 30 seconds before capturing the next image
    time.sleep(30)
