/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Henisha Kakaiya  Student ID: 136840238 Date: 26/07/2024
*
* Github link: 
*
********************************************************************************/

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const collegeData = require('./collegeDATA.js');

const app = express();
const PORT = process.env.PORT || 8080;

// Register Handlebars helpers
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        navLink: function(url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

// Set Handlebars as the template engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

// Middleware to handle the static files
app.use(express.static('public'));

// Middleware to parse URL-encoded bodies (from form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to set the active route
app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo', { title: 'HTML Demo' });
});

app.get('/students/add', (req, res) => {
    res.render('addStudent', { title: 'Add Student' });
});

// Data-related routes
app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.render('courses', { courses: courses });
        })
        .catch((err) => {
            res.render('courses', { message: "no results" });
        });
});

app.get('/students', (req, res) => {
    collegeData.getAllStudents()
        .then((students) => {
            res.render('students', { students: students });
        })
        .catch((err) => {
            res.render('students', { message: "No students found" });
        });
});

app.get('/course/:id', (req, res) => {
    const id = req.params.id;
    collegeData.getCourseById(id)
        .then((course) => {
            res.render('course', { course: course });
        })
        .catch((err) => {
            res.render('course', { message: "No results" });
        });
});

app.get('/student/:studentNum', (req, res) => {
    collegeData.getStudentByNum(req.params.studentNum)
        .then((student) => {
            // Fetch the courses to populate the select dropdown
            collegeData.getCourses()
                .then((courses) => {
                    res.render('student', { student: student, courses: courses });
                });
        })
        .catch((err) => {
            res.render('student', { message: "no results" });
        });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
      .then(() => {
        res.redirect("/students");
      })
      .catch((error) => {
        console.error("Update Error:", error);
        res.status(500).send("Unable to update student");
      });
  });


// Start the server
collegeData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Unable to start server: ${err}`);
    });
