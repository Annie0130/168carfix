import "./globals.css";

export const metadata = {
  title: "168汽車維修中心 | 電子檢測報告",
  description: "168汽車維修中心 車輛檢測報告查詢系統",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
