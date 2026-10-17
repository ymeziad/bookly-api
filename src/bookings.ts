import { stripe } from "./stripeClient";
import { bookingPrice } from "./pricing";
import type { Booking, PaymentOutcome } from "./types";

export async function payForBooking(booking: Booking, paymentMethodId: string): Promise<PaymentOutcome> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: bookingPrice(booking),
    currency: "usd",
    customer: booking.customerId,
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    description: `Bookly ${booking.serviceId} on ${booking.startsAt}`,
    metadata: { bookingId: booking.id },
  });

  return { ok: paymentIntent.status === "succeeded", id: paymentIntent.id };
}
