export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
      <p>
        By accessing and using our website, you agree to comply with these Terms and Conditions.
        If you disagree with any part, please discontinue using the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. User Responsibilities</h2>
      <p>
        Users must provide accurate information and must not misuse our services in any manner.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Intellectual Property</h2>
      <p>
        All content, images, logos, and text on this website are the property of the company and
        cannot be copied without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Limitation of Liability</h2>
      <p>
        We are not responsible for any losses, damages, or inconveniences caused due to improper
        use of our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Contact Us</h2>
      <p>
        For any queries regarding the Terms, email us at{" "}
        <a href="mailto:support@nnhire.com" className="text-blue-600 underline">
          support@nnhire.com
        </a>.
      </p>
    </div>
  );
}
