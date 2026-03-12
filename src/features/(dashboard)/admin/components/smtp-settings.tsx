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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Save, Globe, Server, ShieldCheck } from "lucide-react";
import { useState } from "react";

const smtpSchema = z.object({
    deliveryMethod: z.enum(["smtp", "api"]),
    // SMTP Fields
    host: z.string().optional(),
    port: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    encryption: z.enum(["none", "ssl", "tls"]).optional(),
    // API Fields
    apiProvider: z.string().optional(),
    apiKey: z.string().optional(),
    // Common Fields
    senderEmail: z.string().email("Invalid email address"),
    senderName: z.string().min(2, "Sender name too short"),
});

type SmtpFormValues = z.infer<typeof smtpSchema>;

export function SMTPSettings() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SmtpFormValues>({
        resolver: zodResolver(smtpSchema),
        defaultValues: {
            deliveryMethod: "smtp",
            host: "",
            port: "587",
            username: "",
            password: "",
            encryption: "tls",
            apiProvider: "zoho",
            apiKey: "",
            senderEmail: "noreply@dentispark.com",
            senderName: "DentiSpark Team",
        },
    });

    const deliveryMethod = form.watch("deliveryMethod");

    const onSubmit = async (data: SmtpFormValues) => {
        setIsSubmitting(true);
        // Simulate API call to save settings
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("SMTP Settings:", data);
        setIsSubmitting(false);
        toast.success("Email settings saved successfully");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary-600" />
                            Delivery Method
                        </h3>
                        <FormField
                            control={form.control}
                            name="deliveryMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col md:flex-row gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 w-full cursor-pointer hover:bg-gray-50 transition-colors">
                                                <FormControl>
                                                    <RadioGroupItem value="smtp" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    Standard SMTP
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 w-full cursor-pointer hover:bg-gray-50 transition-colors">
                                                <FormControl>
                                                    <RadioGroupItem value="api" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    Third-party API (Zoho, SendGrid, etc.)
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {deliveryMethod === "smtp" ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Server className="h-5 w-5 text-primary-600" />
                                SMTP Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="host"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SMTP Host</FormLabel>
                                            <FormControl>
                                                <Input placeholder="smtp.zoho.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="port"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SMTP Port</FormLabel>
                                            <FormControl>
                                                <Input placeholder="587" {...field} />
                                            </FormControl>
                                            <FormDescription>Common: 25, 465, 587</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="user@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="encryption"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Encryption</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select encryption" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="ssl">SSL</SelectItem>
                                                    <SelectItem value="tls">TLS</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary-600" />
                                API Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="apiProvider"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>API Provider</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select provider" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="zoho">Zoho Mail</SelectItem>
                                                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                                                    <SelectItem value="mailgun">Mailgun</SelectItem>
                                                    <SelectItem value="custom">Custom API</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="apiKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>API Key</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="SG.xxxxx..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-6 border-t pt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary-600" />
                            Sender Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="senderName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="DentiSpark Notifications" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="senderEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="alerts@dentispark.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => toast.info("Check console for connection logs")}
                            className="h-11 px-6"
                        >
                            Test Connection
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 h-11 gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Configuration
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// Re-using Mail icon from lucide-react (importing it locally)
import { Mail } from "lucide-react";
