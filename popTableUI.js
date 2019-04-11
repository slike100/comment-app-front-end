//POPULATE UI WITH IndexDB DATA

// $(document).on('click','.deleteBtn',deleteStuff)


async function populateTableWithIndexDBData(){
  var divComments = document.querySelector('.comments');
  divComments.innerHTML = '';
  let comments = await db.comments.toArray();
  for (var i = comments.length - 1; i >= 0; i--) {
    var divHolder = document.createElement('div');
    var list = document.createElement('ul');

    var listAuthor = document.createElement('p');
    listAuthor.innerText = comments[i].author;
    listAuthor.dataset.author = comments[i].author;
    list.append(listAuthor);

    var listComment = document.createElement('li');
    listComment.innerText = comments[i].comment;
    listComment.dataset.comment = comments[i].comment;
    list.append(listComment);

    divHolder.append(list);
    divHolder.addClassName = "smallComments";

    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('dltBtn');
    deleteBtn.innerText = 'Delete this comment?';
    deleteBtn.dataset._id = comments[i]._id;
    deleteBtn.addEventListener('click', function(e){
      e.preventDefault();
      deleteComment(e);
    })

    var editButton = document.createElement('button');
    editButton.classList.add('editButton');
    editButton.innerText = 'Edit this comment?';
    editButton.dataset._id = comments[i]._id;
    editButton.dataset.name = comments[i].author;
    editButton.dataset.comment = comments[i].comment;
    editButton.addEventListener('click', function (e){
      modal.style.display = 'block';
      document.getElementById('editName').value = e.target.dataset.name;
      document.getElementById('editComments').value = e.target.dataset.comment;
      document.getElementById('editBtn').dataset._id = e.target.dataset._id;
    })

    divHolder.append(editButton);
    divHolder.append(deleteBtn);

    divComments.append(divHolder);
  }

  backBtn.innerText = 'Back';
  backBtn.setAttribute('id', 'backBtn');

  forwardBtn.innerText = 'Next';
  forwardBtn.setAttribute('id', 'forwardBtn');

  divComments.append(backBtn);
  divComments.append(forwardBtn);

}


forwardBtn.addEventListener('click', async function(e){
  e.preventDefault();
  // getCommentsFromAPI(count);
  if(count + 1 == Math.ceil(getComments.count/3)){
    count++;
    forwardBtn.style.display = 'none'
    getCommentsFromAPI(count);
  } else {
    count++;
    getCommentsFromAPI(count);
  }
});

backBtn.addEventListener('click', function(e){
  e.preventDefault();
  if(count == 1){
    backBtn.style.display = 'none'
    return;
  } else if (count > 1) {
    forwardBtn.style.display = 'block'
    count--;
    getCommentsFromAPI(count);
  }
});
