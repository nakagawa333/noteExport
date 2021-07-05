class Export{
    constructor(title){
        this.title = title;
        this.ua = window.navigator.userAgent.toLowerCase();
    }

    exportTxt(str){
        let title = this.title + ".txt"
        let blob = new Blob([str], { type:'txt/plain'});
        saveAs(blob,title)
    }

    exportCSV(records){
        let title = this.title + ".csv"
        let bom = new Uint8Array([0xEF, 0xBB, 0xBF])
        let blob = new Blob([bom,records],{type:"text/csv"});
        saveAs(blob,title)
    }

    exportXls(records){
        let title = this.title + ".xls"
        let bom = new Uint8Array([0xEF, 0xBB, 0xBF])
        let blob = new Blob([bom,records],{type:"text/xls"});
        saveAs(blob,title)    
    }
}

// function createDownloadButton(fileName,url){
//     let link = document.createElement("a");
//     link.download = fileName;
//     link.href = url;
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)          
// }

// function isIE(ua){
//     return ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1
//  }


