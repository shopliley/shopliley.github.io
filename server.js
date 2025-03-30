const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve Static Files
app.use(express.static(__dirname));  // Serves index.html, giveaway.html, etc.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

const entries = []; // Store entries temporarily

// Multer for handling file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    }
});

const upload = multer({ storage });

// Function to generate an Excel file
function generateExcelFile() {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Giveaway Entries");

    // Save the file
    XLSX.writeFile(workbook, "giveaway_entries.xlsx");
}

// Route to handle form submission
app.post("/submit-entry", upload.single("screenshot"), (req, res) => {
    const { username, answer } = req.body;

    if (!username || !answer || !req.file) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const entry = {
        username,
        answer,
        screenshot: `/uploads/${req.file.filename}`
    };

    entries.push(entry);
    generateExcelFile(); // Create the Excel file after each entry
    res.json({ success: true });
});

// Route to get all entries
app.get("/get-entries", (req, res) => {
    res.json(entries);
});

// Route to download the Excel file (Protected)
app.get("/download-excel", (req, res) => {
    const secretKey = req.query.key; // Secret key passed in URL

    if (secretKey !== "YOUR_SECRET_KEY") {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    const filePath = path.join(__dirname, "giveaway_entries.xlsx");
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: "Excel file not found" });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
