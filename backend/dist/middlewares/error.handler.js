export class ErrorHandler {
    // WAJIB 4 parameter: err, req, res, next
    handle = (err, res) => {
        const status = err.status || 500;
        // Format response sesuai API Contract
        res.status(status).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    };
}
//# sourceMappingURL=error.handler.js.map