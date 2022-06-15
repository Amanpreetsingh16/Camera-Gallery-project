setTimeout(() => {
  if (database) {
    //video reteval
    let dbtransaction = database.transaction("video", "readonly");
    let videostore = dbtransaction.objectStore("video");
    let videoreq = videostore.getAll();
    videoreq.onsuccess = (e) => {
      let videoresult = videoreq.result;
      let gallerycont=document.querySelector(".gallery-cont");
      videoresult.forEach((videoobj) => {
        let mediaelemnt = document.createElement("div");
        mediaelemnt.setAttribute("class", "media-cont");
        mediaelemnt.setAttribute("id", videoobj.id);
        let url=URL.createObjectURL(videoobj.blobdata);
        mediaelemnt.innerHTML = `
            <div class="media">
             <video  autoplay loop src="${url}"></video>
           </div>
           <div class="delete action">Delete</div>
           <div class="download action">Download</div>
        `;
        gallerycont.appendChild(mediaelemnt);

        //listener
        let deletebtn=mediaelemnt.querySelector(".delete");
        deletebtn.addEventListener("click",deletelistener);
        let downloadbtn=mediaelemnt.querySelector(".download");
        downloadbtn.addEventListener("click",downloadlistener)

      });
    };

    //image retreval
    let imgdbtransaction = database.transaction("image", "readonly");
    let imagestore = imgdbtransaction.objectStore("image");
    let imagereq = imagestore.getAll();
    imagereq.onsuccess = (e) => {
      let imageresult = imagereq.result;
      let gallerycont=document.querySelector(".gallery-cont");
      imageresult.forEach((imageobj) => {
        let mediaelemnt = document.createElement("div");
        mediaelemnt.setAttribute("class", "media-cont");
        mediaelemnt.setAttribute("id", imageobj.id);
        let url=imageobj.url
        mediaelemnt.innerHTML = `
            <div class="media">
             <img src="${url}"/>
           </div>
           <div class="delete action">Delete</div>
           <div class="download action">Download</div>
        `;
        gallerycont.appendChild(mediaelemnt);
         //listener
         let deletebtn=mediaelemnt.querySelector(".delete");
         deletebtn.addEventListener("click",deletelistener);
         let downloadbtn=mediaelemnt.querySelector(".download");
         downloadbtn.addEventListener("click",downloadlistener)
 
      });
    };
  }
}, 100);

function deletelistener(e){
let id= e.target.parentElement.getAttribute("id");
if(id.slice(0,3)==="vid"){
    let dbtransaction = database.transaction("video", "readwrite");
    let videostore = dbtransaction.objectStore("video");
    videostore.delete(id);
}
else if(id.slice(0,3)==="img"){
    let imgdbtransaction = database.transaction("image", "readwrite");
    let imagestore = imgdbtransaction.objectStore("image");
    imagestore.delete(id);
}
e.target.parentElement.remove();
}

function downloadlistener(e){

    let id= e.target.parentElement.getAttribute("id");
    if(id.slice(0,3)==="vid"){
        let dbtransaction = database.transaction("video", "readwrite");
        let videostore = dbtransaction.objectStore("video");
        let videoreq=videostore.get(id);
        videoreq.onsuccess= (e)=>{
            let videoresult=videoreq.result;
            let videurl=URL.createObjectURL(videoresult.blobdata);
            let a=document.createElement("a");
        a.href=videurl;
        a.download="stream.mp4";
        a.click();
        }
    }
    else if(id.slice(0,3)==="img"){
      let imgdbtransaction = database.transaction("image", "readonly");
      let imagestore = imgdbtransaction.objectStore("image");
      let inmagereq=imagestore.get(id);
      imagereq.onsuccess= (e)=>{
          let imageresult=imagereq.result;
          let a=document.createElement("a");
      a.href=imageresult.url;
      a.download="image.jpg";
      a.click();
      }
    }
}