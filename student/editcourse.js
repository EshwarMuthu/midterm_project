const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function editsubscoursesGet(req, res) {
    var stud_name = "someone";
    fs.readFile('./storagefiles/course_details.json', (e, data) => {
        var full_list = JSON.parse(data).courselist;
        full_list = _.filter(full_list, (obj) => {
            if (obj.enrolledstudents.includes(stud_name)) {
                return obj;
            }
        });
        // console.log(full_list);
        res.render('stud_edit', { alloted_list: full_list });
    })

}
function delsubscoursesGet(req, res) {
    console.log(req.query);
    var stud_name = "someone";
    // fs.readFile('./storagefiles/course_details.json',(e,data)=>{
    //     var full_list=JSON.parse(data).courselist;
    //     console.log("before deleting ",full_list);
    //     _.forEach(full_list,(obj)=>{
    //         if(obj.ccode==req.query.coursecode){
    //             obj.enrolledstudents.splice(obj.enrolledstudents.indexOf(stud_name),1);
    //         }
    //     });
    //     console.log("after deleting ",full_list);
    //     var temp_write_obj={courselist:full_list};
    //     fs.writeFile('./storagefiles/course_details.json',JSON.stringify(temp_write_obj,null,4),()=>{
    //         // res.redirect('back');
    //     });
    // })
    var promises = Promise.all([
        readFile('./storagefiles/course_details.json'),
        readFile('./storagefiles/student_details.json')
    ]);
    promises.then((data) => {
        var arr_obj = Array.from(data);
        var course_fullist = JSON.parse(arr_obj[0]).courselist;
        var stud_fullist = JSON.parse(arr_obj[arr_obj.length - 1]).studentslist;
        console.log("before del ",stud_fullist);
        _.forEach(course_fullist, (obj) => {
            if (obj.ccode == req.query.coursecode) {
                obj.enrolledstudents.splice(obj.enrolledstudents.indexOf(stud_name), 1);
            }
        });
        _.forEach(stud_fullist, (obj) => {
            if (obj.name == stud_name) {
                obj.subs_courses.splice(obj.subs_courses.indexOf(req.query.coursecode), 1);
            }
        });
        console.log("after del ",stud_fullist);
        var temp_write_obj_course = { courselist: course_fullist };
        var temp_write_obj_stud = { studentslist: stud_fullist };
        fs.writeFile('./storagefiles/course_details.json',JSON.stringify(temp_write_obj_course,null,4),()=>{
            fs.writeFile('./storagefiles/student_details.json',JSON.stringify(temp_write_obj_stud,null,4),()=>{
                res.redirect('back');
            })
        });
    });
}
module.exports.editsubscoursesGet = editsubscoursesGet;
module.exports.delsubscoursesGet = delsubscoursesGet;