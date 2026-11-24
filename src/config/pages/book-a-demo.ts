/**
 * Book a demo page content (route "/book-a-demo").
 * ------------------------------------------------------------
 * The form has no backend: it validates in the browser and shows a
 * success message. Connect it to your CRM or form service in
 * src/components/demo/DemoForm.astro (see the TODO there).
 */
export const bookDemo = {
  seo: {
    title: "Book a demo",
    description: "Book a 30-minute call with the Halden team and hear the AI front desk answer a live call with your clinic’s own scripts.",
  },
  title: "See Halden answer\n",
  titleMuted: "your phones",
  description: "A 30-minute call with our team about your clinic and where Halden helps most.",
  benefits: ["Hear a live call on your own scripts", "See how it books into your EHR", "Get pricing for your locations"],
  logos: {
    title: "Trusted by clinic teams",
    /** Sample clinic names shown as text badges – replace them with your customers. */
    items: ["Brightwater", "Northside Ortho", "Sunrise Peds", "Cedar Family", "Lumen Health", "Oakview", "Harbor Women’s", "Riverbend"],
  },
  form: {
    title: "Book your demo",
    description: "We’ll reply within one business day.",
    fields: {
      name: { label: "Full name", placeholder: "Jane Cooper", error: "Please enter your name." },
      email: { label: "Work email", placeholder: "jane@example.com", error: "Please enter a valid work email." },
      clinic: { label: "Clinic name", placeholder: "Brightwater Dermatology", error: "Please enter your clinic’s name." },
      phone: { label: "Phone number", placeholder: "(555) 000-0000", error: "Please enter a valid phone number." },
      locations: {
        label: "Number of locations",
        placeholder: "Select",
        options: ["1 location", "2–5 locations", "6–20 locations", "20+ locations"],
        error: "Please choose the number of locations.",
      },
      message: { label: "Message (optional)", placeholder: "Write a message" },
    },
    submit: "Submit message",
    sending: "Sending…",
    errorSummary: "Please check the highlighted fields.",
    success: {
      title: "Thanks – your request is in",
      description: "We’ll email you within one business day to pick a time that suits your clinic.",
      again: "Send another request",
    },
  },
};
