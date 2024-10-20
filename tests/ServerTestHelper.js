const ServerTestHelper = {
    async getCredential(server){
        const requestPayload = {
            username: 'dicoding',
            password: 'secret',
        };
    
        // Action
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'dicoding',
              password: 'secret',
              fullname: 'Dicoding Indonesia',
            },
        });
    
        const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: requestPayload,
        });

        const responseJson = JSON.parse(response.payload);

        return {token:responseJson.data.accessToken};
    }
}

module.exports = ServerTestHelper;