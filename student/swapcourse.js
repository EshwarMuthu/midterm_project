const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function swapcoursesGet(req, res) {
    // console.log(req.body);
    var stud_name = "someone";
    fs.readFile('./storagefiles/course_details.json', (e, data) => {
        var full_list = JSON.parse(data).courselist;
        var available_list = _.filter(full_list, (obj) => {
            return !obj.enrolledstudents.includes(stud_name);
        });
        res.render('stud_swap', { available_list: available_list });
    });
    var temp_write_obj = { tempcourseid: req.query.coursecode };
    fs.writeFile('./storagefiles/swaphelper.json', JSON.stringify(temp_write_obj, null, 4), () => { });
}
function swappedcoursesPost(req, res) {
    var promises = Promise.all([
        readFile('./storagefiles/course_details.json'),
        readFile('./storagefiles/student_details.json'),
        readFile('./storagefiles/swaphelper.json')
    ]);
    promises.then((data) => {
        var arr_obj = Array.from(data);
        var stud_name = "someone";
        var course_fullist = JSON.parse(arr_obj[0]).courselist;
        var stud_fullist = JSON.parse(arr_obj[1]).studentslist;
        var swap_for_course = JSON.parse(arr_obj[2]).tempcourseid;
        console.log("before swap", stud_fullist);
        _.forEach(course_fullist, (obj) => {
            if (obj.ccode == swap_for_course) {
                obj.enrolledstudents.splice(obj.enrolledstudents.indexOf(stud_name), 1);
            }
        });
        _.forEach(course_fullist, (obj) => {
            if (obj.ccode == req.body.coursecode) {
                if (!obj.enrolledstudents.includes(stud_name)) {
                    obj.enrolledstudents.push(stud_name);
                }
            }
        });
        _.forEach(stud_fullist, (obj) => {
            if (obj.name == stud_name) {
                obj.subs_courses.splice(obj.subs_courses.indexOf(swap_for_course), 1);
            }
        });
        _.forEach(stud_fullist, (obj) => {
            if (obj.name == stud_name) {
                obj.subs_courses.push(req.body.coursecode);
            }
        });
        console.log("after swap", stud_fullist);
        var temp_write_obj_course = { courselist: course_fullist };
        var temp_write_obj_stud = { studentslist: stud_fullist };
        var temp_write_obj_swap = { tempcourseid: "" };
        fs.writeFile('./storagefiles/course_details.json', JSON.stringify(temp_write_obj_course, null, 4), () => {
            fs.writeFile('./storagefiles/student_details.json', JSON.stringify(temp_write_obj_stud, null, 4), () => {
                fs.writeFile('./storagefiles/swaphelper.json', JSON.stringify(temp_write_obj_swap, null, 4), () => {
                    res.redirect('/stud/editcourse');
                });
            })
        });
    });
    // console.log(req.body);
}
module.exports.swapcoursesGet = swapcoursesGet;
module.exports.swappedcoursesPost = swappedcoursesPost;