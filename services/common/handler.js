exports.main = async(event) => {
    console.log('event', event);
    const responseBody = {
        message: "Hello from lambda!",
    };
    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
};