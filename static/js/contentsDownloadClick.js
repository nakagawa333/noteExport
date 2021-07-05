let arr = [["url","タイトル","ハッシュタグ","コンテンツ"]]

jQuery("#contentsDownload").off("click")
jQuery("#contentsDownload").on("click",function(){
    let userName = jQuery.trim(jQuery("#userNameText").val())
    const keyName = "alertMessage"
    jQuery("#alert_danger").remove()
    sessionStorage.removeItem(keyName)
    if(!userName) {
        const text = "ユーザー名を入力してください"
        sessionStorage.getItem(keyName,text)
        var alertDiv = createAlertDom(text)
        jQuery("#userNameEle").prepend(alertDiv)      
        return false;
    }

    if(ja2Bit(userName)){
        const text = "note IDではありません"
        sessionStorage.setItem(keyName,text)
        var alertDiv = createAlertDom(text)
        jQuery("#userNameEle").prepend(alertDiv) 
        return false;
    }

    const noticeModel = jQuery("#noticeModal")
    noticeModel.modal("show")
    noticeModel.modal({backdrop: 'static', keyboard: false})

    jQuery("#logTextArea").val("")
    jQuery.ajax("/output",{
        type:"post",
        data: {userName: userName},
        dataType: "json",
    })
    .done(function(data){
        let res = ""
        jQuery("#alert_danger").remove()
        switch(data["text"]){
            case "":
                res = "記事が見つかりませんでした"
                sessionStorage.setItem(keyName,res)
                var alertDiv = createAlertDom(res)
                jQuery("#userNameEle").prepend(alertDiv)
                return false;
            case "アカウントが見つかりませんでした":
                res = "アカウントが見つかりませんでした"
                sessionStorage.setItem(keyName,res)
                var alertDiv = createAlertDom(res)
                jQuery("#userNameEle").prepend(alertDiv)
                return false;
            default:
                res = data["text"]
                sessionStorage.removeItem(keyName)
        }

        data["list"].forEach(function(eles){
            eles = eles.map((ele) => {
                return escapeForCSV(ele)
            })
            arr.push(eles)
        })
        
        let userNamesArr = localStorage.getItem("usernames") === null ? [] : JSON.parse(localStorage.getItem("usernames"));

        if(userNamesArr.includes(userName) === false 
        && res !== "アカウントが見つかりませんでした") userNamesArr.push(userName);
        localStorage.setItem("usernames",JSON.stringify(userNamesArr));

        jQuery("#userNameText").autocomplete({
            source: userNamesArr
        })

        let ex = new Export(userName)
        const records = arr.map((record) => record.join(",")).join("\n")
        
        const zipChecked = jQuery("#zipCheck").prop("checked")
        const selectValue = jQuery("#outputFile").prop("selectedIndex");

        switch(selectValue){
            case 0:
                zipChecked ? toZip([{"userName" : userName + ".txt","text" : res}],userName) : ex.exportTxt(res)
                break
            case 1:
                zipChecked ? toZip([{"userName" : userName + ".csv","text" : records}],userName): ex.exportCSV(records)
                break
            case 2:
                zipChecked ? toZip([{"userName": userName + ".xls","text" : records}],userName) : ex.exportXls(records)
                break
            case 3:
                if(zipChecked){
                    toZip([{"userName" : userName + ".txt","text" : res},
                    {"userName" : userName + ".csv","text" : records},
                    {"userName": userName + ".xls","text" : records}],userName)
                } else{
                    ex.exportTxt(res)
                    ex.exportCSV(records)
                    ex.exportXls(records)               
                }
                break
        }
    })

    .fail(function(e){
        jQuery("#logTextArea").val("ユーザーが見つかりませんでした");
    }).always(function(){
        jQuery("#noticeModal").modal("hide")
        arr = [["url","タイトル","ハッシュタグ","コンテンツ"]]
    })
})

function toZip(arr,dirName){
    const zip = new JSZip();
    for(let obj of arr){
        zip.file(obj["userName"],obj["text"]);
    }
    zip.generateAsync({type:"blob"}).then(function(content){
        saveAs(content,`${dirName}.zip`);
    })
}
const escapeForCSV = (s) => {
    return `"${s.replace(/\"/g, '\"\"')}"`
}

const ja2Bit = (str) =>{
    return /[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]/.test(str);
}