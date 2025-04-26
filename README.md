# Code Share - Real-Time Collaborative Code Editor

A real-time collaborative code editor built with Next.js and Socket.IO. Multiple users can join a shared room, edit code together, and see updates in real time.

## 🚀 Features
- Real-time collaborative code editing
- Unique room creation and sharing
- View participants in the room
- Join and leave sessions
- Automatic code synchronization

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, CodeMirror, React Hot Toast
- **Backend:** Express, Socket.IO
- **WebSockets:** For real-time communication

## 📂 Project Structure
- **backend/**: Express server with Socket.IO for real-time events
- **frontend/**: Next.js client with CodeMirror for live code editing
- **components/Editor.jsx:** Main code editor component with WebSocket integration
- **utils/socket.js:** Socket.IO client setup

## ⚙️ Setup and Installation
### 1. Clone the Repository:
```bash
git clone https://github.com/yourusername/code-share.git
cd code-share
```

### 2. Install Dependencies:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Start the Backend:
```bash
cd backend
node index.js
```

### 4. Start the Frontend:
```bash
cd frontend
npm run dev
```

### 5. Open the App:
Visit `http://localhost:3000` in your browser.

## 💻 Usage
- Enter a room ID or create a new one.
- Share the room ID with collaborators.
- Start coding together in real time.

## 📝 Authors
- **Harshit rajak** - Full stack developer

## 📜 License
This project is licensed under the MIT License.

