import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { redirect } from "next/navigation";

export default async function AskAQuestion() {
  const session = await auth();
  if (!session) {
    return redirect("/sign-in");
  }
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">提问</h1>
      <div className="mt-9">
        <QuestionForm />
      </div>
    </div>
  );
}
