import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createUserList } from "@/server/actions/userList";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { listColourPresets, maxNameLength, minNameLength } from "@/constants";

type SaveListDialogFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const createListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(minNameLength, `Name must be at least ${minNameLength} characters`)
    .max(maxNameLength, `Name must be less than ${maxNameLength} characters`),
});

const SaveListDialogForm = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: SaveListDialogFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createListSchema>>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createListSchema>) => {
    startTransition(async () => {
      try {
        const result = await createUserList({
          name: values.name,
          isPublic: false,
          colour: listColourPresets[0],
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          onOpenChange(false);
          form.reset();
          toast.success("List created successfully");
          onSuccess?.();
        }
      } catch (error) {
        console.error("Error occurred while creating the list:", error);
        toast.error("An error occurred while creating the list");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>You can edit this list later.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>List Name</FormLabel>
                  <FormControl>
                    <Input placeholder="List Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveListDialogForm;
