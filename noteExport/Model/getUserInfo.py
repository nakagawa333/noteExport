import requests
import json
from bs4 import BeautifulSoup
from requestsSession import RequestsSession
import math

def isStr(val):
    return type(val).__name__ == "str"

class getUserInfo:
    def __init__(self,userName,url=""):
        self.userName = userName
        self.url = url
    def setUserInfoUrl(self):
        self.url = f"https://note.com/api/v2/creators/{self.userName}"

    def setUserContentsUrl(self):
        self.url = f"https://note.com/api/v2/creators/{self.userName}/contents/"

    def getNoteContentsText(self):
        userContentsUrl = self.url

        startPage = 1
        payload = {"kind":"note","page":startPage}

        requestsSession = RequestsSession(requests)
        requestsSession.setMaxRedirects(10000000000000000)
        requestsSession.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36')
        session = requestsSession.getSession()
    
        res = session.get(userContentsUrl,params=payload)
        content = json.loads(res.content)

        data = content.get('data')
        if isStr(data): return "アカウントが見つかりませんでした"
        
        pages = data.get('totalCount')

        if pages == None: return "アカウントが見つかりませんでした"
        length = math.ceil(pages / 6)

        resText = ""
        resArr = []
        for i in range(length):
            childResText = ""
            payload = {"kind":"note","page":startPage}

            res = session.get(userContentsUrl,params=payload)
            content = json.loads(res.content)

            data = content.get('data')
            contents = data.get('contents')
            startPage += 1

            for content in contents:
                title = content.get('name')
                url = content.get('noteUrl')
                #bodyでは全て取得できないため、BeautifulSoupで解析
                res = session.get(url)
                soup = BeautifulSoup(res.text,'html.parser')

                childResText += "url: " + url + "\r\n"
                title = content['name']
                childResText += "title: "
                if title != None: childResText += content.get('name')

                hashTagText = "\r\nhashTag: "
                hashtags = content.get('hashtags')
                tags = ""
                if hashtags != None: 
                    for hash in hashtags:
                        hashtag = hash.get('hashtag')
                        if hashtag != None:
                            hashNames = hashtag.get('name') + " "
                            hashTagText += hashNames
                            tags += hashNames

                childResText += hashTagText
                childResText += "\r\n\r\n"

                resChildArr = []
                url = "" if url == None else url
                title = "" if title == None else title
                tags = "" if tags == None else tags
                
                resChildArr.append(url)
                resChildArr.append(title)
                resChildArr.append(tags)

                body = ""
                noteContentText = soup.select_one("div[data-name='body']")
                if noteContentText != None:
                    noteContentContents = noteContentText.contents
                    childResText += "body:\r\n"
                    for content in noteContentContents: 
                        childResText += str(content) + "\r\n\r\n"
                        body += str(content)

                resChildArr.append(body)
                resArr.append(resChildArr)
            resText += childResText + "\r\n\r\n\r\n"
        return {"text":resText,"list":resArr}