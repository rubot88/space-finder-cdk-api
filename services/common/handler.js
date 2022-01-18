exports.main = async(event, ctx) => {
    const responseBody = {
        message: "Hello from lambda!"
    }
    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
};