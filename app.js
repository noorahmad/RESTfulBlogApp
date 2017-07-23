const express         = require('express'),
      bodyParser      = require('body-parser'),
      methodOverride  = require('method-override'),
      mongoose        = require('mongoose'),
      expressSanitizer= require('express-sanitizer')
      app             = express()
//App Config
mongoose.connect('mongodb://noor:noor@ds119223.mlab.com:19223/restfulblogapp')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(expressSanitizer())

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
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('new')
    } else {
      res.redirect('/blogs')
    }
  })
})

//Show Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs')
    } else {
        res.render('show', {blog: foundBlog})
    }
  })
})

//Edit Route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.render('edit', {blog: foundBlog})
    }
  })
})

//Update Route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs/')
    } else {
      res.redirect('/blogs/' + req.params.id)
    }
  })
})

//Delete Route
app.delete('/blogs/:id', (req, res) => {
  //Destroy blog
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs')
    }
  })
  //redirect somewhere
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
