"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteQuestion } from "@/lib/actions/question.action";
import { Button } from "@mdxeditor/editor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditDeleteProps {
  type: "Question" | "Answer";
  itemId: string;
}

export default function EditDelete({ type, itemId }: EditDeleteProps) {
  const router = useRouter();

  async function handleEdit() {
    router.push(`/questions/${itemId}/edit`);
  }
  async function handleDelete() {
    if (type === "Question") {
      // await deleteQuestion({ questionId: itemId });
      await deleteQuestion({ questionId: itemId });
      toast.success("问题已删除");
    } else {
      // await deleteAnswer({ answerId: itemId });
      toast.success("回答已删除");
    }
  }

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${
        type == "Answer" && "gap-0 justify-center"
      }`}
    >
      {type === "Question" && (
        <Image
          src="/icons/edit.svg"
          width={14}
          height={14}
          alt="edit"
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer" asChild>
          <Image src="/icons/trash.svg" width={14} height={14} alt="delete" />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>您确定要这样做吗？</AlertDialogTitle>
            <AlertDialogDescription>
              这个操作不能被撤销。这将永久删除您的
              {type === "Question" ? "问题" : "回答"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">取消</AlertDialogCancel>
            <AlertDialogAction
              className="border-primary-100! bg-primary-500! text-light-800!"
              onClick={handleDelete}
            >
              继续
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
