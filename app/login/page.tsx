import LoginForm from "./LoginForm";

function hasGoogleCredentials() {
  const id = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
  return Boolean(id && secret) && !/replace|your[-_ ]|placeholder/i.test(`${id} ${secret}`);
}

export default function LoginPage() {
  return <LoginForm googleConfigured={hasGoogleCredentials()} />;
}
