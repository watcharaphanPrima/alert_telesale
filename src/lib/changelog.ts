export interface ReleaseNote {
  version: string;
  date: string;
  features?: string[];
  fixes?: string[];
}

export const CHANGELOG: ReleaseNote[] = [
  {
    version: '0.1.22',
    date: '2026-06-22',
    features: [
      'เพิ่มระบบ Patch Notes แสดงข้อมูลการอัปเดตเมื่อมีเวอร์ชันใหม่',
      'ระบบสถานะออนไลน์คล้าย Discord (หัวหน้าสามารถเห็นได้ว่าใครกำลังเปิดแอปอยู่)',
      'ระบบ "เรียกพนักงาน" หัวหน้าสามารถกดส่งสัญญาณเรียกพนักงานรายบุคคล หรือเรียกทุกคนพร้อมกันได้'
    ],
    fixes: [
      'ปรับปรุงโครงสร้างโค้ดและย้าย Logic เชื่อมต่อ Firebase เพื่อให้ประสิทธิภาพสูงขึ้น'
    ]
  },
  {
    version: '0.1.21',
    date: '2026-06-18',
    features: [
      'เพิ่ม Effect เมื่อชี้เมาส์: เอาสไตล์พื้นหลังแบบบังคับออก เพื่อให้ CSS ทำงานและแสดง Effect ได้อย่างสวยงาม'
    ]
  }
];

// ได้เวอร์ชันล่าสุดเสมอ (ตัวแรกของ Array)
export const LATEST_RELEASE = CHANGELOG[0];
