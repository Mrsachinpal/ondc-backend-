class HealthController {
    async health(req, res) {
        try {
            console.log("Server is running");
            res.status(200).json({
                message: "Health is ok",
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }
}

export default new HealthController();