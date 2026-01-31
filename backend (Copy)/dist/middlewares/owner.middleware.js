export class ErrorMiddleware {
    handle = (err, _req, res) => {
        const status = err.status || 500;
        res.status(status).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    };
}
//# sourceMappingURL=owner.middleware.js.map