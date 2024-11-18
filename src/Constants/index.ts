export const BASE_URL = 'https://6f8e-144-48-129-18.ngrok-free.app'

export const CONTACTS_ITEMS_PER_PAGE = 20

export const GROUP_TYPES = [
    {
        label: "Public",
        value: 'public',
        key: 'public',
    },
    {
        label: "Private",
        value: 'private',
        key: 'private',
    },
]

export const CLOUDNARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/farazcloud/image/upload'

export const FIREBASE_ERROR_CODES = {
    INVALID_CREDENTIAL: 'auth/invalid-credential',
    EMAIL_EXIST: 'auth/email-already-exists',
    USER_NOT_FOUND: 'auth/user-not-found',
    EMAIL_ALREADY_IN_USER: 'auth/email-already-in-use',
    WEAK_PASSWORD: 'auth/weak-password',
    INVALID_EMAIL: 'auth/invalid-email'
}