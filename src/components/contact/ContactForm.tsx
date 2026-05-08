'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { motion } from 'framer-motion';

// Validation schema matching backend
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Thank you! Your message has been received.');
        reset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className={className}
    >
      <CardSpotlight
        radius={400}
        color="rgba(247,147,26,0.12)"
        className="p-6 sm:p-8 section-panel"
      >
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-gradient-to-r from-panafrican-green/10 to-bitcoin/10 border border-panafrican-green/30"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-panafrican-green mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">{submitMessage}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">{submitMessage}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please check your inputs and try again.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg bg-bg-surface border ${
                  errors.name ? 'border-red-500' : 'border-border-soft'
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bitcoin focus:border-transparent transition-colors`}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="size-3" aria-hidden="true" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg bg-bg-surface border ${
                  errors.email ? 'border-red-500' : 'border-border-soft'
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bitcoin focus:border-transparent transition-colors`}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="size-3" aria-hidden="true" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-soft text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bitcoin focus:border-transparent transition-colors"
                placeholder="+256 700 123 456"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="size-3" aria-hidden="true" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                Subject (Optional)
              </label>
              <input
                id="subject"
                type="text"
                {...register('subject')}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                className={`w-full px-4 py-3 rounded-lg bg-bg-surface border ${
                  errors.subject ? 'border-red-500' : 'border-border-soft'
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bitcoin focus:border-transparent transition-colors`}
                placeholder="General Inquiry"
                disabled={isSubmitting}
              />
              {errors.subject && (
                <p id="subject-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="size-3" aria-hidden="true" />
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-foreground">
              Your Message *
            </label>
            <textarea
              id="message"
              rows={6}
              {...register('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`w-full px-4 py-3 rounded-lg bg-bg-surface border ${
                errors.message ? 'border-red-500' : 'border-border-soft'
              } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bitcoin focus:border-transparent transition-colors resize-none`}
              placeholder="Tell us how we can help you..."
              disabled={isSubmitting}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="size-3" aria-hidden="true" />
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button & Privacy Note */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className="w-full sm:w-auto px-8 relative overflow-hidden group"
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="size-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </>
                )}
              </span>
            </Button>
            <p className="text-sm text-muted-foreground mt-4 max-w-prose">
              By submitting this form, you agree to our privacy policy and consent to being contacted.
              We respect your privacy and will never share your information with third parties.
            </p>
          </div>
        </form>
      </CardSpotlight>
    </motion.div>
  );
}