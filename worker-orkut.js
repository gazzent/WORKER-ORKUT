// DIBUAT OLEH UPDATE BY PT RAJA SERVER PREMIUM (Unofficial QRIS Generator)
const swaggerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation - QRIS Generator (Unofficial)</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        deepLinking: true
      });
    };
  </script>
</body>
</html>
`;

// ==================== SWAGGER JSON ====================
// DIBUAT OLEH UPDATE BY PT RAJA SERVER PREMIUM (Unofficial API)
const swaggerJSON = {
  openapi: "3.0.0",
  info: {
    title: "QRIS Generator API (Unofficial)",
    description: "API untuk generate QRIS dengan QRIS string kustom\n\n**Endpoint:**\n- **/api/qris** - Generate QRIS (JSON atau PNG)\n- **/api/orkut/*** - Endpoints for Orderkuota integration",
    version: "1.0.0"
  },
  servers: [
    {
      url: "/",
      description: "Local Server"
    }
  ],
  paths: {
    "/api/qris": {
      get: {
        summary: "Generate QRIS (JSON atau PNG)",
        description: "Generate QRIS dengan QRIS string Anda sendiri\n\n**Parameter:**\n- `qris_string` (wajib): QRIS string Anda\n- `amount` (wajib): Nominal pembayaran\n- `format` (opsional): `json` (default) atau `png`\n\n**Contoh:**\n- `/api/qris?qris_string=xxx&amount=1000` → JSON\n- `/api/qris?qris_string=xxx&amount=1000&format=png` → Gambar PNG",
        parameters: [
          {
            name: "qris_string",
            in: "query",
            description: "QRIS string Anda (wajib)",
            required: true,
            schema: {
              type: "string",
              example: "00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214158171648691720303UMI51440014ID.CO.QRIS.WWW0215ID20253746163520303UMI5204541153033605802ID5922TOKO ANDA6809JAKARTA61051234562070703A016304ABCD"
            }
          },
          {
            name: "amount",
            in: "query",
            description: "Nominal pembayaran (akan ditambah random 1-99)",
            required: true,
            schema: {
              type: "integer",
              minimum: 1000,
              default: 50000
            }
          },
          {
            name: "format",
            in: "query",
            description: "Format response: json (default) atau png",
            required: false,
            schema: {
              type: "string",
              enum: ["json", "png"],
              default: "json"
            }
          }
        ],
        responses: {
          200: {
            description: "QRIS berhasil digenerate",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    merchant: { type: "string" },
                    location: { type: "string" },
                    amount: { type: "integer" },
                    amount_original: { type: "integer" },
                    random_add: { type: "integer" },
                    reference: { type: "string" },
                    qr_string: { type: "string" },
                    image_data: { type: "string", description: "Base64 image PNG" }
                  }
                }
              },
              "image/png": {
                description: "Langsung gambar PNG"
              }
            }
          },
          400: {
            description: "Parameter tidak valid"
          },
          500: {
            description: "Internal server error"
          }
        }
      }
    },
    "/api/orkut/login": {
      post: {
        tags: ["Orderkuota (Unofficial)"],
        summary: "Login Step 1 - Request OTP",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string", example: "08123456789" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: { 
          200: { description: "OTP terkirim" },
          400: { description: "Request tidak valid" }
        }
      }
    },
    "/api/orkut/verify-otp": {
      post: {
        tags: ["Orderkuota (Unofficial)"],
        summary: "Login Step 2 - Verifikasi OTP",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["username", "otp"],
                properties: {
                  username: { type: "string", example: "08123456789" },
                  otp: { type: "string", example: "123456" }
                }
              }
            }
          }
        },
        responses: { 
          200: { description: "Token didapatkan" },
          400: { description: "OTP tidak valid" }
        }
      }
    },
    "/api/orkut/qris-history": {
      post: {
        tags: ["Orderkuota (Unofficial)"],
        summary: "Cek Mutasi QRIS",
        description: "Menampilkan history transaksi QRIS berdasarkan jenis (masuk/keluar)",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["USER_ORKUT", "TOKEN_ORKUT"],
                properties: {
                  USER_ORKUT: { 
                    type: "string", 
                    description: "Username Orkut",
                    example: "ariXXXX" 
                  },
                  TOKEN_ORKUT: { 
                    type: "string", 
                    description: "Token akses (format: merchant_id:token)",
                    example: "1540779:aRe0G9Els1AXIgUoOqPBfukV3yXXXXX" 
                  },
                  jenis: { 
                    type: "string", 
                    enum: ["kredit", "debit"],
                    description: "Jenis transaksi (opsional, kosongkan untuk semua)",
                    example: "kredit"
                  },
                  page: {
                    type: "string",
                    description: "Halaman (opsional, default: 1)",
                    example: "1"
                  },
                  dari_tanggal: {
                    type: "string",
                    description: "Tanggal awal filter (opsional)",
                    example: ""
                  },
                  ke_tanggal: {
                    type: "string",
                    description: "Tanggal akhir filter (opsional)",
                    example: ""
                  },
                  keterangan: {
                    type: "string",
                    description: "Filter keterangan (opsional)",
                    example: ""
                  },
                  jumlah: {
                    type: "string",
                    description: "Filter jumlah (opsional)",
                    example: ""
                  }
                }
              }
            }
          }
        },
        responses: { 
          200: { description: "Data mutasi QRIS" },
          400: { description: "Parameter tidak lengkap" }
        }
      }
    },
    "/api/orkut/qris-withdraw": {
      post: {
        tags: ["Orderkuota (Unofficial)"],
        summary: "Tarik Saldo QRIS",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["USER_ORKUT", "TOKEN_ORKUT", "amount"],
                properties: {
                  USER_ORKUT: { type: "string", example: "ariXXXX" },
                  TOKEN_ORKUT: { type: "string", example: "1540779:aRe0G9Els1AXIgUoOqPBfukV3yXXXXX" },
                  amount: { type: "string", example: "1000" }
                }
              }
            }
          }
        },
        responses: { 
          200: { description: "Penarikan diproses" },
          400: { description: "Saldo tidak cukup / parameter invalid" }
        }
      }
    }
  }
};

// DIBUAT OLEH UPDATE BY PT RAJA SERVER PREMIUM (Unofficial QRIS Generator)
function calculateCRC16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= (data.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
            crc &= 0xFFFF;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// DIBUAT OLEH UPDATE BY PT RAJA SERVER PREMIUM (Unofficial QRIS Generator)
function generateQRString(baseQr, amount) {
    if (!baseQr || baseQr.length < 50) {
        throw new Error("QRIS string tidak valid");
    }
    
    let qrisBase = baseQr.length > 4 ? baseQr.substring(0, baseQr.length - 4) : baseQr;
    
    if (qrisBase.includes("010211")) {
        qrisBase = qrisBase.replace("010211", "010212");
    }
    
    const nominalStr = amount.toString();
    const nominalTag = `54${nominalStr.length.toString().padStart(2, '0')}${nominalStr}`;
    
    const insertPosition = qrisBase.indexOf("5802ID");
    if (insertPosition === -1) {
        throw new Error("Format QRIS tidak valid: tidak ditemukan 5802ID");
    }
    
    const qrisWithNominal = qrisBase.substring(0, insertPosition) + nominalTag + qrisBase.substring(insertPosition);
    const checksum = calculateCRC16(qrisWithNominal);
    
    return qrisWithNominal + checksum;
}

function extractQRISInfo(qrisString) {
    let merchant = "Unknown";
    let location = "Unknown";
    
    const merchantMatch = qrisString.match(/59(\d{2})(.{0,25})/);
    if (merchantMatch && merchantMatch[2]) {
        merchant = merchantMatch[2].trim();
    }
    
    const locationMatch = qrisString.match(/60(\d{2})(.{0,15})/);
    if (locationMatch && locationMatch[2]) {
        location = locationMatch[2].trim();
    }
    
    return { merchant, location };
}

async function generateQRImage(text) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}&ecc=H&margin=4`;
    const response = await fetch(qrApiUrl);
    if (!response.ok) throw new Error("Gagal generate QR");
    return await response.arrayBuffer();
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

const API_BASE = "https://app.orderkuota.com/api/v2";
const HEADERS_BASE = {
  "User-Agent": "okhttp/5.3.2",
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Safe-Device": "TRUE"
};
const APP_PARAMS = {
  app_version_name: "26.06.27",
  app_version_code: "260627",
  app_reg_id: "c0kJIbm4SA6gDFtD4C72Fc:APA91bGM94YX75ZlGfdAglNLgT5Igjpp-lTZbg8aDRSFRtIbMcAkkZpVuDE1JhV0xV2IAzLZedgb_TOvPIof-aWeyacmO6_9QbbnQxSDZSapLKtedM88QcU",
  phone_uuid: "c0kJIbm4SA6gDFtD4C72Fc",
  phone_model: "23108RN04Y",
  phone_android_version: "15",
  ui_mode: "light"
};

// QRIS Generator Unofficial API - DIBUAT OLEH UPDATE BY PT RAJA SERVER PREMIUM
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // Handle OPTIONS
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        // Swagger UI
        if (request.method === "GET" && (path === "/" || path === "/docs" || path === "/swagger")) {
            return new Response(swaggerHTML, {
                headers: { "Content-Type": "text/html; charset=UTF-8" }
            });
        }
        
        // Swagger JSON
        if (request.method === "GET" && path === "/swagger.json") {
            return new Response(JSON.stringify(swaggerJSON), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
        
        // ========== ENDPOINT UTAMA /api/qris ==========
        if (request.method === "GET" && path === "/api/qris") {
            try {
                const qrisString = url.searchParams.get('qris_string');
                const amount = url.searchParams.get('amount');
                const format = url.searchParams.get('format') || 'json';
                
                if (!qrisString) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Parameter qris_string wajib diisi'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                if (!amount) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Parameter amount wajib diisi'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                let nominal = parseInt(amount);
                if (isNaN(nominal) || nominal <= 0) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Amount harus angka positif'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                const randomAdd = Math.floor(Math.random() * 99) + 1;
                nominal = nominal + randomAdd;
                
                const finalQrString = generateQRString(qrisString, nominal);
                const imageBuffer = await generateQRImage(finalQrString);
                
                if (format.toLowerCase() === 'png') {
                    return new Response(imageBuffer, {
                        headers: {
                            'Content-Type': 'image/png',
                            'Content-Disposition': `inline; filename="qris-${nominal}.png"`,
                            'Cache-Control': 'no-cache',
                            ...corsHeaders
                        }
                    });
                }
                
                const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
                const imageData = `data:image/png;base64,${base64}`;
                const info = extractQRISInfo(qrisString);
                
                return new Response(JSON.stringify({
                    success: true,
                    merchant: info.merchant,
                    location: info.location,
                    amount: nominal,
                    amount_original: parseInt(amount),
                    random_add: randomAdd,
                    reference: Date.now().toString(),
                    qr_string: finalQrString,
                    image_data: imageData
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
                
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
        }
        
        // ========== ORKUT ENDPOINTS ==========
        if (request.method === "POST") {
            const contentType = request.headers.get("content-type") || "";
            let data = {};
            
            if (contentType.includes("application/json")) {
                data = await request.json();
            } else {
                const formData = await request.formData();
                data = Object.fromEntries(formData.entries());
            }
            
            // Route ke handler yang sesuai
            if (path === "/api/orkut/login") {
                return loginOrkut(data.username, data.password);
            }
            if (path === "/api/orkut/verify-otp") {
                return verifyOtp(data.username, data.otp);
            }
            if (path === "/api/orkut/qris-history") {
                return getQrisHistory(data);
            }
            if (path === "/api/orkut/qris-withdraw") {
                return withdrawQris(data);
            }
        }
        
        return new Response("Not Found", { status: 404 });
    }
};

// ==================== ORKUT HANDLERS ====================
async function loginOrkut(username, password) {
    if (!username || !password) {
        return new Response(JSON.stringify({ success: false, message: "username/password wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    const payload = new URLSearchParams({ username, password, ...APP_PARAMS });
    return proxyRequest(`${API_BASE}/login`, payload);
}

async function verifyOtp(username, otp) {
    if (!username || !otp) {
        return new Response(JSON.stringify({ success: false, message: "username/otp wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    const payload = new URLSearchParams({ username, password: otp, ...APP_PARAMS });
    return proxyRequest(`${API_BASE}/login`, payload);
}

async function generateSignature(token, timestamp, body) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(token),
        { name: "HMAC", hash: { name: "SHA-512" } },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp + body));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getQrisHistory(data) {
    const { USER_ORKUT, TOKEN_ORKUT, jenis = "", page = "1", dari_tanggal = "", ke_tanggal = "", keterangan = "", jumlah = "" } = data;
    
    if (!USER_ORKUT || !TOKEN_ORKUT) {
        return new Response(JSON.stringify({ success: false, message: "USER_ORKUT/TOKEN_ORKUT wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    const merchantId = TOKEN_ORKUT.split(":")[0];
    const ts = Date.now().toString();
    
    const payload = new URLSearchParams();
    payload.append("app_reg_id", APP_PARAMS.app_reg_id);
    payload.append("phone_uuid", APP_PARAMS.phone_uuid);
    payload.append("requests[qris_history][jenis]", jenis);
    payload.append("phone_model", APP_PARAMS.phone_model);
    payload.append("requests[qris_history][keterangan]", keterangan);
    payload.append("requests[qris_history][jumlah]", jumlah);
    payload.append("request_time", ts);
    payload.append("phone_android_version", APP_PARAMS.phone_android_version);
    payload.append("app_version_code", APP_PARAMS.app_version_code);
    payload.append("auth_username", USER_ORKUT);
    payload.append("requests[qris_history][page]", page);
    payload.append("auth_token", TOKEN_ORKUT);
    payload.append("app_version_name", APP_PARAMS.app_version_name);
    payload.append("ui_mode", APP_PARAMS.ui_mode);
    payload.append("requests[qris_history][dari_tanggal]", dari_tanggal);
    payload.append("requests[0]", "account");
    payload.append("requests[qris_history][ke_tanggal]", ke_tanggal);
    
    const bodyStr = payload.toString();
    const signature = await generateSignature(TOKEN_ORKUT, ts, bodyStr);
    
    const headers = {
        "Authorization": `Bearer ${btoa(TOKEN_ORKUT)}`,
        "X-Safe-Device": "TRUE",
        "Signature": signature,
        "Timestamp": ts,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "okhttp/5.3.2"
    };
    
    try {
        const resp = await fetch(`${API_BASE}/qris/mutasi/${merchantId}`, {
            method: "POST",
            headers,
            body: bodyStr
        });
        
        return new Response(resp.body, { 
            status: resp.status, 
            headers: { "Content-Type": resp.headers.get("content-type") || "application/json" }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Fetch failed", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

async function withdrawQris(data) {
    const { USER_ORKUT, TOKEN_ORKUT, amount } = data;
    
    if (!USER_ORKUT || !TOKEN_ORKUT) {
        return new Response(JSON.stringify({ success: false, message: "USER_ORKUT/TOKEN_ORKUT wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    if (!amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
        return new Response(JSON.stringify({ success: false, message: "amount harus angka positif" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    const ts = Date.now().toString();
    
    const payload = new URLSearchParams();
    payload.append("request_time", ts);
    payload.append("app_reg_id", APP_PARAMS.app_reg_id);
    payload.append("phone_android_version", APP_PARAMS.phone_android_version);
    payload.append("app_version_code", APP_PARAMS.app_version_code);
    payload.append("phone_uuid", APP_PARAMS.phone_uuid);
    payload.append("auth_username", USER_ORKUT);
    payload.append("requests[qris_withdraw][amount]", amount);
    payload.append("auth_token", TOKEN_ORKUT);
    payload.append("app_version_name", APP_PARAMS.app_version_name);
    payload.append("ui_mode", APP_PARAMS.ui_mode);
    payload.append("phone_model", APP_PARAMS.phone_model);
    
    const bodyStr = payload.toString();
    const signature = await generateSignature(TOKEN_ORKUT, ts, bodyStr);
    
    const headers = {
        "Authorization": `Bearer ${btoa(TOKEN_ORKUT)}`,
        "X-Safe-Device": "TRUE",
        "Signature": signature,
        "Timestamp": ts,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "okhttp/5.3.2"
    };
    
    try {
        const resp = await fetch(`${API_BASE}/get`, {
            method: "POST",
            headers,
            body: bodyStr
        });
        
        return new Response(resp.body, { 
            status: resp.status, 
            headers: { "Content-Type": resp.headers.get("content-type") || "application/json" }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Fetch failed", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

async function proxyRequest(url, payload) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: HEADERS_BASE,
            body: payload
        });
        return new Response(response.body, {
            status: response.status,
            headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: "Fetch failed",
            error: err.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
