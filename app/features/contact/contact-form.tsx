import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { siteConfig } from "~/lib/site-config";

type Status = "idle" | "sending" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";
    if (!message) nextErrors.message = "Message can't be empty";

    setErrors(nextErrors);
    setSendError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setSendError(data.error || "Could not send your message right now. Try again in a moment.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
      formEl.reset();
    } catch {
      setSendError("Could not send your message right now. Try again in a moment.");
      setStatus("idle");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center"
          >
            <CheckCircle2 className="size-8 text-primary" />
            <p className="font-heading text-lg font-semibold text-foreground">Message transmitted</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Thanks for reaching out - I'll get back to you at {siteConfig.email} soon.
            </p>
            <Button variant="outline" size="sm" onClick={() => setStatus("idle")} className="mt-2">
              Send another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </label>
              <Input id="name" name="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Message
              </label>
              <Textarea id="message" name="message" rows={5} placeholder="What are you building?" aria-invalid={Boolean(errors.message)} />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            {sendError && <p className="text-sm text-destructive">{sendError}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
              {status === "sending" ? (
                "Transmitting..."
              ) : (
                <>
                  Send message <Send className="size-4" />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
