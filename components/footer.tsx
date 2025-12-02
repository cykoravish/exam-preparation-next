
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t mt-10">
      <div className="max-w-6xl mx-auto px-5 py-10">
        
        <div className="flex flex-wrap justify-between gap-10">
          
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">xdcoders</h3>
            <p className="text-sm text-gray-600">
              Lucknow, Uttar Pradesh, India <br />
            </p>

            <p className="text-sm mt-3">
              📧 Email:{" "}
              <Link
                href="mailto:info@xdcoders.com"
                className="text-blue-600 hover:underline"
              >
                info@xdcoders.com
              </Link>
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Important Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:underline text-gray-700"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:underline text-gray-700"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:underline text-gray-700"
                >
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Razorpay */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Payments</h4>
            <p className="text-sm text-gray-600 mb-2">
              Secure payments powered by Razorpay.
            </p>
            <img
              src="https://razorpay.com/assets/razorpay-logo.svg"
              alt="Razorpay Logo"
              className="w-28"
            />
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mt-8">
          © {new Date().getFullYear()} xdcoders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
