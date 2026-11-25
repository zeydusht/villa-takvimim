# yerel test sunucusu: www klasörü; uzantısız yol .html'e düşer (Netlify gibi: /g → g.html)
import http.server, os, sys
KOK = sys.argv[2] if len(sys.argv) > 2 else "."
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=KOK, **k)
    def send_head(self):
        yol = self.path.split("?")[0].split("#")[0]
        if yol != "/" and "." not in os.path.basename(yol) and os.path.exists(os.path.join(KOK, yol.lstrip("/") + ".html")):
            self.path = yol + ".html" + (self.path[len(yol):])
        return super().send_head()
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(("", int(sys.argv[1])), H).serve_forever()
