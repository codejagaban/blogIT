// GLOBAL CONFIG
var expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

// MONGOOSE CONFIG
mongoose.connect("mongodb://localhost/blog-app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    dateCreated: {type: Date, default: Date.now}

});

var Blog = mongoose.model("blog", blogSchema);



app.get("/", function(req, res){
    res.redirect("/blogs")

});


// INDEX ROUTE

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);


        } else {
            res.render("index", {blogs : blogs})
        }
    })

});


// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new")
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // create a new blog post

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) {
            res.render("new")

        } else {
            res.redirect("/blogs")

        }
    });
});


// SHOW ROUTE

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs")

        } else {
            res.render("show", {blog : foundBlog});
        }
    })

});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: foundBlog});

        }
    });

});


// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if (err) {
            res.redirect("/blogs");

        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
});



// DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    });
});


// SERVER SETTINGS
app.listen(3000, function() {

    console.log("Server Started at port  3000");


});