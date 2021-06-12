let myLibrary = [];

let editBookDiv = document.querySelector("#edit_book_details");
let tbody = document.querySelector("#table_body");
let formElements = document.getElementById("add_new_book_form").elements;

let addBookDisplay = document.querySelector("#add_book_button");
addBookDisplay.addEventListener("click", function(){
    let addBookDiv = document.querySelector("#add_new_book");
    addBookDiv.style.visibility = "visible";
    addBookDiv.style.height = "auto"; 
});

let addBookSubmit = document.querySelector("#add_book_submit");
addBookSubmit.addEventListener("click",function(){

    proceedToAddFlag = true;
    for(let i=0;i<formElements.length-1;i++){
        if(formElements[i].value == ""){
            proceedToAddFlag = false;
        }
    }

    if(proceedToAddFlag){
        addBookToLibrary();
        let addBookDiv = document.querySelector("#add_new_book");
        addBookDiv.style.visibility = "hidden"; 
        addBookDiv.style.height = "0%";         
    } else {
        alert("Kindly enter value to all the fields.")
    }

});

let editBookSubmit = document.querySelector("edit_book_submit");
editBookDiv.addEventListener("click",function(){

    let editBookSubmit = document.getElementById("edit_book_form").elements;

    bookObjectPostition = document.getElementById("edit_book_status").getAttribute("data-list-pos");
    requiredBookObject = myLibrary[bookObjectPostition];
    if(requiredBookObject.status != editBookSubmit[0].value){
        requiredBookObject.updateStatus(document.getElementById("edit_book_status").value)
        editBookDiv.style.visibility = "hidden";
        editBookDiv.style.height = "0%";   
        displayLibrary();
    } else {
        alert("Same Book Status selected. Please choose a different one.")
    }
});

function Book(bookTitle, bookAuthor, bookLength, bookStatus = "To Be Read"){
    this.name = bookTitle;
    this.author = bookAuthor;
    this.pages = bookLength;
    this.status = bookStatus;
};

function BookArray(){

}

BookArray.prototype.fetchBook = function(){
    tmpArray = [this.name, this.author, this.pages, this.status];
    return tmpArray;
};

BookArray.prototype.updateStatus = function(editBookStatus){
    this.status = editBookStatus;
}

Book.prototype = Object.create(BookArray.prototype);

function addBookToLibrary(){
    let bookTitle = formElements[0].value;
    let bookAuthor = formElements[1].value;
    let bookLength = formElements[2].value;
    let bookStatus = formElements[3].value;

    document.getElementById("add_new_book_form").reset();

    B1 = new Book(bookTitle, bookAuthor, bookLength, bookStatus);
    
    myLibrary.push(B1);

    displayLibrary();
};

function displayLibrary(){
    let totalBookCount = 1;

    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
    
    myLibrary.forEach(function(currentBook){
        
        let tr = document.createElement("tr");
        
        let td0 = document.createElement("td");
        td0.textContent = totalBookCount;
        tr.appendChild(td0);

        let bookDets = currentBook.fetchBook();
        for(let i=0;i<bookDets.length;i++){
            let td1 = document.createElement("td");
            td1.textContent = bookDets[i];
            tr.appendChild(td1);
        }

        addButtons = ["edit","delete"];
        addButtons.forEach(function(curButton){
            let td5 = document.createElement("td");
            let button = document.createElement("button");
            button.setAttribute("data-list-pos",totalBookCount - 1)
            button.setAttribute("id",curButton);
            button.textContent = curButton.charAt(0).toUpperCase() + curButton.slice(1);
            td5.appendChild(button);
            tr.appendChild(td5);
        });

        totalBookCount += 1

        tbody.appendChild(tr);
    });

    document.querySelectorAll("#edit").forEach(editButton => {
        editButton.addEventListener("click",function(){
            displayEdit(editButton);
        });
    });

    document.querySelectorAll("#delete").forEach(deleteButton => {
        deleteButton.addEventListener("click",function(){
            deleteBook(deleteButton);
        });
    });

};

function displayEdit(curBookRow){

    bookObjectPostition = curBookRow.getAttribute("data-list-pos");
    requiredBookObject = myLibrary[bookObjectPostition];

    editBookDiv.style.visibility = "visible";
    editBookDiv.style.height = "auto"; 

    document.getElementById("edit_book_id").textContent = requiredBookObject.name;
    document.getElementById("edit_book_status").value = requiredBookObject.status;
    document.getElementById("edit_book_status").setAttribute("data-list-pos",bookObjectPostition);

};

function deleteBook(curBookRow){
    bookObjectPostition = curBookRow.getAttribute("data-list-pos");
    delete myLibrary[bookObjectPostition];
    displayLibrary();
};