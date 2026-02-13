'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventTitle: string;
    eventId: string;
}

export function RegistrationModal({ isOpen, onClose, eventTitle, eventId }: RegistrationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        guest_count: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('event_registrations')
                .insert([{
                    event_id: eventId,
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    guest_count: formData.guest_count
                }]);

            if (error) throw error;

            setIsSuccess(true);
            toast.success("You're on the list!");

            // Reset after 2 seconds and close
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ full_name: '', email: '', phone: '', guest_count: 1 });
            }, 2000);

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center animate-in zoom-in-50">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-stone-900">Registration Confirmed!</h3>
                        <p className="text-stone-500">See you at {eventTitle}.</p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Register for {eventTitle}</DialogTitle>
                            <DialogDescription>
                                Secure your spot. We'll send you the details via email.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests">Guests</Label>
                                    <Input
                                        id="guests"
                                        type="number"
                                        min={1}
                                        max={10}
                                        required
                                        value={formData.guest_count}
                                        onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                                        </>
                                    ) : (
                                        "Confirm Registration"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}