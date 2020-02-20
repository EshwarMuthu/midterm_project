const fs = require('fs');
const _ = require('lodash');
function subscribenewcourseGet(req, res) {
    var stud_name = "someone";
    fs.readFile('./storagefiles/course_details.json', (e, data) => {
        var full_list = JSON.parse(data).courselist;
        var available_list = _.filter(full_list, (obj) => {
            return !obj.enrolledstudents.includes(stud_name);
        });
        var alloted_list = _.filter(full_list, (obj) => {
            return obj.enrolledstudents.includes(stud_name);
        });
        res.render('stud_new', { available_list: available_list, alloted_list: alloted_list });
    });
}
function subscribenewcoursePost(req, res) {

    var course_promise = new Promise((resolve, reject) => {
        fs.readFile('./storagefiles/course_details.json', (e, data) => resolve(data));
    });
    course_promise.then((data) => {
        var stud_name = "someone";
        var full_list = JSON.parse(data).courselist;
        _.forEach(full_list, (obj) => {
            if (req.body.coursecode == obj.ccode) {
                if (!obj.enrolledstudents.includes(stud_name)) {
                    obj.enrolledstudents.push(stud_name);
                    updatestudentdetails(obj.ccode,stud_name);
                }
            }
        });
        var temp_write_obj = { courselist: full_list };
        fs.writeFile('./storagefiles/course_details.json', JSON.stringify(temp_write_obj, null, 4), (error) => {
            res.redirect('back');
        });
    });
    

}

function updatestudentdetails(coursecode,stud_name){
    var stud_promise=new Promise((resolve,reject)=>{
        fs.readFile('./storagefiles/student_details.json',(e,data)=>{resolve(data)});
    });
    stud_promise.then((data)=>{
        var full_list = JSON.parse(data).studentslist;
        _.forEach(full_list,(obj)=>{
            if(obj.name==stud_name){
                obj.subs_courses.push(coursecode);
            }
        });
        var temp_write_obj = { studentslist: full_list };
        fs.writeFile('./storagefiles/student_details.json', JSON.stringify(temp_write_obj, null, 4), (error) => {
        });
    });
}

module.exports.subscribenewcourseGet = subscribenewcourseGet;
module.exports.subscribenewcoursePost = subscribenewcoursePost;