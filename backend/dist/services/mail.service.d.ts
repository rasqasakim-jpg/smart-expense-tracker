import * as brevo from '@getbrevo/brevo';
export declare class MailService {
    private apiInstance;
    constructor();
    sendOTP(email: string, code: string): Promise<{
        response: import("http").IncomingMessage;
        body: brevo.CreateSmtpEmail;
    }>;
}
//# sourceMappingURL=mail.service.d.ts.map