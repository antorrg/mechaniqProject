import dotenv from 'dotenv'

const ENV_FILES = {
  production: '.env',
  development: '.env.development',
  test: '.env.test'
} as const
type Environment = keyof typeof ENV_FILES

const NODE_ENV = (process.env.NODE_ENV as Environment) ?? 'production'

dotenv.config({ path: ENV_FILES[NODE_ENV] })

const getNumberEnv = (value: string | undefined, defaultValue: number): number => {
  return parseInt(value ?? defaultValue.toString(), 10)
}
const getStringEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    if (defaultValue === undefined) {
      throw new Error(`❌ Missing required env var: ${key}`);
    }
    return defaultValue;
  }
  return value;
};

const envConfig = {
  Port: getNumberEnv(process.env.PORT, 3000),
  Status: NODE_ENV,
  DatabaseUrl: getStringEnv('DATABASE_URL'),
}

export default envConfig
