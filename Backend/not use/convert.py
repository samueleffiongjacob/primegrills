import base64

# Open image in binary mode
with open("passport.jpg", "rb") as image_file:
    base64_string = base64.b64encode(image_file.read()).decode('utf-8')

print(base64_string)  # Copy this and use in Postman
