import React, { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useCreateOrder } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import { Icons } from "../common/Icons";
import { paymentApi } from "../../utils/api";

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
  }, [step]);

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

  if (done) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "80px auto",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #d8f3e3, #b7e4c7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            margin: "0 auto 22px",
            boxShadow: "0 6px 24px rgba(45,106,79,0.2)",
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          🎉
        </div>
        <h2
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 26,
            margin: "0 0 10px",
            color: "#1a1008",
          }}
        >
          Order Confirmed!
        </h2>
        {order && (
          <p
            style={{
              color: "#8c7e6e",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Order #{order.order_number || order.id}
          </p>
        )}
        <p
          style={{
            color: "#8c7e6e",
            marginBottom: 32,
            lineHeight: 1.7,
            fontSize: 13.5,
          }}
        >
          Thank you for your purchase. We'll review your payment and update your
          order status shortly.
        </p>
        <button onClick={() => onNavigate("home")} style={primaryBtnStyle}>
          Back to Home
        </button>
        <style>{`@keyframes popIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#e8637a",
            fontWeight: 700,
            marginBottom: 5,
          }}
        >
          Secure Checkout
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 26,
            margin: 0,
            color: "#1a1008",
            fontWeight: 700,
          }}
        >
          Checkout
        </h1>
      </div>

      {/* Steps Indicator */}
      <div style={{ display: "flex", marginBottom: 32, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: "10%",
            right: "10%",
            height: 2,
            background: "#ede5d8",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 15,
            left: "10%",
            right: `${90 - (step - 1) * 28}%`,
            height: 2,
            background: "linear-gradient(90deg, #e8637a, #c9933a)",
            zIndex: 0,
            transition: "right 0.4s ease",
          }}
        />
        {steps.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px",
                fontSize: 12,
                fontWeight: 700,
                background:
                  step > i + 1
                    ? "linear-gradient(135deg, #2d6a4f, #40916c)"
                    : step === i + 1
                      ? "linear-gradient(135deg, #e8637a, #d44f67)"
                      : "white",
                color: step >= i + 1 ? "white" : "#b8aa98",
                border:
                  step > i + 1
                    ? "none"
                    : step === i + 1
                      ? "none"
                      : "2px solid #ede5d8",
                boxShadow:
                  step === i + 1
                    ? "0 3px 12px rgba(232,99,122,0.4)"
                    : step > i + 1
                      ? "0 3px 12px rgba(45,106,79,0.3)"
                      : "none",
                transition: "all 0.3s ease",
              }}
            >
              {step > i + 1 ? <Icons.Check size={12} /> : i + 1}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: step === i + 1 ? 700 : 500,
                color: step === i + 1 ? "#e8637a" : "#b8aa98",
                transition: "color 0.2s",
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 290px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "26px",
            border: "1.5px solid #ede5d8",
            boxShadow: "0 4px 20px rgba(26,16,8,0.05)",
          }}
        >
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <StepTitle>Shipping Address</StepTitle>
              {user?.addresses?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#5c4a37",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Use a saved address
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {user.addresses.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => fillFromSavedAddress(a)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: "1.5px solid #ede5d8",
                          background: "#faf7f2",
                          cursor: "pointer",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#3d2415",
                          fontFamily: "inherit",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#e8637a";
                          e.currentTarget.style.background = "#fde8ec";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#ede5d8";
                          e.currentTarget.style.background = "#faf7f2";
                        }}
                      >
                        {a.label || `Address ${i + 1}`}
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      borderBottom: "1.5px solid #ede5d8",
                      margin: "16px 0",
                    }}
                  />
                </div>
              )}
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  ["Full Name", "name", "John Dela Cruz"],
                  ["Street Address", "street", "123 Rizal Avenue"],
                  ["Building / Apt", "building", "Unit 4B (optional)"],
                  ["City", "city", "Cebu City"],
                  ["Postal Code", "postal", "6000"],
                ].map(([label, field, placeholder]) => (
                  <FormField key={field} label={label}>
                    <StyledInput
                      value={addr[field]}
                      onChange={(e) =>
                        setAddr((a) => ({ ...a, [field]: e.target.value }))
                      }
                      placeholder={placeholder}
                    />
                  </FormField>
                ))}
                <FormField label="Country">
                  <StyledSelect
                    value={addr.country}
                    onChange={(e) =>
                      setAddr((a) => ({ ...a, country: e.target.value }))
                    }
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
                  </StyledSelect>
                </FormField>
              </div>
              <PrimaryBtn
                onClick={() => setStep(2)}
                style={{ marginTop: 20, width: "100%" }}
              >
                Continue →
              </PrimaryBtn>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <StepTitle>Shipping Method</StepTitle>
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
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "15px 16px",
                    borderRadius: 14,
                    cursor: "pointer",
                    marginBottom: 10,
                    textAlign: "left",
                    fontFamily: "inherit",
                    background:
                      shippingMethod === opt.id ? "#fde8ec" : "#faf7f2",
                    border: `2px solid ${shippingMethod === opt.id ? "#e8637a" : "#ede5d8"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        color: "#1a1008",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#8c7e6e", marginTop: 2 }}
                    >
                      {opt.sub}
                    </div>
                  </div>
                  <strong style={{ fontSize: 14, color: "#1a1008" }}>
                    {opt.price}
                  </strong>
                  {shippingMethod === opt.id && (
                    <span style={{ color: "#e8637a", flexShrink: 0 }}>
                      <Icons.Check size={16} />
                    </span>
                  )}
                </button>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <GhostBtn onClick={() => setStep(1)}>← Back</GhostBtn>
                <PrimaryBtn onClick={() => setStep(3)} style={{ flex: 1 }}>
                  Continue →
                </PrimaryBtn>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <StepTitle>Payment Method</StepTitle>
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
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "15px 16px",
                    borderRadius: 14,
                    cursor: "pointer",
                    marginBottom: 10,
                    textAlign: "left",
                    fontFamily: "inherit",
                    background:
                      payment === (opt.code || opt.id) ? "#fde8ec" : "#faf7f2",
                    border: `2px solid ${payment === (opt.code || opt.id) ? "#e8637a" : "#ede5d8"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{opt.icon || "💳"}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13.5,
                      color: "#1a1008",
                      flex: 1,
                    }}
                  >
                    {opt.name || opt.label}
                  </span>
                  {payment === (opt.code || opt.id) && (
                    <span style={{ color: "#e8637a" }}>
                      <Icons.Check size={16} />
                    </span>
                  )}
                </button>
              ))}
              <FormField
                label="Notes for the seller (optional)"
                style={{ marginTop: 16 }}
              >
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={3}
                  placeholder="E.g. Please pack as gifts, leave at reception, etc."
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                />
              </FormField>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <GhostBtn onClick={() => setStep(2)}>← Back</GhostBtn>
                <PrimaryBtn
                  onClick={handlePlaceOrder}
                  disabled={createOrderMutation.isPending}
                  style={{ flex: 1 }}
                >
                  {createOrderMutation.isPending
                    ? "Placing Order…"
                    : "Review & Payment →"}
                </PrimaryBtn>
              </div>
              {error && (
                <p style={{ marginTop: 10, fontSize: 12.5, color: "#c44d62" }}>
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <StepTitle>Payment Instructions</StepTitle>
              <div style={{ marginBottom: 16 }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "11px 0",
                      borderBottom: "1px solid #f0ebe0",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#8c7e6e",
                          marginTop: 2,
                        }}
                      >
                        Qty: {item.qty}
                      </div>
                    </div>
                    <strong style={{ fontSize: 13, alignSelf: "center" }}>
                      $
                      {((item.salePrice || item.price || 0) * item.qty).toFixed(
                        2,
                      )}
                    </strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#f5f0e8",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 14,
                  fontSize: 13,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 4, color: "#3d2415" }}
                >
                  Shipping to
                </div>
                <div style={{ color: "#5c4a37", lineHeight: 1.6 }}>
                  {addr.name || "—"}, {addr.street}
                  {addr.building ? ` ${addr.building}` : ""}, {addr.city}{" "}
                  {addr.postal}, {addr.country}
                </div>
              </div>

              {instructions && (
                <div
                  style={{
                    background: "#fdf3e3",
                    border: "1px solid #f0d9b5",
                    borderRadius: 14,
                    padding: "14px 16px",
                    marginBottom: 14,
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#c9933a",
                      marginBottom: 6,
                    }}
                  >
                    How to pay
                  </div>
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: "pre-line",
                      color: "#3d2415",
                      lineHeight: 1.65,
                    }}
                  >
                    {instructions.details || instructions.instructions || ""}
                  </p>
                </div>
              )}

              <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
                <FormField label="Payment Reference Number">
                  <StyledInput
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. GCASH-1234 or bank transfer ref"
                  />
                </FormField>
                <FormField label="Proof of Payment URL">
                  <StyledInput
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="Link to screenshot or receipt"
                  />
                </FormField>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <GhostBtn onClick={() => setStep(3)}>← Back</GhostBtn>
                <button
                  onClick={handleSubmitPayment}
                  disabled={submittingPayment}
                  style={{
                    ...primaryBtnStyle,
                    flex: 1,
                    background: "linear-gradient(135deg, #1a1008, #3d2415)",
                  }}
                >
                  {submittingPayment
                    ? "Submitting…"
                    : `Submit Payment — $${(total + shippingFee).toFixed(2)}`}
                </button>
              </div>
              {error && (
                <p style={{ marginTop: 10, fontSize: 12.5, color: "#c44d62" }}>
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid #ede5d8",
            padding: "20px",
            position: "sticky",
            top: 80,
            boxShadow: "0 4px 20px rgba(26,16,8,0.05)",
          }}
        >
          <h4
            style={{
              fontWeight: 700,
              margin: "0 0 14px",
              fontSize: 14,
              color: "#1a1008",
            }}
          >
            Order Summary
          </h4>
          {items.slice(0, 3).map((i) => (
            <div
              key={i.id}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <img
                src={i.image}
                alt={i.name}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 11.5,
                    color: "#1a1008",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {i.name}
                </div>
                <div style={{ fontSize: 11, color: "#b8aa98" }}>×{i.qty}</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 12.5, flexShrink: 0 }}>
                ${((i.salePrice || i.price) * i.qty).toFixed(2)}
              </span>
            </div>
          ))}
          {items.length > 3 && (
            <div style={{ fontSize: 11.5, color: "#b8aa98", marginBottom: 10 }}>
              +{items.length - 3} more items
            </div>
          )}

          <div style={{ borderTop: "1.5px solid #ede5d8", paddingTop: 12 }}>
            {[
              ["Subtotal", `$${total.toFixed(2)}`],
              ["Shipping", `$${shippingFee.toFixed(2)}`],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12.5,
                  marginBottom: 7,
                  color: "#8c7e6e",
                }}
              >
                <span>{k}</span>
                <span style={{ color: "#1a1008", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 15,
                fontWeight: 800,
                borderTop: "1px solid #ede5d8",
                paddingTop: 10,
                marginTop: 4,
              }}
            >
              <span>Total</span>
              <span style={{ color: "#e8637a" }}>
                ${(total + shippingFee).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Trust badges */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              "🔒 Secure checkout",
              "📦 Tracked shipping",
              "↩️ 30-day returns",
            ].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 11.5,
                  color: "#8c7e6e",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────

const inputStyle = {
  width: "100%",
  padding: "10px 13px",
  border: "1.5px solid #ede5d8",
  borderRadius: 10,
  fontSize: 13.5,
  outline: "none",
  background: "#faf7f2",
  color: "#1a1008",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const primaryBtnStyle = {
  padding: "12px 22px",
  background: "linear-gradient(135deg, #e8637a, #d44f67)",
  color: "white",
  border: "none",
  borderRadius: 11,
  fontSize: 13.5,
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.2s, transform 0.15s",
  boxShadow: "0 4px 14px rgba(232,99,122,0.4)",
  fontFamily: "inherit",
};

function StepTitle({ children }) {
  return (
    <h3
      style={{
        fontWeight: 700,
        fontSize: 16.5,
        margin: "0 0 18px",
        color: "#1a1008",
      }}
    >
      {children}
    </h3>
  );
}

function FormField({ label, children, style }) {
  return (
    <div style={style}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          display: "block",
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#b8aa98",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => {
        e.target.style.borderColor = "#e8637a";
        e.target.style.background = "white";
        e.target.style.boxShadow = "0 0 0 3px rgba(232,99,122,0.08)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#ede5d8";
        e.target.style.background = "#faf7f2";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function StyledSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle,
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8aa98' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 32,
      }}
    >
      {children}
    </select>
  );
}

function PrimaryBtn({ onClick, disabled, style, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...primaryBtnStyle, opacity: disabled ? 0.7 : 1, ...style }}
      onMouseEnter={(e) =>
        !disabled && (e.currentTarget.style.transform = "translateY(-1px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 18px",
        background: "none",
        border: "1.5px solid #ede5d8",
        borderRadius: 11,
        fontSize: 13,
        fontWeight: 600,
        color: "#8c7e6e",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ebe0")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );
}
