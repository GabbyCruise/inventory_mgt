/*VALIDATING INPUTS BEFORE SUBMITTING*/
// *** Author: Gabriel Jonah ***//
// *** Date: 26 Dec 2020 3:09pm

//authenticating inputs
function validateMe(form){
    var displayMessage = document.getElementById('errorDisplay');
    var message = ' ';
    if(emptyField(form.cid)) message += 'Id field is empty';
    if(emptyField(form.name)) message += 'Name field is empty';
    if(emptyField(form.email)) message += 'Email field is empty';
    if(emptyField(form.password)) message += 'Password field is empty';
    with(form){
        if(!passwordLength(password, 4)) message += 'Password requires 5 chars and above';
    }
    if(message == ' ')return true;
    else{
        displayMessage.innerHTML = message;
        return false;
    }
}

//checking for password length
function passwordLength(val, min){
    if(!emptyField(val)){
        if(val.value.length <= min) return false;
        return true;
    }
}

//monitoring for empty field on submit click
function emptyField(e){
    var status = true;
    for(i = 0; i <e.value.length; i++){
        if(e.value.charAt(i) != ' ')
        status = false
        break;
    }
    return status;
}