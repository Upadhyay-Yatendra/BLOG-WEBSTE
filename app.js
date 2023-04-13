//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var _ = require('lodash');
require('dotenv').config()
const homeStartingContent = "Hello and welcome to my blog! <br>My name is <strong> Yatendra Upadhyay</strong>, and I'm a college student and web developer with a passion for technology and programming.<br><br>This blog is my way of sharing my journey with you. <br>Whether you're a fellow student, a seasoned developer, or simply someone who's curious about the world of tech, I hope you'll find something here that inspires you or helps you in your own journey. <br>From tutorials and how-to guides to reflections on the latest trends and developments in the industry, my aim is to provide you with valuable insights and practical tips that you can use to further your own goals.<br><br>So, if you're ready to dive into the world of tech with me, let's get started! <br>Don't hesitate to reach out if you have any questions or just want to say hi. <br>I'd love to hear from you!";
const aboutContent = "<p>Hi there, I'm <strong> Yatendra Upadhyay</strong> - a college student and web developer with a passion for building beautiful, functional websites. I've always loved tinkering with computers, and now I'm studying computer science to turn my hobby into a career. When I'm not studying or coding, you can find me playing basketball or hanging out with my friends.</p><br><p>I started this blog as a way to share my experiences and insights with other students and developers who are just starting out. Here, you'll find everything from coding tutorials and tips to personal reflections and stories. Thanks for stopping by, and feel free to reach out if you have any questions or just want to say hi!</p>";
const contactContent = '<section class="contact"><p>Want to get in touch? Feel free to reach out via email or on social media:</p><ul><li><a href="mailto:yupadhyayyk@gmail.com"><i class="fa fa-envelope"></i> Email</a></li><li><a href="https://www.linkedin.com/in/yatendra-upadhyay-33b84a202/"><i class="fa fa-linkedin"></i> LinkedIn</a></li><li><a href="https://twitter.com/YATENDRAPANDIT6"><i class="fa fa-twitter"></i> Twitter</a></li><li><a href="https://www.instagram.com/upadhyay__yatendra/"><i class="fa fa-instagram"></i> Instagram</a></li></ul></section>';

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect(`mongodb+srv://yupadhyayyk:${process.env.PASSWORD}@cluster0.uzfrrrm.mongodb.net/BlogDB`)
  .then(() => console.log('Connected!'))
  .catch((error) => console.log("\n" + error))

const postsSchema = new mongoose.Schema({
  title: String,
  body: String
});
const Post = mongoose.model("Post", postsSchema);
// let posts = [];
app.get("/", (req, res) => {
  // res.send("<h1>HOME</h1>");
  Post.find()
    .then(FoundPosts => {

      res.render('home', {
        content: homeStartingContent,
        posts: FoundPosts
      });
    })
    .catch(err => console.log("\n" + err))
})

app.get("/about", (req, res) => {
  // res.send("<h1>HOME</h1>");
  res.render('about', {
    content: aboutContent
  });
})

app.get("/contact", (req, res) => {
  // res.send("<h1>HOME</h1>");
  res.render('contact');
})


app.get("/compose", (req, res) => {
  res.render('compose');

})


// using express routing parameters
app.get("/posts/:id", (req, res) => {
  // let flag = -1;
  // flag = Number(flag);
  var requestedPost =(req.params.id); // using lodash to match kebab case

  // console.log(requestedPost);
  const query = { _id: requestedPost }
  Post.find(query)
    .then(foundPosts => {
      if (foundPosts.length === 0) {
        res.send("<h1>NO SUCH EXISTS</h1>")
      }
      else {
        const foundPost = foundPosts[0];
        // console.log(foundPost.title + "\n" + foundPost.body);
        res.render('post', {
          heading: foundPost.title,
          body: foundPost.body
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.send("<h1>ERROR OCCURRED</h1>");
    });

  // console.log(post.ti);
  // if (post.title === requestedPost) {
  // console.log('MATCH FOUND');

  // flag = posts.indexOf(post);
  // console.log(posts[flag].title + posts[flag].body);
})

app.post("/compose", (req, res) => {
  // let text = req.body.postTitle;
  // console.log(text);

  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save()
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
  // console.log(posts);


})










app.listen(3000, function () {
  console.log("Server started on port 3000");
});
