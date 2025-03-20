<?php
header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('仅支持 POST 请求');
    }

    // 读取原始 POST 数据
    $xmlContent = file_get_contents('php://input');
    if (empty($xmlContent)) {
        throw new Exception('未接收到 XML 数据');
    }

    // 解析 XML
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($xmlContent);
    if ($xml === false) {
        $errors = libxml_get_errors();
        throw new Exception('无效的 XML 格式: ' . $errors[0]->message);
    }

    // 验证必要字段
    if (!isset($xml->name) || !isset($xml->text)) {
        throw new Exception('XML 缺少必要字段');
    }

    // 加载或创建 XML 文件
    $filename = 'comments.xml';
    if (file_exists($filename)) {
        $existing = simplexml_load_file($filename);
    } else {
        $existing = new SimpleXMLElement('<?xml version="1.0"?><comments></comments>');
    }

    // 添加新评论
    $newComment = $existing->addChild('comment');
    $newComment->addChild('name', htmlspecialchars((string)$xml->name));
    $newComment->addChild('text', htmlspecialchars((string)$xml->text));
    $newComment->addChild('timestamp', date('c')); // 添加时间戳

    // 保存文件
    if ($existing->asXML($filename)) {
        $response['success'] = true;
        $response['message'] = '评论已保存';
    } else {
        throw new Exception('无法写入文件');
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>