<?php
require_once 'config.php';

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$inputData = json_decode(file_get_contents("php://input"), true);

// ==========================================
// ENDPOINT 1: ĐĂNG KÝ NHẬN TIN (/api/subscribe)
// ==========================================
if (preg_match('/\/api\/subscribe\/?$/', $request_uri) && $method === 'POST') {

    $name = isset($inputData['name']) ? trim($inputData['name']) : '';
    $email = isset($inputData['email']) ? trim($inputData['email']) : '';

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Vui lòng cung cấp đầy đủ Họ tên và Email."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Định dạng Email không hợp lệ."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    try {
        $sql = "INSERT INTO subscribers (name, email) VALUES (:name, :email)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':email' => $email
        ]);
        
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Đăng ký lưu trữ thông tin thành công!"], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi lưu trữ dữ liệu."], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// ==========================================
// ENDPOINT 2: CHATBOT AI THỰC TẾ (/api/chat)
// ==========================================
if (preg_match('/\/api\/chat\/?$/', $request_uri) && $method === 'POST') {

    $message = isset($inputData['message']) ? trim($inputData['message']) : '';

    if (empty($message)) {
        http_response_code(400);
        echo json_encode(["reply" => "Tin nhắn không được để trống."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $api_key = getenv('GEMINI_API_KEY');
    $api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $api_key;

    $system_prompt = "Bạn là HeliBot, trợ lý AI tư vấn khách hàng của tập đoàn HELICORP. "
        . "Hãy trả lời câu hỏi của khách hàng ngắn gọn, lịch sự bằng tiếng Việt dưới 3 câu. "
        . "Thông tin sản phẩm: Kính thông minh HeliGlass Pro. Giá: 12.990.000đ. "
        . "Trọng lượng: 75 gram (Hợp kim Magie hàng không). Pin: 12 giờ liên tục. "
        . "Màn hình: Micro-OLED AR tần số 120Hz mượt mà, bảo vệ võng mạc. "
        . "Hãy bảo khách đăng ký form ở cuối trang để nhận voucher giảm 20%. "
        . "Tuyệt đối không tự bịa thông tin nằm ngoài phạm vi sản phẩm này.";

    $api_payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $system_prompt . "\n\nKhách hỏi: " . $message]
                ]
            ]
        ]
    ];

    $ch = curl_init($api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($api_payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $api_response = curl_exec($ch);
    $curl_error = curl_error($ch);
    curl_close($ch);

    $botReply = '';

    if ($curl_error) {
        $botReply = "Cảm ơn bạn đã quan tâm. Kính HeliGlass Pro hiện có giá 12.990.000đ, siêu nhẹ 75g và pin dùng 12 tiếng. Bạn hãy điền form đăng ký phía dưới để nhận ưu đãi 20% nhé!";
    } else {
        $response_data = json_decode($api_response, true);
        if (isset($response_data['candidates'][0]['content']['parts'][0]['text'])) {
            $botReply = trim($response_data['candidates'][0]['content']['parts'][0]['text']);
        } else {
            $botReply = "HeliBot chưa hiểu rõ ý bạn, bạn cần tư vấn về mức giá, trọng lượng hay thời lượng pin của sản phẩm?";
        }
    }

    try {
        $sql = "INSERT INTO chat_logs (user_message, bot_reply) VALUES (:user_msg, :bot_rep)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':user_msg' => $message,
            ':bot_rep' => $botReply
        ]);
    } catch (PDOException $db_err) {
        error_log("Lỗi ghi Database: " . $db_err->getMessage());
    }

    http_response_code(200);
    echo json_encode(["reply" => $botReply], JSON_UNESCAPED_UNICODE);
    exit();
}

http_response_code(404);
echo json_encode(["success" => false, "message" => "Endpoint không hợp lệ."], JSON_UNESCAPED_UNICODE);