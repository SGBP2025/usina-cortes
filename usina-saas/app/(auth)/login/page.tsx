import { AuthForm } from "@/components/organisms/AuthForm";
import { loginAction } from "@/app/(auth)/login/actions";

export default function LoginPage() {
  return <AuthForm mode="login" action={loginAction} />;
}
