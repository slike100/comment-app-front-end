//GLOBAL VARIABLES FOR COMPARISON
window.addEventListener('DOMContentLoaded', async (event) => {
  connection.addEventListener('change', function(e){
    console.log(e);
    e.preventDefault();
    updateConnectionStatus(e);
  });
  if(connection.rtt === 50){
    await getCommentsFromAPI(count);
    ronSwanson();
    setInterval(ronSwanson, 60000);
    window.loading = setInterval(getCommentsFromAPI, 300000);
  }
});


var addedComments = [];
var updatedComments = [];
var deletedIDS = [];
var count = 1;


window.loading;
window.isConnected;
window.connection = navigator.connection;
window.forwardBtn = document.createElement('button');
window.backBtn = document.createElement('button');

function updateConnectionStatus(e) {
  if(e.target.rtt === 50){
    getCommentsFromAPI();
    window.loading = setInterval(getCommentsFromAPI, 1000000);
    return isConnected = true;
  } else if(e.target.rtt === 0) {
    clearInterval(loading);
    return isConnected = false;
  }
}

async function getCommentsFromAPI(page){

  if(page == 1){
    backBtn.style.display = 'none';
  } else if (page > 1) {
    backBtn.style.display = 'block';
  }

  if(addedComments.length > 0){
     await addMany(addedComments);
     addedComments.length = 0;
   }

   if(deletedIDS.length > 0){
    await deleteAll(deletedIDS);
    deletedIDS.length = 0;
   }

   if(updatedComments.length > 0){
    for (var i = 0; i < updatedComments.length; i++) {
    await editData(updatedComments[i].id, updatedComments[i]);
   }
   updatedComments.length = 0;
 }

  await getCommentsUpdateCount(page);

    window.db = new Dexie("comment_database");
    db.version(1).stores({
        comments: '_id,author,comment,pubDate'
    });
    db.comments.clear();
    // Put some data into it
    db.comments.bulkPut(getComments.comment).then(function () {
      console.log(getComments.comment);
        // Then when data is stored, read from it
        var commentsArr = [];
        return db.comments.each(comment => {
          populateTableWithIndexDBData()
        });
    }).catch(function (error) {
          console.error(`Ooops: ${error}`);
    });
    console.log('IndexDB reload');
}



//GETTING THE ADDED COMMENT DATA
document.querySelector('#addedComment').addEventListener('submit', function(e){
  e.preventDefault();
  var myObj = {}
  for (var i = 0; i < e.target.length-1; i++) {
    if(e.target[i].name == false || e.target[i].value == false){
      alert('Name and comment must include something');
      return;
    } else {
      var pubDate = new Date();
      myObj['_id'] = Math.random();
      myObj[e.target[i].name] = e.target[i].value;
      myObj['pubDate'] = pubDate.toString();
    }
  }
  console.log(myObj);
  addComment(myObj);
})


//EDIT FORM
document.querySelector('#editComment').addEventListener('submit', function(e){
  e.preventDefault();
  console.log(e);
  var myObj = {}
  for (var i = 0; i < e.target.length-1; i++) {
    if(e.target[i].name == false || e.target[i].value == false){
      alert('Name and comment must include something');
      return;
    } else {
      myObj[e.target[i].name] = e.target[i].value;
    }
  }
  editComment(document.querySelector('#editBtn').dataset._id, myObj);
})



//DELETE COMMENT FROM INDEXDB
function deleteComment(event) {
  var deletedComment  = db.comments.delete(event.target.dataset._id);

  deletedComment.then(function(resolved) {
    console.log(resolved);
    deletedIDS.push(event.target.dataset._id)
    populateTableWithIndexDBData();
  }).catch(function(rejected) {
    console.log(rejected);
  });
}


//ADD COMMENT TO INDEXDB
function addComment(obj) {
    var addedComment = db.comments.put(obj);
    addedComment.then(function(resolved){
      console.log(resolved);
    }).catch(function(rejected) {
      console.log(rejected);
    });
    // populateTableWithIndexDBData();
    // addedComments.push(obj);
    sanitizeComment(obj);
    document.querySelector('#addedComment').reset();
}


//EDIT COMMENT ON DB
function editComment(id, obj){
  var updatedComment = db.comments.update(id, obj);
  updatedComment.then(function(resolved){
    console.log(resolved);
  }).catch(function(rejected){
    console.log(rejected);
  });
  var updatedObj = obj;
  updatedObj.id = id
  populateTableWithIndexDBData();
  updatedComments.push(updatedObj);
  modal.style.display = "none";

}


// PAGINATION
// function pagination(){
//   var page = db.comments
//     .offset(1 * 3)
//     .limit(3)
//     .toArray();
//     page.then (function(resolved){
//       console.log(resolved);
//     }).catch(function(rejected){
//       console.log(rejected);
//     })
//     console.log(page);
// }

// sanitizing comments to send to API
function sanitizeComment(obj){
  var newObj = {};
  for (var key in obj) {
    if(key === 'author'){
      newObj[key] = obj[key];
    } else if(key === 'comment') {
      newObj[key] = obj[key];
    }
  }
  addedComments.push(newObj);
}


// let db;
// async function playAround() {
//     db = new Dexie ('comment_database');
//     if (!(await Dexie.exists(db.comments))) {
//         alert("Db does not exist");
//         db.version(1).stores({
//             comments: '_id,author,comment,pubDate'
//         });
//     }
//     populateTableWithIndexDBData();
// }
