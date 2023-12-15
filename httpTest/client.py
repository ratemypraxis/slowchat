 import requests
 import subprocess
 import time
 import imghdr
 import base64

 server_url = 'http://papernet.simsam.me/uploads'
 printer_name = 'thermal'  
 image_filename = 'captured_image.jpg'

#for the printer out
 max_width = 384  
 max_height = 500  

 while True:
     try:
         capture_command = f'fswebcam --no-banner -r 640x480 {image_filename}'
         subprocess.run(capture_command, shell=True)

         files = {'image': open(image_filename, 'rb')}
         response = requests.post(server_url, files=files)

         if response.status_code == 200:
             print('Image uploaded successfully')

             try:
               #from server
                 base64_data = response.text  
                 print('Received base64 data:', base64_data)

                 #decode attempt
                 while len(base64_data) % 4 != 0:
                     base64_data += '='

                 #decode attempt
                 image_data = base64.b64decode(base64_data)
                 print('Decoded image data:', image_data)

                 #more decode attempt
                 image_format = imghdr.what(None, h=image_data)
                 if image_format:
                     # The data appears to be in a recognized image format

                     #try to load
                     img = Image.open(io.BytesIO(image_data))

                     #fit 2 printer sheet
                     width, height = img.size
                     if width > max_width:
                         new_width = max_width
                         new_height = int((max_width / width) * height)
                         img = img.resize((new_width, new_height))

                     #convert 2 png
                     png_image = img.convert('RGB')

                     #save as png
                     png_image.save(image_filename, format='PNG')

                     #print
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
