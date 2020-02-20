const fs = require('fs');
const _ = require('lodash');
var message = "";
function facdashGet(req, res) {
    var fac_name = "Sathya";
    fs.readFile('./storagefiles/course_details.json', (e, data) => {
        var full_list = JSON.parse(data).courselist;
        var allotedlist = _.filter(full_list, (obj) => {
            return obj.handlingfac == fac_name;
        });
        res.render('fac_dash', { allotedlist: allotedlist, message: message });
        message="";
    });
}
function facdashPost(req, res) {
    message="";
    var fac_name = "Sathya";
    console.log(req.body);
    fs.readFile('./storagefiles/course_details.json', (e, data) => {
        var fullist = JSON.parse(data).courselist;
        var temp_obj = req.body;
        temp_obj.handlingfac = fac_name;
        temp_obj.enrolledstudents = [];
        temp_obj.maxstudentsno = 60;
        if (!_.find(fullist, { ccode: req.body.ccode })) {
            fullist.push(temp_obj);
            message = "";
        } else {
            message = req.body.ccode + "already exists";
        }
        var temp_write_obj = { courselist: fullist };
        fs.writeFile('./storagefiles/course_details.json', JSON.stringify(temp_write_obj, null, 4), () => {
            res.redirect('back');
        })
    });
}
module.exports.facdashGet = facdashGet;
module.exports.facdashPost = facdashPost;