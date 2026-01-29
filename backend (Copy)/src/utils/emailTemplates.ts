// src/utils/emailTemplates.ts

export const getOtpTemplate = (code: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #121212; font-family: Arial, sans-serif; color: #ffffff;">
  
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">Smart Expense Tracker</h2>
    </div>

    <div style="background-color: #1e1e1e; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
      
      <p style="font-size: 16px; color: #cccccc; margin-bottom: 20px;">Halo Pengguna,</p>
      <p style="font-size: 16px; color: #cccccc; margin-bottom: 30px;">Berikut adalah kode verifikasi email Anda:</p>

      <div style="background-color: #2c2c2c; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 0; font-weight: bold;">${code}</h1>
        <p style="color: #888888; font-size: 14px; margin-top: 10px; margin-bottom: 0;">Kode ini berlaku selama 5 menit.</p>
      </div>

      <div style="font-size: 13px; color: #888888; line-height: 1.5;">
        <p style="margin-bottom: 5px;">* Kode verifikasi ini hanya digunakan untuk pendaftaran akun.</p>
        <p style="margin-bottom: 5px;">* Abaikan email ini jika Anda tidak merasa melakukan permintaan ini.</p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #555555;">
      <p>Email ini dikirim secara otomatis oleh sistem Smart Expense Tracker.</p>
      <p>&copy; 2026 Smart Expense Tracker. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `;
};