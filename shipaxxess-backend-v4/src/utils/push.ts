


interface ServiceAccountKey {
    client_email: string;
    private_key: string;
}

interface Message {
    title: string;
    body: string;
}

export const sendPushNotification = async (serviceAccountKey: ServiceAccountKey, token: string, message: Message) => {
    try {
        const fcmMessage = {
            message: {
                token: token,
                notification: {
                    title: message.title,
                    body: message.body
                }
            }
        };

        const accessToken = await getAccessToken(serviceAccountKey);
        const response = await fetch('https://fcm.googleapis.com/v1/projects/your-project-id/messages:send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(fcmMessage)
        });

        const data = await response.json();
        console.log('FCM Response:', data);
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

async function getAccessToken(serviceAccountKey: ServiceAccountKey): Promise<string> {
    try {
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: serviceAccountKey.client_email,
            scope: 'https://www.googleapis.com/auth/firebase.messaging',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600, // Token expires in 1 hour
            iat: now
        };

        const encodedHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
        const encodedPayload = btoa(JSON.stringify(payload));
        const toSign = `${encodedHeader}.${encodedPayload}`;

        const encoder = new TextEncoder();
        const signature = await crypto.subtle.sign(
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: { name: 'SHA-256' }
            },
            await crypto.subtle.importKey(
                'pkcs8',
                new Uint8Array(serviceAccountKey.private_key.match(/.{1,64}/g).map((x) => parseInt(x, 16))).buffer,
                { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
                true,
                ['sign']
            ),
            encoder.encode(toSign)
        );

        const signed = new Uint8Array(signature);
        const signed_b64 = btoa(String.fromCharCode.apply(null, signed));
        const jwt = `${toSign}.${signed_b64}`;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(jwt)}`
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}
