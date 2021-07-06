window.onload = function(){

    let alertMessage = sessionStorage.getItem("alertMessage")

    if(alertMessage){
        let alertDiv = createAlertDom(alertMessage)
        jQuery("#userNameEle").prepend(alertDiv)
    }

    const userNameText = jQuery("#userNameText");
    const userNamesValue = localStorage.getItem("usernames");
    userNameText.autocomplete({
        source:userNamesValue ? JSON.parse(userNamesValue) : []
    })
}

function createAlertDom(text){
    let alertDiv = jQuery("<div></div>",{
        "class" : "alert alert-danger",
        "id" : "alert_danger",
        role : "alert",
        text: text
    })
    return alertDiv
}