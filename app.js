const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');

// express app
const app = express();
// connect to mongodb
const dbURI = 'mongodb+srv://netninja:Hobbs913312@cluster0.v8trq.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser : true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err) => console.log(err));
// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });
//     blog.save()
//     .then((result) => {
//         res.send(result)
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// })

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//     .then((result) => {
//         res.send(result)
//     })
//     .catch((err) => {
//         console.log(err)
//     });
// });

// app.get('/single-blog', (req, res) => {
//     Blog.findById() 
//     .then((result) => {
//         res.send(result)
//     })
//     .catch((err) => {
//         console.log(err)
//     });  
// });


// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
    // res.sendFile('./views/index.html', { root: __dirname });
    
});

app.get('/about', (req, res) => {

    res.render('about', { title: 'About'});
    // res.sendFile('./views/about.html', { root: __dirname });

});

// blog routes

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result})
    })
    .catch((err)=> {
        console.log(err);
    });
});

app.post('/blogs', (req, res) => {
const blog = new Blog(req.body);

blog.save()
.then((result) => {
    res.redirect('/blogs')
})
.catch((err) => {
    console.log(err);
}) 
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
    .then((result) => {
        res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch((err) => {
        console.log(err);
    }); 
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch((err) => {
        console.log(err);
    }); 
})


app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a New Blog'});
});
// // redirects
// app.get('/about-us', (req, res) => {
//     res.redirect('/about');
// });



// 404 page
app.use((req, res) => {
    res.render('404', { title: '404'});
// res.status(404).sendFile('./views/404.html', { root: __dirname })
});