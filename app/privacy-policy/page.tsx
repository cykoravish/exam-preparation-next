export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <p>
        We collect name, email, phone number, and other relevant information necessary to provide
        our services.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p>Your data is used to improve our services, contact you, and process transactions.</p>

      <h2 className="text-xl font-semibold mt-6">3. Cookies</h2>
      <p>
        We may use cookies to enhance user experience and track website analytics.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Protection</h2>
      <p>
        We implement security measures to safeguard your data but cannot guarantee 100% security.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Sharing Information</h2>
      <p>
        Your data is never sold. It may only be shared with trusted partners for operational
        purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Contact Us</h2>
      <p>
        If you have any concerns about our privacy practices, contact{" "}
        <a href="mailto:support@nnhire.com" className="text-blue-600 underline">
          support@nnhire.com
        </a>.
      </p>
    </div>
  );
}
