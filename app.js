const express    = require('express'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      app        = express()
//App Config
mongoose.connect('mongodb://noor:noor@ds119223.mlab.com:19223/restfulblogapp')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

//Mongoose Model Config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
})

var Blog = mongoose.model('Blog', blogSchema)

//RESTful Routes

app.get('/', (req, res) => {
  res.redirect('/blogs')
})
//Index Route
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('ERROR')
    } else {
      res.render('index', {blogs: blogs})
    }
  })
})

//NEW Route
app.get('/blogs/new', (req, res) => {
  res.render('new')
})

//CREATE Route
app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('new')
    } else {
      res.redirect('/blogs')
    }
  })
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
