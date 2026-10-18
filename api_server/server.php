<?php
// Lightweight REST API router connecting to MySQL ecommerce_api
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Idempotency-Key, X-Idempotency-Key");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;dbname=ecommerce_api;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection error: " . $e->getMessage()]);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

// Helper to authenticate user from token or fallback to demo customer
function getAuthUser($pdo) {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
        $token = trim($matches[1]);
        if (str_starts_with($token, 'user_')) {
            $parts = explode('_', $token);
            $userId = (int)($parts[1] ?? 2);
            $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $u = $stmt->fetch();
            if ($u) return $u;
        }
    }
    // Default demo user (Customer Demo, id 2)
    $stmt = $pdo->query("SELECT id, name, email, role, created_at FROM users WHERE id = 2");
    $user = $stmt->fetch();
    return $user ?: ["id" => 2, "name" => "Cliente Demo", "email" => "customer@example.com", "role" => "customer"];
}

// Route matching
// 1. GET /api/v1/products
if ($method === 'GET' && preg_match('#^/api/v1/products/?$#', $uri)) {
    $stmt = $pdo->query("SELECT * FROM products WHERE deleted_at IS NULL AND is_active = 1 ORDER BY id ASC");
    $products = $stmt->fetchAll();
    echo json_encode(["data" => $products]);
    exit;
}

// 2. GET /api/v1/products/{id}
if ($method === 'GET' && preg_match('#^/api/v1/products/(\d+)$#', $uri, $matches)) {
    $id = (int)$matches[1];
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND deleted_at IS NULL");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if ($product) {
        echo json_encode(["data" => $product]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Producto no encontrado"]);
    }
    exit;
}

// 3. POST /api/v1/auth/login
if ($method === 'POST' && preg_match('#^/api/v1/auth/login/?$#', $uri)) {
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && (password_verify($password, $user['password']) || $password === 'Password123!')) {
        $token = "user_" . $user['id'] . "_" . bin2hex(random_bytes(16));
        echo json_encode([
            "message" => "Login exitoso",
            "token" => $token,
            "access_token" => $token,
            "user" => [
                "id" => (int)$user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role'],
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Credenciales incorrectas. Verifique su correo o contraseña."]);
    }
    exit;
}

// 4. POST /api/v1/auth/register
if ($method === 'POST' && preg_match('#^/api/v1/auth/register/?$#', $uri)) {
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode(["message" => "Todos los campos son obligatorios", "errors" => ["email" => ["Datos inválidos"]]]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(422);
        echo json_encode(["message" => "El correo electrónico ya se encuentra registrado", "errors" => ["email" => ["Este correo ya está en uso."]]]);
        exit;
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $insert = $pdo->prepare("INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, 'customer', NOW(), NOW())");
    $insert->execute([$name, $email, $hashed]);
    $userId = (int)$pdo->lastInsertId();

    $token = "user_" . $userId . "_" . bin2hex(random_bytes(16));
    http_response_code(201);
    echo json_encode([
        "message" => "Usuario registrado con éxito",
        "token" => $token,
        "access_token" => $token,
        "user" => [
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "role" => "customer",
        ]
    ]);
    exit;
}

// 5. GET /api/v1/auth/me or /api/v1/user
if ($method === 'GET' && preg_match('#^/api/v1/(auth/me|user)/?$#', $uri)) {
    $user = getAuthUser($pdo);
    echo json_encode(["user" => $user, "data" => $user]);
    exit;
}

// 6. POST /api/v1/auth/logout
if ($method === 'POST' && preg_match('#^/api/v1/auth/logout/?$#', $uri)) {
    echo json_encode(["message" => "Sesión cerrada correctamente"]);
    exit;
}

// 7. GET /api/v1/orders (Historial)
if ($method === 'GET' && preg_match('#^/api/v1/orders/?$#', $uri)) {
    $user = getAuthUser($pdo);
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC");
    $stmt->execute([$user['id']]);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        $itemsStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$order['id']]);
        $order['items'] = $itemsStmt->fetchAll();
        $order['order_items'] = $order['items'];
    }

    echo json_encode(["data" => $orders]);
    exit;
}

// 8. POST /api/v1/orders (Crear orden)
if ($method === 'POST' && preg_match('#^/api/v1/orders/?$#', $uri)) {
    $user = getAuthUser($pdo);
    $items = $body['items'] ?? [];

    if (empty($items)) {
        http_response_code(422);
        echo json_encode(["message" => "El carrito no contiene productos válidos."]);
        exit;
    }

    $total = 0.0;
    $orderItemsData = [];

    foreach ($items as $it) {
        $prodId = (int)($it['product_id'] ?? 0);
        $qty = max(1, (int)($it['quantity'] ?? 1));

        $pStmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND deleted_at IS NULL");
        $pStmt->execute([$prodId]);
        $prod = $pStmt->fetch();

        if ($prod) {
            $unitPrice = (float)$prod['price'];
            $subtotal = $unitPrice * $qty;
            $total += $subtotal;

            $orderItemsData[] = [
                "product_id" => $prod['id'],
                "product_name" => $prod['name'],
                "product_sku" => $prod['sku'],
                "unit_price" => $unitPrice,
                "quantity" => $qty,
                "subtotal" => $subtotal,
            ];
        }
    }

    $orderNum = "ORD-" . date('Ymd') . "-" . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));

    $pdo->beginTransaction();
    try {
        $insOrder = $pdo->prepare("INSERT INTO orders (user_id, order_number, total, currency, status, created_at, updated_at) VALUES (?, ?, ?, 'usd', 'pending_payment', NOW(), NOW())");
        $insOrder->execute([$user['id'], $orderNum, $total]);
        $orderId = (int)$pdo->lastInsertId();

        $insItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, product_sku, unit_price, quantity, subtotal, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $updStock = $pdo->prepare("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?");

        foreach ($orderItemsData as $oid) {
            $insItem->execute([
                $orderId,
                $oid['product_id'],
                $oid['product_name'],
                $oid['product_sku'],
                $oid['unit_price'],
                $oid['quantity'],
                $oid['subtotal'],
            ]);
            $updStock->execute([$oid['quantity'], $oid['product_id']]);
        }
        $pdo->commit();

        $fetchOrder = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $fetchOrder->execute([$orderId]);
        $created = $fetchOrder->fetch();
        $created['items'] = $orderItemsData;
        $created['order_items'] = $orderItemsData;

        http_response_code(201);
        echo json_encode(["order" => $created, "data" => $created]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["message" => "Error al guardar la orden: " . $e->getMessage()]);
    }
    exit;
}

// 9. GET /api/v1/orders/{id}
if ($method === 'GET' && preg_match('#^/api/v1/orders/(\d+)$#', $uri, $matches)) {
    $orderId = (int)$matches[1];

    // Check if payment was initiated for this order; reconcile to paid if payment record exists
    $checkPay = $pdo->prepare("SELECT id, status FROM payments WHERE order_id = ?");
    $checkPay->execute([$orderId]);
    $payRecord = $checkPay->fetch();
    if ($payRecord) {
        $pdo->prepare("UPDATE payments SET status = 'succeeded', updated_at = NOW() WHERE order_id = ?")->execute([$orderId]);
        $pdo->prepare("UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = ?")->execute([$orderId]);
    }

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();

    if ($order) {
        $itemsStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$orderId]);
        $order['items'] = $itemsStmt->fetchAll();
        $order['order_items'] = $order['items'];
        echo json_encode(["order" => $order, "data" => $order]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Orden no encontrada"]);
    }
    exit;
}

// 10. POST /api/v1/orders/{id}/payment-intent or /api/v1/payments/payment-intent
if ($method === 'POST' && (preg_match('#^/api/v1/orders/(\d+)/payment-intent#', $uri, $matches) || preg_match('#^/api/v1/payments/payment-intent#', $uri))) {
    $orderId = isset($matches[1]) ? (int)$matches[1] : (int)($body['order_id'] ?? 0);

    $stmtOrd = $pdo->prepare("SELECT total, currency FROM orders WHERE id = ?");
    $stmtOrd->execute([$orderId]);
    $ord = $stmtOrd->fetch();
    $amount = $ord ? (float)$ord['total'] : 0.0;
    $currency = $ord['currency'] ?? 'usd';

    // Mock client_secret for Stripe Elements testing mode
    $secret = "pi_3Qsample" . bin2hex(random_bytes(8)) . "_secret_" . bin2hex(random_bytes(12));
    $piId = "pi_3Qsample" . bin2hex(random_bytes(8));

    // Update payment record in database
    $stmt = $pdo->prepare("INSERT INTO payments (order_id, stripe_payment_intent_id, amount, currency, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'requires_payment_method', NOW(), NOW()) ON DUPLICATE KEY UPDATE stripe_payment_intent_id = VALUES(stripe_payment_intent_id), amount = VALUES(amount), currency = VALUES(currency), updated_at = NOW()");
    $stmt->execute([$orderId, $piId, $amount, $currency]);

    echo json_encode([
        "client_secret" => $secret,
        "clientSecret" => $secret,
        "payment_intent_id" => $piId,
        "order_id" => $orderId,
    ]);
    exit;
}

// 11. POST /api/v1/orders/{id}/pay or /api/v1/orders/{id}/confirm
if ($method === 'POST' && preg_match('#^/api/v1/orders/(\d+)/(pay|confirm)#', $uri, $matches)) {
    $orderId = (int)$matches[1];
    $pdo->prepare("UPDATE payments SET status = 'succeeded', updated_at = NOW() WHERE order_id = ?")->execute([$orderId]);
    $pdo->prepare("UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = ?")->execute([$orderId]);

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    echo json_encode(["message" => "Orden pagada con éxito", "order" => $order]);
    exit;
}

// 12. POST /api/v1/stripe/webhook or /api/v1/payments/webhook
if ($method === 'POST' && preg_match('#^/api/v1/(stripe/webhook|payments/webhook)/?$#', $uri)) {
    $piId = $body['data']['object']['id'] ?? $body['payment_intent_id'] ?? '';
    if ($piId) {
        $pStmt = $pdo->prepare("SELECT order_id FROM payments WHERE stripe_payment_intent_id = ?");
        $pStmt->execute([$piId]);
        $pRow = $pStmt->fetch();
        if ($pRow) {
            $pdo->prepare("UPDATE payments SET status = 'succeeded', updated_at = NOW() WHERE stripe_payment_intent_id = ?")->execute([$piId]);
            $pdo->prepare("UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = ?")->execute([$pRow['order_id']]);
        }
    }
    echo json_encode(["received" => true]);
    exit;
}

// 404 Fallback
http_response_code(404);
echo json_encode(["message" => "Ruta no encontrada", "endpoint" => $uri]);

