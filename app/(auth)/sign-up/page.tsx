"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validation";

export default function SignOut() {
  return (
    <div>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ email: "", password: "", username: "" }}
        onSubmit={(data) => {
          return Promise.resolve({
            success: true,
            data,
          });
        }}
      />
    </div>
  );
}
