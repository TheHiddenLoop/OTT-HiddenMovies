# 🎬 OTT HiddenMovies

An advanced OTT (Over-the-Top) streaming platform built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. Users can watch and download movies in various resolutions and languages. Admins can upload and delete content through a secure dashboard.


---

## 🚀 Features

### 👤 User Side
- Browse and stream movies
- Download movies in 480p, 720p, 1080p
- Multi-language support for content

### 🔐 Admin Side
- Secure admin login
- Upload movie files via GridFS
- Add movie details (title, description, language, genre, etc.)
- Manage movie metadata and thumbnails

---

## 🛠️ Tech Stack

### Frontend
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer & GridFS for file uploads
- JWT for authentication

---

## 🧾 Folder Structure

```
OTT-STREAMING/
├── controllers/
│   ├── admin.js
│   └── movie.js
│
├── middleware/
│   ├── adminAuth.js
│   └── upload.js
│
├── model/
│   ├── admin.js
│   └── movie.js
│
├── public/
│   ├── admin-script.js
│   ├── admin.css
│   ├── admin.html
│   ├── authentication.html
│   ├── index.html
│   ├── movie-details.html
│   ├── moviedetails.css
│   ├── movieDetails.js
│   ├── script.js
│   ├── styles.css
│   ├── watchMovie.css
│   ├── watchMovie.html
│   └── watchMovie.js
│
├── routes/
│   ├── admin.js
│   └── movie.js
│
├── utils/
│   └── generateToken.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```


# 🧪 .env file Example

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ottstreaming
JWT_SECRET=your_admin_jwt_secret
```

---



## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/TheHiddenLoop/OTT-STREAMING.git
cd OTT-STREAMING

# Install dependencies
npm install

# Create .env file as described above

# Run the server
npm run dev

After running `npm run dev`, the server will be running at:
👉 http://localhost:3000
