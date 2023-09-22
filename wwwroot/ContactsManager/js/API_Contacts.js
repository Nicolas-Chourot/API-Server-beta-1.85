//const API_URL = "https://api-server-5.glitch.me/api/contacts";
const API_URL = "http://localhost:5000/api/contacts";
let currentHttpError = "";

function API_getcurrentHttpError () {
    return currentHttpError; 
}
function API_GetContacts() {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL,
            success: contacts => { currentHttpError = ""; resolve(contacts); },
            error: (xhr) => { console.log(xhr); resolve(null); }
        });
    });
}
function API_GetContact(contactId) {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + "/" + contactId,
            success: contact => { currentHttpError = ""; resolve(contact); },
            error: (xhr) => { currentHttpError = xhr.responseJSON.error_description; resolve(null); }
        });
    });
}
function API_SaveContact(contact, create) {
    return new Promise(resolve => {
        $.ajax({
            url: create ? API_URL :  API_URL + "/" + contact.Id,
            type: create ? "POST" : "PUT",
            contentType: 'application/json',
            data: JSON.stringify(contact),
            success: (/*data*/) => { currentHttpError = ""; resolve(true); },
            error: (xhr) => {currentHttpError = xhr.responseJSON.error_description; resolve(false /*xhr.status*/); }
        });
    });
}
function API_DeleteContact(id) {
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + "/" + id,
            type: "DELETE",
            success: () => { currentHttpError = ""; resolve(true); },
            error: (xhr) => { currentHttpError = xhr.responseJSON.error_description; resolve(false /*xhr.status*/); }
        });
    });
}