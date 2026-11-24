import cv2
import os
import numpy as np

haar_file = 'haarcascade_frontalface_default.xml'

datasets = 'datasets'

# Lists
(images, labels, names, id) = ([], [], {}, 0)

# Load dataset
for subdir in os.listdir(datasets):

    names[id] = subdir
    subjectpath = os.path.join(datasets, subdir)

    for filename in os.listdir(subjectpath):

        path = subjectpath + '/' + filename

        label = id

        images.append(cv2.imread(path, 0))
        labels.append(int(label))

    id += 1

# Convert to numpy array
(images, labels) = [np.array(lis) for lis in [images, labels]]

# Create LBPH recognizer
model = cv2.face.LBPHFaceRecognizer_create()

# Train model
model.train(images, labels)

# Load face detector
face_cascade = cv2.CascadeClassifier(haar_file)

# Open webcam
webcam = cv2.VideoCapture(0)

while True:

    success, img = webcam.read()

    if not success:
        print("Camera not working")
        break

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:

        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 255, 0), 2)

        face = gray[y:y + h, x:x + w]

        face_resize = cv2.resize(face, (130, 100))

        # Predict face
        prediction = model.predict(face_resize)
        print(prediction)

        if prediction[1] < 90:

            cv2.putText(
                img,
                '%s - %.0f' % (names[prediction[0]], prediction[1]),
                (x-10, y-10),
                cv2.FONT_HERSHEY_PLAIN,
                2,
                (0, 255, 0)
            )

        else:

            cv2.putText(
                img,
                'Unknown',
                (x-10, y-10),
                cv2.FONT_HERSHEY_PLAIN,
                2,
                (0, 0, 255)
            )

    cv2.imshow('Face Recognition', img)

    key = cv2.waitKey(10)

    if key == 27:
        break

webcam.release()
cv2.destroyAllWindows()