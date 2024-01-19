import { createNote, deleteNote, getNotes } from "./api.js";


// EVENT FUNCTIONS

document.getElementById("btnDarkMode").addEventListener("click", (e)=>{
    document.querySelector("body").classList.toggle("dark-mode");
    
    const btnDarkMode = document.querySelector("#btnDarkMode i");
    btnDarkMode.classList.toggle("fa-moon");
    btnDarkMode.classList.toggle("fa-sun");
})


document.getElementById("btnShowAddNoteForm").addEventListener("click", ()=>{
    toggleAddNoteForm();
})


document.getElementById("btnHideForm").addEventListener("click", ()=>{
    toggleAddNoteForm();
})

document.getElementById("btnAddNote").addEventListener("click", async ()=>{

    const titleEl = document.getElementById("title");
    const noteEl = document.getElementById("note");
    const colorEl = document.querySelector('input[name="colors"]:checked');


    try {
        const title = titleEl.value;
        const note = noteEl.value;
        const color = colorEl.id;

        // Form validation
        if(!title) throw new Error("Plase enter a title");
        if(!note) throw new Error("Plase enter a note");
        color ??= "light"; // color = color ?? "light"

        const newNote = {
            title,
            note,
            color
        }

        // API üzerinden yeni note ekle
        const data = await createNote(newNote);
        const row = document.querySelector("#board .row");

       
        // Sayfaya, eklenen note ile alakalı card ekle
        createNoteElement(data, row)


        // Reset
        resetAddNoteForm(titleEl, noteEl);
        
    } catch (err) {
        alert(err.message);
    }

})



// OTHER FUNCTIONS

const loadNotes = async () => {
    const row = document.querySelector("#board .row");
    row.innerHTML = "";
    showLoader();

    try {
        const notes = await getNotes();

        notes.forEach(item => {
            createNoteElement(item, row)
        })

    
    } catch (err) {
        console.log(err);
    }
    finally{
        hideLoader();
    }
}

const toggleAddNoteForm = () => { 
    document.querySelector(".add-note-form").classList.toggle("d-none");
    const btnShowAddNoteForm = document.querySelector("#btnShowAddNoteForm i");
    btnShowAddNoteForm.classList.toggle("fa-plus");
    btnShowAddNoteForm.classList.toggle("fa-times");
}

const removeNoteElement = async (id) => { 
    try {
        const result = confirm("Are you sure to delete?");
        if(!result) return;

        showLoader();

        const deletedData = await deleteNote(id);

        const noteEl = document.querySelector(`div[data-id="${deletedData.id}"]`);
        noteEl.remove();
    } catch (err) {
        alert(err.message);
    }
    finally{
        hideLoader();
    }
}

const createNoteHTML = (data) => { 
    return `
        <div class="col" data-id="${data.id}">
            <div class="card bg-${data.color} shadow">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>${data.title}</div>
                    <div class="text-end">
                    <button class="btn btn-danger">
                        <i class="fas fa-times"></i>
                    </button>
                    </div>
                </div>
                <div class="card-body">
                    ${data.note}
                </div>
                </div>
        </div>
    `;
}

const createNoteElement = (data, row) => { 
    // Sayfaya, eklenen note ile alakalı card ekle
    const newNoteHTML = createNoteHTML(data);

    // append, innerHTML, insertAdjacentHTML
    // row.innerHTML = newNoteHTML + row.innerHTML;
    row.insertAdjacentHTML("afterbegin", newNoteHTML); // Card DOM'a yerleşir

    const deleteButton = row.querySelector(`div[data-id="${data.id}"] button`);
    deleteButton.addEventListener("click", () => removeNoteElement(data.id) )
}

const resetAddNoteForm = (titleEl, noteEl) => { 
    titleEl.value = "";
    noteEl.value = "";
    document.querySelectorAll('input[name="colors"]')[0].setAttribute("checked", true);
    toggleAddNoteForm();
}

const showLoader = () => {
    document.querySelector("#loader").style.display = "flex";
}

const hideLoader = () => {
    document.querySelector("#loader").style.display = "none";
}

loadNotes();