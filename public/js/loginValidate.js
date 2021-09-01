function LoginValidate(form){
    var displayMessage = document.getElementById('displayEmptyField');
    var message = '';
    if(catchEmptyField(form.email)) message += 'Email field is empty, ';
    if(catchEmptyField(form.password)) message += 'Password field is empty';

    if(message == '') return true;
    else{
        displayMessage.innerHTML = message;
        return false;
    }
    
}

//watching for empty fields
function catchEmptyField(e){
    var status = true;
    for(i = 0; i < e.value.length; i++){
        if(e.value.charAt(i) != '')
        status = false;
        break;
    }
    return status;
}