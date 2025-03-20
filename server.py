from http.server import HTTPServer, BaseHTTPRequestHandler
import xml.etree.ElementTree as ET
import os
from datetime import datetime
import json  # 新增导入

class RequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        print(f"Received POST request to: {self.path}")
        if self.path == "/save_comment":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                if content_length == 0:
                    raise ValueError("请求体为空")

                raw_data = self.rfile.read(content_length)
                print("Received raw data:", raw_data.decode("utf-8"))

                # 解析 XML
                try:
                    root = ET.fromstring(raw_data.decode("utf-8"))
                except ET.ParseError as e:
                    raise ValueError(f"XML解析失败: {str(e)}")

                # 提取字段
                name_elem = root.find("name")
                text_elem = root.find("text")
                if name_elem is None or text_elem is None:
                    raise ValueError("XML 缺少 name 或 text 字段")
                name = name_elem.text.strip() if name_elem.text else ""
                text = text_elem.text.strip() if text_elem.text else ""
                if not name or not text:
                    raise ValueError("姓名和评论内容不能为空")

                # 加载或创建 XML 文件
                xml_file = "comments.xml"
                if os.path.exists(xml_file):
                    tree = ET.parse(xml_file)
                    root_node = tree.getroot()
                else:
                    root_node = ET.Element("comments")

                # 添加新评论
                new_comment = ET.SubElement(root_node, "comment")
                ET.SubElement(new_comment, "name").text = name
                ET.SubElement(new_comment, "text").text = text
                ET.SubElement(new_comment, "timestamp").text = datetime.now().isoformat()

                # 保存 XML
                ET.indent(root_node, space="\t", level=0)  # 美化 XML 格式
                tree = ET.ElementTree(root_node)
                tree.write(xml_file, encoding="utf-8", xml_declaration=True)

                # 返回 JSON 响应
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                response = {
                    "success": True,
                    "message": "评论保存成功",
                    "timestamp": datetime.now().isoformat()
                }
                self.wfile.write(json.dumps(response).encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                error_response = {
                    "success": False,
                    "error": type(e).__name__,
                    "message": str(e)
                }
                self.wfile.write(json.dumps(error_response).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'{"error": "Endpoint not found"}')

def run(server=HTTPServer, handler=RequestHandler, port=8000):
    server_address = ("", port)
    httpd = server(server_address, handler)
    print(f"Server running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
