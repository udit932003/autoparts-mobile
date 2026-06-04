// Sales contact (lead receiver) — same as the website.
export const SALES_CONTACT = {
  name: "Sonu Chauhan",
  phone: "9211742641",
  tel: "+919211742641",
  whatsapp: "919211742641",
};

export function telUrl() {
  return `tel:${SALES_CONTACT.tel}`;
}

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${SALES_CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
