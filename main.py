import cv2

# Create a VideoCapture object for the default camera (0)
cap = cv2.VideoCapture(0)

# Define the codec and create a VideoWriter object to save the video
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output_video.avi', fourcc, 20.0, (640, 480))

# Initialize recording flag
recording = False

while cap.isOpened():
    ret, frame = cap.read()

    if not ret:
        break

    if recording:
        out.write(frame)
    
    cv2.imshow('Video', frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        break
    elif key == ord('r'):
        if not recording:
            # Start recording
            recording = True
            print("Recording started")
        else:
            # Stop recording
            recording = False
            print("Recording stopped")

# Release the video capture and writer
cap.release()
out.release()
cv2.destroyAllWindows()




        











