let video=document.querySelector("video");
let record_btn_cont=document.querySelector(".record-cont");
let capture_btn_cont=document.querySelector(".capture-cont");
let record_btn=document.querySelector(".record-btn");
let capture_btn=document.querySelector(".capture-btn");
let recordflag=false;
let recorder;
let transparent="transparent"
let chunks=[]; //media data in chunks
let constrains={
    video: true,
    audio:true
}

//navigator-global,give browser info
navigator.mediaDevices.getUserMedia(constrains)
.then((stream)=>{
    video.srcObject=stream;
    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start", (e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable", (e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop", (e)=>{
        //coversion of media chunk data to video
        let blob=new Blob(chunks,{type:"video/mp4"});
        if(database){
            let videoid=shortid();
            let dbtransaction=database.transaction("video","readwrite");
          let videostore=  dbtransaction.objectStore("video");
          let videoentry={
            id: `vid${videoid}`,
            blobdata: blob
          }
          videostore.add(videoentry);
        }

        // let videourl= URL.createObjectURL(blob);
        // let a=document.createElement("a");
        // a.href=videourl;
        // a.download="stream.mp4";
        // a.click();
    })
})
record_btn_cont.addEventListener("click", (e)=>{
    if(!recorder)return;
    recordflag=!recordflag;
    if(recordflag){
        //start recording
        recorder.start();
        record_btn.classList.add("scale-record");
        starttimer();
    }else{
        recorder.stop();
        record_btn.classList.remove("scale-record");
        stoptimer();
    }
})

capture_btn_cont.addEventListener("click", (e)=>{
    capture_btn.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //filter apply
    tool.fillStyle=transparent;
    tool.fillRect(0,0,canvas.width,canvas.height);
    let imageurl=canvas.toDataURL();
    if(database){
        let imageid=shortid();
        let dbtransaction=database.transaction("image","readwrite");
      let imagestore=  dbtransaction.objectStore("image");
      let imageentry={
        id:`img${imageid}`,
        url: imageurl
      }
      imagestore.add(imageentry);
    }

    // let a=document.createElement("a");
    // a.href=imageurl;
    // a.download="image.jpg";
    // a.click();
    setTimeout(()=>{
        capture_btn.classList.remove("scale-capture");
    },500)

})


//timer function
let timerid;
let counter=0;
let timer=document.querySelector(".timer")

function starttimer(){
    timer.style.display="block";
    function displaytimer(){
        let totalsec=counter
      let hours=Number.parseInt(totalsec/3600);
      totalsec=totalsec%3600;
      let minutes=Number.parseInt(totalsec/60);
      totalsec=totalsec%60;
      let seconds=totalsec;
      hours=(hours<10)?`0${hours}`: hours;
      minutes=(minutes<10)?`0${minutes}`: minutes;
      seconds=(seconds<10)?`0${seconds}`: seconds;
      timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }
 timerid= setInterval(displaytimer,1000)
}
function stoptimer(){
    timer.style.display="none";
  clearInterval(timerid);
  timer.innerText="00:00:00";
}

//filtering
let allfilter=document.querySelectorAll(".filter");
let filterlayer=document.querySelector(".filter-layer");
allfilter.forEach((filterelem)=>{
    filterelem.addEventListener("click",(e)=>{
         transparent=getComputedStyle(filterelem).getPropertyValue("background-color");
         filterlayer.style.backgroundColor=transparent;
    })
})


