import { AuthForm } from "@/components/organisms/AuthForm";
import { registerAction } from "@/app/(auth)/register/actions";

export default function RegisterPage() {
  return <AuthForm mode="register" action={registerAction} />;
}
