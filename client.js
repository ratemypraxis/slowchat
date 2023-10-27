 import requests
 import subprocess
 import time
 import imghdr
 import base64

 server_url = 'http://papernet.simsam.me/uploads'
 printer_name = 'thermal'  # Replace with the actual printer name
 image_filename = 'captured_image.jpg'

 max_width = 384  # Adjust to your printer's paper width
 max_height = 500  # Adjust as needed

 while True:
     try:
         capture_command = f'fswebcam --no-banner -r 640x480 {image_filename}'
         subprocess.run(capture_command, shell=True)

         files = {'image': open(image_filename, 'rb')}
         response = requests.post(server_url, files=files)

         if response.status_code == 200:
             print('Image uploaded successfully')

             try:
                 # Receive the image from the server
                 base64_data = response.text  # Assuming the server sends base64-encoded data as text
                 print('Received base64 data:', base64_data)

                 # Ensure that the base64 data is correctly padded with '=' characters
                 while len(base64_data) % 4 != 0:
                     base64_data += '='

                 # Decode base64 data to obtain binary image data
                 image_data = base64.b64decode(base64_data)
                 print('Decoded image data:', image_data)

                 # Check if the data is in a valid image format
                 image_format = imghdr.what(None, h=image_data)
                 if image_format:
                     # The data appears to be in a recognized image format

                     # Load the image with Pillow
                     img = Image.open(io.BytesIO(image_data))

                     # Resize the image to fit the printer page
                     width, height = img.size
                     if width > max_width:
                         new_width = max_width
                         new_height = int((max_width / width) * height)
                         img = img.resize((new_width, new_height))

                     # Convert the resized image to PNG format
                     png_image = img.convert('RGB')

                     # Save the PNG image to a file
                     png_image.save(image_filename, format='PNG')

                     # Use the lp command to print the PNG image
                     print_command = f'lp -d {printer_name} -o fit-to-page {image_filename}'
                     subprocess.run(print_command, shell=True)
                 else:
                     print('Received data is not a recognized image format.')
             except Exception as e:
                 print(f'Error processing image: {e}')
         else:
             print('Failed to upload image')

     except Exception as e:
         print(f'An error occurred: {e}')

     time.sleep(30)
