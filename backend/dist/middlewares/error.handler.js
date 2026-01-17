export class ErrorHandler {
    // Ubah jadi STATIC biar gampang dipanggil tanpa 'new ErrorHandler()'
    static handle(err, _req, res, _next // <--- INI WAJIB ADA!
    ) {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        // Opsional: Log error di console server biar developer tau (jangan dimakan sendiri)
        if (status === 500) {
            console.error("🔥 SERVER ERROR:", err);
        }
        res.status(status).json({
            success: false,
            message: message
        });
    }
}
//# sourceMappingURL=error.handler.js.map