export const apiUrl = import.meta.env.VITE_API_URL;
export const deployEnv = import.meta.env.VITE_DEPLOY_ENV;

export const minioUrl = `${import.meta.env.VITE_MINIO_URL}/${deployEnv}/`;
