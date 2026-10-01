export const consultationServices = [
  "Suit",
  "Traditional / Fusion",
  "Wedding",
  "Occasion Wear",
  "Smart Casual",
  "Styling",
  "Other",
] as const;

export const consultationTypes = ["Atelier", "Remote"] as const;

export type ConsultationSubmission = {
  service: string;
  occasion: string;
  eventDate: string | null;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  details: string | null;
};

type ValidationResult =
  | { success: true; data: ConsultationSubmission }
  | { success: false; error: string };

function required(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function validateConsultationForm(formData: FormData): ValidationResult {
  const service = required(formData, "service");
  const occasion = required(formData, "occasion");
  const eventDate = required(formData, "eventDate") || null;
  const consultationType = required(formData, "consultationType");
  const preferredDate = required(formData, "preferredDate");
  const preferredTime = required(formData, "preferredTime");
  const fullName = required(formData, "fullName");
  const email = required(formData, "email").toLowerCase();
  const phone = required(formData, "phone");
  const location = required(formData, "location");
  const details = required(formData, "details") || null;

  if (!consultationServices.includes(service as (typeof consultationServices)[number])) {
    return { success: false, error: "Please select a valid service." };
  }

  if (!consultationTypes.includes(consultationType as (typeof consultationTypes)[number])) {
    return { success: false, error: "Please select a valid consultation type." };
  }

  if (!occasion || !preferredDate || !preferredTime || !fullName || !phone || !location) {
    return { success: false, error: "Please complete all required fields." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (fullName.length > 120 || email.length > 254 || phone.length > 50 || location.length > 120) {
    return { success: false, error: "One or more fields are too long." };
  }

  if (occasion.length > 200 || (details && details.length > 2000)) {
    return { success: false, error: "Please shorten the additional information." };
  }

  return {
    success: true,
    data: {
      service,
      occasion,
      eventDate,
      consultationType,
      preferredDate,
      preferredTime,
      fullName,
      email,
      phone,
      location,
      details,
    },
  };
}
