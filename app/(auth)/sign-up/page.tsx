"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validation";

export default function SignOut() {
  return (
    <div>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ email: "", password: "", username: "", name: "" }}
        onSubmit={signUpWithCredentials}
      />
    </div>
  );
}
