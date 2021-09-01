/*VALIDATING INPUTS BEFORE SUBMITTING*/
// *** Author: Gabriel Jonah ***//
// *** first version: 26 Dec 2020 3:09pm
// *** final version: 14 Jan 2021 3:04pm

//authenticating inputs
function validateReg(form){
    document.getElementById('errorDisplay').style.display = 'block';
    var display = document.getElementById('errorDisplay');
    var message = '';
    if(emptyField(form.username)) message += 'Username field is empty, ';
    if(emptyField(form.email)) message += 'Email field is empty, ';
    if(emptyField(form.uid)) message += 'Enter obtained Company ID Number, ';
    if(emptyField(form.password)) message += 'Enter password to continue, ';
    


    //handling password length less than 6 characters
    with(form) {
        if(!passwordLength(password, 5)) message += 'Password requires 6 Chars and above! '
    }

    if(message == '') return true;
    else{
        display.innerHTML = message;
        return false;
    }
    
}

//password length validation
function passwordLength (val, min){
    if(!emptyField(val)){
        if(val.value.length <= min ) return false;
        return true;
    }
}

//watching for empty field
function emptyField(e){
    var status = true;
    for(i = 0; i < e.value.length; i++){
        if(e.value.charAt(i) != ' ')
        status = false;
        break;
    }
    return status;
}