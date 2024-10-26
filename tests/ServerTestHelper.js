const ServerTestHelper = {
    // Generate Random user and login it to get token
    async getCredential(server){
        const requestPayload = {
            username: Math.random().toString(36).substring(8, 17),
            password: 'secret',
            fullname: 'Random User'
        };

        // Register User
        const newUserResponse = await server.inject({
            method: 'POST',
            url: '/users',
            payload: requestPayload,
        });
    
        // Login as User
        const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: requestPayload,
        });

        const responseJson = JSON.parse(response.payload).data;
        const responseUser = JSON.parse(newUserResponse.payload).data.addedUser;

        return {token:responseJson.accessToken, user_id: responseUser.id};
    }
}

module.exports = ServerTestHelper;