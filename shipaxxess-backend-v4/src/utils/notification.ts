import { Model } from "@lib/model"
import { notifications } from "@schemas/notifications"



export interface INOtifcation {
    title: string
    description: string
    user_id: number
    uuid: string
}
export const SaveNotifcaiton = async (db: D1Database, notification: INOtifcation) => {

    try {
        const model = new Model(db)
        const data = await model.insert(notifications, { ...notification, })
        console.log("Notifcation added", data)

        return data
    } catch (error: any) {
        console.log("Error", error)
        return { error: error.message }
    }
}

async function getAccessToken(ENCODED_SERVICE_ACCOUNT_KEY: string) {
    const serviceAccountKey = JSON.parse(atob(ENCODED_SERVICE_ACCOUNT_KEY))
    const tokenUrl = 'https://oauth2.googleapis.com/token'
    const now = Math.floor(Date.now() / 1000)
    const claims = {
        iss: serviceAccountKey.client_email,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: tokenUrl,
        exp: now + 3600,
        iat: now
    }

    const header = {
        alg: 'RS256',
        typ: 'JWT'
    }

    const base64Header = btoa(JSON.stringify(header))
    const base64Claims = btoa(JSON.stringify(claims))
    const signatureInput = `${base64Header}.${base64Claims}`

    const encoder = new TextEncoder()
    const encodedInput = encoder.encode(signatureInput)
    const key = await crypto.subtle.importKey(
        'jwk',
        serviceAccountKey.private_key,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        encodedInput
    )

    const base64Signature = btoa(String.fromCharCode.apply(null, new Uint8Array(signature)))
    const jwt = `${signatureInput}.${base64Signature}`

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    })

    const data: any = await response.json()
    return data.access_token
}