export const middleware = (options) => async (req, res, next) => {
    try {
        let data;
        let { schema } = options;
        if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
            data = req.body;
        } else {
            data = req.params;
        }
        const { error } = schema.validate(data);
        if (error) {
            console.log("error", error);
        } else {
            next()
        }
    } catch (error) {
        console.log("Error", error);
        next(error)
    }
}
