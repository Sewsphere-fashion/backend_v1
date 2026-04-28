import express from "express"
import { uploadImage } from "../config/cloudinary.config.js"

const app = express()
app.set('view engine', 'ejs')

// GET
app.get('/', (req, res) => {
  res.render('index', { fileUrl: null, error: null })
})

// POST
app.post('/upload', (req, res) => {
  uploadImage.single('photo')(req, res, function (err) {
    if (err) return res.render('index', { fileUrl: null, error: err.message })

    const fileUrl = req.file.path
    res.render('index', { fileUrl, error: null })
  })
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))