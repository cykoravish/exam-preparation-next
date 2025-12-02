export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Refund & Cancellation Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-6">1. Refund Eligibility</h2>
      <p>
        Refunds are only applicable if the user faces technical issues or has not received the
        purchased service/product.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. Non-Refundable Items</h2>
      <p>
        Digital products and services already delivered are non-refundable.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Cancellation Policy</h2>
      <p>
        Users may cancel their purchase within 24 hours provided the service has not already been
        initiated.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Disputes</h2>
      <p>
        All refund-related disputes must be emailed to{" "}
        <a href="mailto:support@nnhire.com" className="text-blue-600 underline">
          support@nnhire.com
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Processing Time</h2>
      <p>
        Approved refunds will be processed within 7–10 business days.
      </p>
    </div>
  );
}
