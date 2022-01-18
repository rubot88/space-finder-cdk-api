exports.main = async(event, ctx) => {
    return {
        statusCode: 200,
        body: "Hello from lambda!",
    };
};