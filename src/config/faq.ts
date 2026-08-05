import { DOWNLOAD_TOKEN_VALID_DAYS } from "./brand";

export type FaqItem = { id: string; question: string; answer: string };

export const faq: FaqItem[] = [
  {
    id: "formats",
    question: "Which formats do I get?",
    answer:
      "Every wallpaper is delivered twice: a 9:16 version sized for iPhone and a 16:9 version sized for MacBook and external displays. You never buy the same image twice.",
  },
  {
    id: "delivery",
    question: "How do I receive my files?",
    answer:
      "Instantly. The moment your payment is confirmed you land on a download page, and the same links are emailed to you as a backup.",
  },
  {
    id: "expiry",
    question: "How long do my download links last?",
    answer: `Your download links stay valid for ${DOWNLOAD_TOKEN_VALID_DAYS} days and can be used as many times as you like within that window — re-download on a new phone or laptop whenever you need to.`,
  },
  {
    id: "resend",
    question: "I lost my download link. Can you send it again?",
    answer:
      "Yes. Use the 'Resend my download link' form on the contact page with the email address you purchased with, and a fresh link is sent straight away.",
  },
  {
    id: "resolution",
    question: "What resolution are the files?",
    answer:
      "Every wallpaper is delivered at full resolution for the device it was made for — sized for modern iPhone displays and for desktop, and graded to look sharp on Pro Motion, Retina, and OLED panels.",
  },
  {
    id: "previews",
    question: "Why do the previews look soft?",
    answer:
      "Previews on this site are deliberately low-resolution and watermarked. The full-resolution originals are never served to the browser — they are only released through your download link after purchase.",
  },
  {
    id: "licence",
    question: "What am I allowed to do with them?",
    answer:
      "Personal use on your own devices, on as many of them as you own. Redistribution, resale, and commercial use are not included.",
  },
  {
    id: "refunds",
    question: "Do you offer refunds?",
    answer:
      "Digital downloads are non-refundable once the files have been downloaded. If a file is corrupt or the wrong format, write to us and we will fix or refund it.",
  },
  // Hidden while the All-in-One Bundle is unavailable — see BUNDLE_AVAILABLE
  // in src/config/products.ts. Restore this entry when the bundle goes live.
  // {
  //   id: "bundle",
  //   question: "Does the bundle include future albums?",
  //   answer:
  //     "Yes. The All-in-One Bundle covers the entire current library and every album released after your purchase, at no extra cost.",
  // },
  {
    id: "contact",
    question: "Something else?",
    answer:
      "Use the contact form and we'll get back to you — replies usually arrive within one working day.",
  },
];
