class RequestsSession:
    def __init__(self,requests):
        self.session = requests.Session()

    def setMaxRedirects(self,nums):
        self.session.max_redirects = nums

    def setUserAgent(self,userAgent):
        self.session.headers['User-Agent'] = userAgent

    def getSession(self):
        return self.session