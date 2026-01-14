 1. System Infrastructure (ภาพรวมระบบ)นี่คือการจัดวางเครื่องมือที่มึงใช้จำลองสถานการณ์จริงFrontend (Host Machine): รันบนเบราว์เซอร์เครื่องมึง (Windows/Mac) ใช้ HTML/CSS/JS คุยกับหลังบ้านผ่าน NetworkBackend (Virtual Machine): เป็น Ubuntu Server รัน Node.js อยู่ที่ IP 192.168.56.101Database (SQLite): เก็บเป็นไฟล์ library.db อยู่ในเครื่อง VM เลย ไม่หายเมื่อปิดโปรแกรม 
2. Backend 3-Layer Architecture (โครงสร้างโค้ด)มึงใช้โครงสร้างแบบ Separation of Concerns ซึ่งเป็นมาตรฐานสากล แบ่งหน้าที่กันชัดเจน:เลเยอร์ (Layer)ไฟล์หลักของมึงหน้าที่PresentationbookController.jsรับคำสั่งจากหน้าเว็บ (Request) และส่งผลลัพธ์กลับไป (Response)Business LogicbookService.jsสะพานเชื่อม: จัดการตรรกะเบื้องหลัง (จุดที่มึงแก้ Error เมื่อคืน)Data AccessbookRepository.jsใช้ SQL คุยกับไฟล์ library.db ผ่าน connection.js
3. Folder Structure (โครงสร้างโฟลเดอร์)เวลาพรีเซนต์ให้เปิดหน้านี้ใน VS Code แล้วโชว์ความเป็นระเบียบแบบนี้:PlaintextMIDTERM-BONUS-67543210071-6
```bash
├── backend/
│   ├── src/
│   │   ├── presentation/      # (1) Controller & Routes
│   │   ├── business/          # (2) Services (Logic)
│   │   ├── data/              # (3) Repository & Database Connection
│   │   └── server.js          # จุดเริ่มรันระบบ (EntryPoint)
│   ├── API_TESTS.md           # คู่มือทดสอบ API
│   └── package.json           # รายการ Library (sqlite3, express, cors)
└── frontend/
    ├── css/                   # สไตล์หน้าเว็บ (Light/Dark Mode)
    ├── js/                    # api.js และ app.js
    └── index.html             # โครงสร้างหน้า Dashboard
```
🔄 4. Data Flow (การไหลของข้อมูล)อธิบายท่า Update (จุดที่ยากที่สุดของมึง) ให้เป็นขั้นตอนแบบนี้:Frontend: มึงกดปุ่ม Save หน้าเว็บส่งคำสั่ง PUT ไปหา BackendRoute/Controller: รับข้อมูลหนังสือจากมึงมาService: (ที่มึงแก้บั๊กสำเร็จ) รับข้อมูลมาตรวจสอบความถูกต้องRepository: ใช้ SQL UPDATE เพื่อบันทึกชื่อหนังสือใหม่ลงในไฟล์ .dbDatabase: ส่งสถานะ Success กลับไปหน้าเว็บเพื่อโชว์ Toast สีเขียว!