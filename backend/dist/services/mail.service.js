// src/services/mail.service.ts
import * as brevo from "@getbrevo/brevo";
import { getOtpTemplate } from "../utils/emailTemplates.js"; // Import template tadi
export class MailService {
    apiInstance;
    constructor() {
        this.apiInstance = new brevo.TransactionalEmailsApi();
        this.apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    }
    async sendOTP(email, code) {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Kode Verifikasi Akun Anda";
        sendSmtpEmail.to = [{ email }];
        // Pastikan email sender ini sudah terverifikasi di Brevo
        sendSmtpEmail.sender = { name: "Smart Expense Team", email: "justcall1313@gmail.com" };
        // PERUBAHAN DI SINI:
        // Hapus atau comment bagian textContent
        // sendSmtpEmail.textContent = `Kode OTP Anda adalah: ${code}`;
        // Ganti dengan htmlContent
        sendSmtpEmail.htmlContent = getOtpTemplate(code);
        return await this.apiInstance.sendTransacEmail(sendSmtpEmail);
    }
}
//# sourceMappingURL=mail.service.js.map
