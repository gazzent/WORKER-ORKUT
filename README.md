# QRIS Generator & Orderkuota API (Unofficial)

Base URL: `https://api-orkut.shadowsvpn.xyz`

Swagger: https://api-orkut.shadowsvpn.xyz

## ENDPOINTS https://api-orkut.shadowsvpn.xyz

### 1. QRIS Generator
`GET /api/qris`

**Parameter:**
- `qris_string` (wajib)
- `amount` (wajib) 
- `format` (opsional: json/png)

**Contoh:**
```bash
curl -X GET "https://api-orkut.shadowsvpn.xyz//api/qris?qris_string=00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214158171648691720303UMI51440014ID.CO.QRIS.WWW0215ID20253746163520303UMI5204541153033605802ID5922TOKO%20ANDA6809JAKARTA61051234562070703A016304ABCD&amount=50000"
```

```bash
curl -X GET "https://api-orkut.shadowsvpn.xyz//api/qris?qris_string=00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214158171648691720303UMI51440014ID.CO.QRIS.WWW0215ID20253746163520303UMI5204541153033605802ID5922TOKO%20ANDA6809JAKARTA61051234562070703A016304ABCD&amount=50000&format=png" --output qris.png
```

### 2. Orderkuota (Unofficial)

**Login Step 1**
```bash
curl -X POST "https://api-orkut.shadowsvpn.xyz/api/orkut/login" -d "username=08123456789&password=password123"
```

**Login Step 2**
```bash
curl -X POST "[https://api-orkut.shadowsvpn.xyz/api/orkut/verify-otp" -d "username=08123456789&otp=123456"
```

**Cek Mutasi**
```bash
curl -X POST "https://api-orkut.shadowsvpn.xyz/api/orkut/qris-history" -d "username=08123456789&token=merchant_id:token_string&jenis=masuk"
```

**Tarik Saldo**
```bash
curl -X POST "https://api-orkut.shadowsvpn.xyz/api/orkut/qris-withdraw" -d "username=08123456789&token=merchant_id:token_string&amount=100000"
```

---

⚠️ **Catatan:** Orderkuota API tidak resmi (unofficial), gunakan bijak.

Dibuat oleh Dragon Store
