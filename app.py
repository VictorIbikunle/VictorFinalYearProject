from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_pymongo import PyMongo
import cv2
import numpy as np
from keras.models import model_from_json
import threading
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Logs"
mongo = PyMongo(app)
socketio = SocketIO(app, cors_allowed_origins="*")
collecting_mode = False

json_file = open('model/emotion_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
emotion_model = model_from_json(loaded_model_json)
emotion_model.load_weights("model/emotion_model.h5")
print("Loaded model from disk")

emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

is_model_running = False
model_thread = None

capture_frames = False
video_writer = None

called_model_emotions = []

def emit_frame(frame):
    socketio.emit('frame', {'frame': frame})

def capture_frames_thread():
    global capture_frames, video_writer
    video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    while capture_frames:
        success, frame = video_capture.read()
        if success:
            process_frame(frame)
            ret, jpeg = cv2.imencode('.jpg', frame)
            frame_bytes = jpeg.tobytes()
            emit_frame(frame_bytes)

            if video_writer:
                video_writer.write(frame)

    video_capture.release()
    if video_writer:
        video_writer.release()
    socketio.emit("stop_stream")

def process_frame(frame):
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier('haarcascades/haarcascades_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

    emotions = []

    for (x, y, w, h) in faces:
        roi_gray_frame = gray_frame[y:y + h, x:x + w]
        cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0)

        emotion_prediction = emotion_model.predict(cropped_img)
        maxindex = int(np.argmax(emotion_prediction))
        emotions.append(emotion_dict[maxindex])

    log_collection = mongo.db.log
    for emotion in emotions:
        log_collection.insert_one({"emotion": emotion})

    
        
        called_model_emotions.append(emotion)

@app.route('/video_feed')
def video_feed():
    img_data = open("video_feed.jpg", "rb").read()
    response = make_response(img_data)
    response.headers['Content-Type'] = 'image/jpeg'
    return response

@app.route('/save_data', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        log_collection = mongo.db.log
        log_collection.insert_one(data)
        return jsonify({'message': 'General data added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/call_model', methods=['GET'])
def call_model():
    try:
        global capture_frames, video_writer, is_model_running, model_thread
        capture_frames = True

        if not is_model_running:
            model_thread = threading.Thread(target=capture_frames_thread)
            model_thread.start()
            is_model_running = True

        log_collection = mongo.db.log
        emotion_data = log_collection.find_one({}, {'_id': 0, 'emotion': 1})

        return jsonify({'message': 'Model calling started', 'emotionData': emotion_data})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/stop_model", methods=["GET"])
def stop_model():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "GET")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    elif request.method == "GET":
        global is_model_running, model_thread
        if is_model_running:
            print("Stopping the model thread")
            is_model_running = False
            model_thread.join()
            model_thread = None
            print("Model stopped successfully")
            return jsonify({"message": "Model stopped successfully"}), 200
        else:
            print("Model is not running")
            return jsonify({"message": "Model is not running"}), 400

@app.route('/start_recording', methods=['GET'])
def start_recording():
    global video_writer
    video_writer = cv2.VideoWriter('recorded_video.avi', cv2.VideoWriter_fourcc(*'XVID'), 10, (640, 480))
    return jsonify({'message': 'Recording started'})

@app.route('/stop_recording', methods=['GET'])
def stop_recording():
    global capture_frames, video_writer
    capture_frames = False
    if video_writer:
        video_writer.release()
        video_writer = None
    return jsonify({'message': 'Recording stopped'})

from flask import jsonify




@app.route('/collect_emotions', methods=['GET'])
def collect_emotions():
    global called_model_emotions, collecting_mode
    try:
        print("Collecting emotions from the model call...")
        emotionsList = ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"]
        log_collection = mongo.db.log

        # Get the count of each emotion
        result = log_collection.aggregate([
            {"$group": {"_id": "$emotion", "count": {"$sum": 1}}}
        ])

        # Print the count of each emotion
        print(list(result))

        # Filter out the count of each emotion in the list
        count_result = log_collection.aggregate([
            {"$group": {"_id": "$emotion", "count": {"$sum": 1}}}
        ])
        emotion_counts = {item["_id"]: item["count"] for item in count_result}

        # Create a list of dictionaries with emotion and count
        emotions_with_count = [{"emotion": emotion, "count": emotion_counts.get(emotion, 0)} for emotion in emotionsList]

        # Print the emotions with count
        print(emotions_with_count)

        global collecting_mode
        collecting_mode = True

        called_model_emotions = []  # Clear the stored emotions
        return jsonify({'message': 'Emotions collected successfully', 'emotionData': emotions_with_count})
    except Exception as e:
        return jsonify({'error': str(e)})





if __name__ == '__main__':
    socketio.run(app, debug=True)
