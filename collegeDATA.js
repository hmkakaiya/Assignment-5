const fs = require('fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
            if (err) {
                reject("unable to read students.json");
                return;
            }
            fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
                if (err) {
                    reject("unable to read courses.json");
                    return;
                }
                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("no results returned");
        }
    });
}

function getTAs() {
    return new Promise((resolve, reject) => {
        const tas = dataCollection.students.filter(student => student.TA);
        if (tas.length > 0) {
            resolve(tas);
        } else {
            reject("no results returned");
        }
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("no results returned");
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(student => student.studentNum == num);
        if (student) {
            resolve(student);
        } else {
            reject("no results returned");
        }
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        if (studentData.TA === undefined) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);
        resolve();
    });
}

function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId == id);
        if (course) {
            resolve(course);
        } else {
            reject("no results returned");
        }
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        let found = false;
        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == studentData.studentNum) {
                dataCollection.students[i] = studentData;
                found = true;
                break;
            }
        }
        if (found) {
            resolve();
        } else {
            reject("Student not found");
        }
    });
}

module.exports = { initialize, getAllStudents, getTAs, getCourses, getStudentByNum, addStudent, getCourseById, updateStudent };
