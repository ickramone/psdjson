$.appEncoding = "UTF-8";
// $.evalFile(lib/json2.js);
#include "lib/json2.js"

var contact = new Object();
contact.firstname = "Jesper";
contact.surname = "Aaberg";
contact.sex = "Male";
contact.phone = ["555-0100", "555-0120"];
contact.lineadd = "SPRITS";

var memberfilter = new Array();
memberfilter[0] = "surname";
memberfilter[1] = "phone";
memberfilter[2] = "sex";
var jsonText = JSON.stringify(contact, memberfilter, "\t");
// document.write(jsonText);
// Output: 
// { "surname": "Aaberg", "phone": [ "555-0100", "555-0120" ] }

// var jsontext = JSON.stringify(arr);
filename = File.saveDialog("保存ファイル名を入れて下さい");
if (filename) {
  fileObj = new File(filename);
  flag = fileObj.open("w");
  if (flag == true) {
    // text = "こんな具合にファイルに書き出せます。";
    fileObj.write(jsonText);
    fileObj.close();
  } else {
    alert("ファイルが開けませんでした");
  }
}