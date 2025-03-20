from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import xml.etree.ElementTree as ET
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许所有域名的跨域请求

XML_FILE = "comments.xml"

# 处理前端静态文件
@app.route('/')
def index():
    return send_from_directory('static', 'comment.html')

@app.route("/save_comment", methods=["POST"])
def handle_comment():
    try:
        # 获取原始 XML 数据
        raw_xml = request.get_data(as_text=True)
        root = ET.fromstring(raw_xml)
        
        # 解析字段
        name = root.find("name").text.strip()
        text = root.find("text").text.strip()

        # 输入验证
        if len(name) < 2 or len(name) > 50:
            return jsonify(success=False, error="姓名需为2-50字符"), 400
        if len(text) < 5 or len(text) > 500:
            return jsonify(success=False, error="评论需为5-500字符"), 400

        # 更新 XML 文件
        if os.path.exists(XML_FILE):
            tree = ET.parse(XML_FILE)
            root_node = tree.getroot()
        else:
            root_node = ET.Element("comments")

        new_comment = ET.SubElement(root_node, "comment")
        ET.SubElement(new_comment, "name").text = name
        ET.SubElement(new_comment, "text").text = text
        ET.SubElement(new_comment, "timestamp").text = datetime.now().isoformat()

        ET.ElementTree(root_node).write(XML_FILE, encoding="utf-8", xml_declaration=True)
        return jsonify(success=True, message="提交成功")

    except ET.ParseError:
        return jsonify(success=False, error="无效的XML格式"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.route("/comments.xml")
def get_comments():
    if not os.path.exists(XML_FILE):
        return "<comments></comments>", 200, {"Content-Type": "application/xml"}
    
    with open(XML_FILE, "r", encoding="utf-8") as f:
        return f.read(), 200, {"Content-Type": "application/xml"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
