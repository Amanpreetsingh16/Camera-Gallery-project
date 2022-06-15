//open database
//make transaction
let database;
let openrequest=indexedDB.open("MyDatabase");
openrequest.addEventListener("success",(e)=>{
    console.log("db open");
    database=openrequest.result;

});

openrequest.addEventListener("error",(e)=>{
    console.log("db error");

});
openrequest.addEventListener("upgradeneeded",(e)=>{
    console.log("db upgraded");
    database=openrequest.result;
    //create objectstore and it is created only in upgrageneeder
    database.createObjectStore("video",{keyPath: "id"});
    database.createObjectStore("image",{keyPath: "id"});

});
