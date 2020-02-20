const fs = require('fs');
const _ = require('lodash');

function viewsubs(req,res){
    var stud_name = "someone";
    fs.readFile('./storagefiles/course_details.json', (e, data) => {
        var full_list = JSON.parse(data).courselist;
        var alloted_list = _.filter(full_list, (obj) => {
            return obj.enrolledstudents.includes(stud_name);
        });
        res.render('stud_view', { alloted_list: alloted_list });
    });
}

module.exports.viewsubs=viewsubs;