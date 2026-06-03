# Telesales Helpdesk (Alert Telesale) 🚨

แอปพลิเคชันระบบขอความช่วยเหลือฉุกเฉิน (SOS) แบบ Realtime สำหรับทีม Telesales 
ออกแบบมาในรูปแบบ Desktop Application (Tauri) ที่มีประสิทธิภาพสูง กินทรัพยากรเครื่องน้อย และมีดีไซน์ที่ล้ำสมัย

## 🚀 ฟีเจอร์หลักที่มีในตอนนี้ (Current Features)

1. **ระบบเข้าสู่ระบบแบ่งตามทีม (Team-based Login)**
   - รองรับภาษาไทยในการตั้งชื่อทีม (เช่น "ทีม ก", "สาวๆ")
   - เลือกเข้าใช้งานได้ 2 บทบาท: พนักงาน (Agent) หรือ หัวหน้าทีม (Manager)

2. **ระบบพนักงาน (Agent View)**
   - ปุ่มขอความช่วยเหลือ (SOS Button) ขนาดใหญ่ กดง่าย
   - ส่งสัญญาณฉุกเฉินไปยังฐานข้อมูล Firebase แบบ Realtime ทันที

3. **ระบบหัวหน้าทีม (Manager View)**
   - แดชบอร์ดสรุปสถิติแบบ Realtime (จำนวนแจ้งเตือนทั้งหมด, รายการที่รอช่วยเหลือ, ช่วยเหลือแล้ว)
   - ดูรายการพนักงานที่ขอความช่วยเหลือเรียงตามเวลาจริง
   - ปุ่มกด "รับเรื่อง / ช่วยเหลือแล้ว" (Resolve) เพื่อเคลียร์สถานะ

4. **UI/UX สุดล้ำ (Liquid Emerald Overdrive)**
   - **Hardware-Accelerated CSS:** แอนิเมชันของเหลวบิดตัว (Liquid Morph) และเอฟเฟกต์หยดน้ำมรกต (Liquid Emerald) ขับเคลื่อนด้วย GPU ทำให้ลื่นไหล 60fps โดยไม่กิน CPU
   - **Auto Light/Dark Mode:** เปลี่ยนธีมสว่าง/มืด อัตโนมัติตามระบบปฏิบัติการ (OS)
   - **Immersive Toast Notifications:** ระบบแจ้งเตือนข้อผิดพลาดแบบ Glassmorphism สวยงาม แทนที่หน้าต่าง `window.alert` แบบเก่าทั้งหมด
   - **Pill-shaped Design:** ปุ่มและการ์ดมีความโค้งมน เป็นมิตรต่อน่าใช้งาน พร้อมเอฟเฟกต์ Bouncy เวลาคลิก

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19 + TypeScript + Vite
- **Desktop Framework:** Tauri v2
- **Database:** Firebase Realtime Database
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, Keyframes)
- **Icons:** Lucide React

## 📦 วิธีการติดตั้งและรันโปรเจกต์ (Setup & Run)

**รันโหมดพัฒนา (Development):**
```bash
npm install
npm run tauri dev
```

**สร้างไฟล์ติดตั้ง (Build Installer .exe / .msi):**
```bash
npm run tauri build
```
ไฟล์ติดตั้งจะถูกสร้างขึ้นที่โฟลเดอร์ `src-tauri/target/release/bundle/`

---
*โปรเจกต์นี้ถูกพัฒนาและอัปเดตอย่างต่อเนื่องเพื่อรองรับการทำงานของพนักงาน Telesales ที่ใช้คอมพิวเตอร์สเปคทั่วไป (Low-spec PC)*
