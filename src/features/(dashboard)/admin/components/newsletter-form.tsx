"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Send, Code } from "lucide-react";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-50 animate-pulse rounded-md border border-gray-200" />
});

import "react-quill-new/dist/quill.snow.css";

const newsletterSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    body: z.string().min(20, "Message body must be at least 20 characters"),
    recipients: z.array(z.string()).min(1, "Select at least one recipient group"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<NewsletterFormValues>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            subject: "",
            body: "",
            recipients: [],
        },
    });

    const onSubmit = async (data: NewsletterFormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Newsletter Data:", data);
        setIsSubmitting(false);
        toast.success("Newsletter sent successfully (Simulated)");
        form.reset();
    };

    const recipientOptions = [
        { id: "students", label: "All Students" },
        { id: "mentors", label: "All Mentors" },
        { id: "premium", label: "Premium Students Only" },
    ];

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean']
        ],
    }), []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Subject Line</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the newsletter subject..." {...field} className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="recipients"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-gray-700 font-medium">Recipients</FormLabel>
                                    <FormDescription>
                                        Select the groups who will receive this update.
                                    </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {recipientOptions.map((option) => (
                                        <FormField
                                            key={option.id}
                                            control={form.control}
                                            name="recipients"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={option.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(option.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, option.id])
                                                                        : field.onChange(
                                                                              field.value?.filter(
                                                                                  (value) => value !== option.id
                                                                              )
                                                                          );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer w-full">
                                                            {option.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                                    Message Content
                                    <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Code className="h-2.5 w-2.5" />
                                        Advanced Editor
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <div className="prose-editor">
                                        <ReactQuill 
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={modules}
                                            className="bg-gray-50 rounded-md overflow-hidden min-h-[300px]"
                                            placeholder="Write your update here... Use code-blocks or formatting as needed."
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 h-11 gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {isSubmitting ? "Sending..." : "Send Newsletter"}
                        </Button>
                    </div>
                </form>
            </Form>

            <style jsx global>{`
                .prose-editor .ql-container {
                    min-height: 250px;
                    font-size: 16px;
                }
                .prose-editor .ql-toolbar {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    background: #f9fafb;
                    border-color: #e5e7eb;
                }
                .prose-editor .ql-container {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    border-color: #e5e7eb;
                }
                .prose-editor .ql-editor.ql-blank::before {
                    color: #9ca3af;
                }
                .prose-editor .ql-snow .ql-stroke {
                    stroke: #4b5563;
                }
            `}</style>
        </div>
    );
}
