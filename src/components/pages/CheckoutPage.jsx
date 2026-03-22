import React, { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useCreateOrder } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import { ProtectedRoute } from "../common/ProtectedRoute";
import { Icons } from "../common/Icons";
import { paymentApi } from "../../utils/api";
import "../../styles/pages/CheckoutPage.css";

export function CheckoutPage({ onNavigate }) {
  const { items, total, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({
    name: "",
    street: "",
    city: "",
    postal: "",
    country: "Philippines",
    building: "",
  });

  // Auto-fill from user's default address on mount
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const def = user.addresses.find((a) => a.is_default) || user.addresses[0];
      fillFromSavedAddress(def);
    }
  }, [user]);

  const fillFromSavedAddress = (a) => {
    setAddr({
      name: a.recipient_name || "",
      street: a.street || "",
      city: a.city || "",
      postal: a.postal_code || "",
      country: a.country || "Philippines",
      building: a.building || "",
    });
  };
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [payment, setPayment] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [order, setOrder] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofPreview, setProofPreview] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const shippingFee = { economy: 8.99, standard: 12.99, express: 24.99 }[
    shippingMethod
  ];
  const steps = ["Shipping", "Method", "Payment", "Review"];

  useEffect(() => {
    if (step === 3 && paymentMethods.length === 0) {
      paymentApi
        .methods()
        .then((d) => setPaymentMethods(d ?? []))
        .catch(() => setPaymentMethods([]));
    }
  }, [step, paymentMethods.length]);

  const handlePlaceOrder = async () => {
    if (!payment) {
      setError("Please select a payment method.");
      return;
    }
    setError("");
    try {
      const created = await createOrderMutation.mutateAsync({
        shipping_address: {
          recipient_name: addr.name,
          street: addr.street,
          building: addr.building,
          city: addr.city,
          postal_code: addr.postal,
          country: addr.country,
        },
        payment_method: payment,
        shipping_service: shippingMethod,
        currency: "PHP",
        customer_notes: paymentNotes || undefined,
      });
      setOrder(created);
      try {
        setInstructions(
          await paymentApi.instructions(created.id ?? created.order_id),
        );
      } catch {
        setInstructions(null);
      }
      setStep(4);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    }
  };

  const handleSubmitPayment = async () => {
    if (!order) {
      setDone(true);
      await clearCart();
      onNavigate("dashboard");
      return;
    }
    setSubmittingPayment(true);
    try {
      await paymentApi.submit({
        order_id: order.id ?? order.order_id,
        reference_number: referenceNumber,
        proof_url: proofUrl,
        notes: paymentNotes || undefined,
      });
      await clearCart();
      setDone(true);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "Failed to submit payment. Please try again.",
      );
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    setUploadingProof(true);
    setError("");

    try {
      const response = await paymentApi.upload(file);
      const url = response.url;
      setProofUrl(url);
      setProofPreview(URL.createObjectURL(file));
    } catch (e) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingProof(false);
    }
  };

  if (done) {
    return (
      <div className="checkout-done">
        <div className="checkout-done__icon">🎉</div>
        <h2 className="checkout-done__title">Order Confirmed!</h2>
        {order && (
          <p className="checkout-done__order-num">
            Order #{order.order_number || order.id}
          </p>
        )}
        <p className="checkout-done__message">
          Thank you for your purchase. We'll review your payment and update your
          order status shortly.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="checkout-primary-btn checkout-primary-btn--full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute onNavigate={onNavigate} redirectTo="checkout">
      <div className="checkout-page">
        <div className="checkout-header">
          <div className="checkout-eyebrow">Secure Checkout</div>
          <h1 className="checkout-title">Checkout</h1>
        </div>

        {/* Steps Indicator */}
        <div className="checkout-steps">
          <div className="checkout-steps__track" />
          <div
            className="checkout-steps__progress"
            style={{ width: `calc(80% * ${(step - 1) / (steps.length - 1)})` }}
          />
          {steps.map((s, i) => (
            <div key={s} className="checkout-step">
              <div
                className={`checkout-step__dot ${
                  step > i + 1
                    ? "checkout-step__dot--done"
                    : step === i + 1
                      ? "checkout-step__dot--active"
                      : "checkout-step__dot--upcoming"
                }`}
              >
                {step > i + 1 ? <Icons.Check size={12} /> : i + 1}
              </div>
              <div
                className={`checkout-step__label ${
                  step === i + 1
                    ? "checkout-step__label--active"
                    : "checkout-step__label--inactive"
                }`}
              >
                {s}
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-panel">
            {/* Step 1 — Shipping Address */}
            {step === 1 && (
              <div>
                <h3 className="checkout-step-title">Shipping Address</h3>
                {user?.addresses?.length > 0 && (
                  <div>
                    <label className="saved-address-label">
                      Use a saved address
                    </label>
                    <div className="saved-address-list">
                      {user.addresses.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => fillFromSavedAddress(a)}
                          className="saved-address-chip"
                        >
                          {a.label || `Address ${i + 1}`}
                        </button>
                      ))}
                    </div>
                    <hr className="saved-address-divider" />
                  </div>
                )}
                <div className="checkout-form-grid">
                  {[
                    ["Full Name", "name", "John Dela Cruz"],
                    ["Street Address", "street", "123 Rizal Avenue"],
                    ["Building / Apt", "building", "Unit 4B (optional)"],
                    ["City", "city", "Cebu City"],
                    ["Postal Code", "postal", "6000"],
                  ].map(([label, field, placeholder]) => (
                    <div key={field} className="checkout-form-field">
                      <label className="checkout-form-label">{label}</label>
                      <input
                        value={addr[field]}
                        onChange={(e) =>
                          setAddr((a) => ({ ...a, [field]: e.target.value }))
                        }
                        placeholder={placeholder}
                        className="checkout-input"
                      />
                    </div>
                  ))}
                  <div className="checkout-form-field">
                    <label className="checkout-form-label">Country</label>
                    <select
                      value={addr.country}
                      onChange={(e) =>
                        setAddr((a) => ({ ...a, country: e.target.value }))
                      }
                      className="checkout-select"
                    >
                      {[
                        "Philippines",
                        "Japan",
                        "Singapore",
                        "Malaysia",
                        "Indonesia",
                        "Thailand",
                        "Vietnam",
                        "United States",
                        "Other",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="checkout-primary-btn checkout-primary-btn--full"
                  style={{ marginTop: 20 }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 — Shipping Method */}
            {step === 2 && (
              <div>
                <h3 className="checkout-step-title">Shipping Method</h3>
                {[
                  {
                    id: "economy",
                    label: "Economy",
                    sub: "7–14 business days",
                    price: "$8.99",
                    icon: "📬",
                  },
                  {
                    id: "standard",
                    label: "Standard",
                    sub: "5–9 business days",
                    price: "$12.99",
                    icon: "📦",
                  },
                  {
                    id: "express",
                    label: "Express",
                    sub: "2–4 business days",
                    price: "$24.99",
                    icon: "⚡",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    className={`option-card ${
                      shippingMethod === opt.id
                        ? "option-card--selected"
                        : "option-card--unselected"
                    }`}
                  >
                    <span className="option-card__icon">{opt.icon}</span>
                    <div className="option-card__body">
                      <div className="option-card__label">{opt.label}</div>
                      <div className="option-card__sub">{opt.sub}</div>
                    </div>
                    <strong className="option-card__price">{opt.price}</strong>
                    {shippingMethod === opt.id && (
                      <span className="option-card__check">
                        <Icons.Check size={16} />
                      </span>
                    )}
                  </button>
                ))}
                <div className="checkout-btn-row" style={{ marginTop: 6 }}>
                  <button
                    onClick={() => setStep(1)}
                    className="checkout-ghost-btn"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="checkout-primary-btn checkout-primary-btn--flex"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Payment Method */}
            {step === 3 && (
              <div>
                <h3 className="checkout-step-title">Payment Method</h3>
                {(paymentMethods.length
                  ? paymentMethods
                  : [
                      { code: "gcash", name: "GCash", icon: "📱" },
                      {
                        code: "bank_transfer",
                        name: "Bank Transfer",
                        icon: "🏦",
                      },
                      { code: "cod", name: "Cash on Delivery", icon: "💴" },
                    ]
                ).map((opt) => (
                  <button
                    key={opt.code || opt.id}
                    onClick={() => setPayment(opt.code || opt.id)}
                    className={`option-card ${
                      payment === (opt.code || opt.id)
                        ? "option-card--selected"
                        : "option-card--unselected"
                    }`}
                  >
                    <span className="option-card__icon option-card__icon--lg">
                      {opt.icon || "💳"}
                    </span>
                    <span className="option-card__label" style={{ flex: 1 }}>
                      {opt.name || opt.label}
                    </span>
                    {payment === (opt.code || opt.id) && (
                      <span className="option-card__check">
                        <Icons.Check size={16} />
                      </span>
                    )}
                  </button>
                ))}
                <div className="checkout-form-field" style={{ marginTop: 16 }}>
                  <label className="checkout-form-label">
                    Notes for the seller (optional)
                  </label>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    rows={3}
                    placeholder="E.g. Please pack as gifts, leave at reception, etc."
                    className="checkout-textarea"
                  />
                </div>
                <div className="checkout-btn-row">
                  <button
                    onClick={() => setStep(2)}
                    className="checkout-ghost-btn"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending}
                    className="checkout-primary-btn checkout-primary-btn--flex"
                  >
                    {createOrderMutation.isPending
                      ? "Placing Order…"
                      : "Review & Payment →"}
                  </button>
                </div>
                {error && <p className="checkout-error">{error}</p>}
              </div>
            )}

            {/* Step 4 — Payment Review */}
            {step === 4 && (
              <div>
                <h3 className="checkout-step-title">Payment Instructions</h3>
                <div className="review-item-list">
                  {items.map((item) => (
                    <div key={item.id} className="review-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="review-item__img"
                      />
                      <div className="review-item__info">
                        <div className="review-item__name">{item.name}</div>
                        <div className="review-item__qty">Qty: {item.qty}</div>
                      </div>
                      <strong className="review-item__price">
                        $
                        {(
                          (item.salePrice || item.price || 0) * item.qty
                        ).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="review-address">
                  <div className="review-address__label">Shipping to</div>
                  <div className="review-address__text">
                    {addr.name || "—"}, {addr.street}
                    {addr.building ? ` ${addr.building}` : ""}, {addr.city}{" "}
                    {addr.postal}, {addr.country}
                  </div>
                </div>

                {instructions && (
                  <div className="review-instructions">
                    <div className="review-instructions__title">How to pay</div>
                    <p className="review-instructions__text">
                      {instructions.details || instructions.instructions || ""}
                    </p>
                  </div>
                )}

                <div className="review-payment-fields">
                  <div className="checkout-form-field">
                    <label className="checkout-form-label">
                      Payment Reference Number
                    </label>
                    <input
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g. GCASH-1234 or bank transfer ref"
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-field">
                    <label className="checkout-form-label">
                      Proof of Payment Image
                    </label>
                    <div className="checkout-file-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        disabled={uploadingProof}
                        className="checkout-file-input"
                        id="proof-upload"
                      />
                      <label
                        htmlFor="proof-upload"
                        className="checkout-file-label"
                      >
                        {uploadingProof ? "Uploading…" : "Choose Image"}
                      </label>
                      {proofPreview && (
                        <div className="checkout-file-preview">
                          <img
                            src={proofPreview}
                            alt="Payment proof"
                            className="checkout-preview-img"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="checkout-btn-row">
                  <button
                    onClick={() => setStep(3)}
                    className="checkout-ghost-btn"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    disabled={submittingPayment}
                    className="checkout-primary-btn checkout-primary-btn--flex checkout-primary-btn--dark"
                  >
                    {submittingPayment
                      ? "Submitting…"
                      : `Submit Payment — $${(total + shippingFee).toFixed(2)}`}
                  </button>
                </div>
                {error && <p className="checkout-error">{error}</p>}
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="checkout-summary">
            <h4 className="checkout-summary__title">Order Summary</h4>
            {items.slice(0, 3).map((i) => (
              <div key={i.id} className="summary-item">
                <img src={i.image} alt={i.name} className="summary-item__img" />
                <div className="summary-item__info">
                  <div className="summary-item__name">{i.name}</div>
                  <div className="summary-item__qty">×{i.qty}</div>
                </div>
                <span className="summary-item__price">
                  ${((i.salePrice || i.price) * i.qty).toFixed(2)}
                </span>
              </div>
            ))}
            {items.length > 3 && (
              <div className="summary-more">+{items.length - 3} more items</div>
            )}

            <div className="summary-totals">
              {[
                ["Subtotal", `$${total.toFixed(2)}`],
                ["Shipping", `$${shippingFee.toFixed(2)}`],
              ].map(([k, v]) => (
                <div key={k} className="summary-row">
                  <span>{k}</span>
                  <span className="summary-row__value">{v}</span>
                </div>
              ))}
              <div className="summary-grand-total">
                <span>Total</span>
                <span className="summary-grand-total__amount">
                  ${(total + shippingFee).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="summary-trust">
              {[
                "🔒 Secure checkout",
                "📦 Tracked shipping",
                "↩️ 30-day returns",
              ].map((t) => (
                <div key={t} className="summary-trust__item">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
