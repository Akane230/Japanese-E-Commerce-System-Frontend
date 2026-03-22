import React, { useState } from "react";
import { authService } from "../../services/authService";
import { getApiErrorMessage } from "../../utils/api";
import { Button } from "../common/Button";
import { Icons } from "../auth/icons/icons";
import "../styles/modal.css";

export const AddPaymentMethodModal = ({
  isOpen,
  onClose,
  onSuccess,
  showToast,
}) => {
  const [formData, setFormData] = useState({
    type: "card",
    holder_name: "",
    is_default: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const paymentTypes = [
    { value: "card", label: "Credit/Debit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "gcash", label: "GCash" },
    { value: "other", label: "Other" },
  ];

  const validate = () => {
    const errors = {};

    if (!formData.holder_name?.trim()) {
      errors.holder_name = "Holder name is required.";
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      await authService.addPaymentMethod(paymentData);
      if (showToast) showToast("Payment method added successfully.", "success");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        "Failed to add payment method. Please try again.",
      );
      setFormError(msg);
      if (showToast) showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "card",
      holder_name: "",
      is_default: false,
    });
    setFieldErrors({});
    setFormError("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-overlay"
        onClick={handleClose}
        role="presentation"
      />
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <h2 id="payment-modal-title" className="modal-title">
            Add Payment Method
          </h2>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Payment Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              aria-describedby="type-desc"
            >
              {paymentTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
            <p
              id="type-desc"
              style={{ fontSize: "12px", color: "#8c7e6e", marginTop: "4px" }}
            >
              Select your preferred payment method type.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Holder Name *</label>
            <input
              type="text"
              className={`form-input ${fieldErrors.holder_name ? "error" : ""}`}
              placeholder="Full name as it appears on payment method"
              value={formData.holder_name}
              onChange={(e) => handleInputChange("holder_name", e.target.value)}
              aria-invalid={!!fieldErrors.holder_name}
              aria-describedby={
                fieldErrors.holder_name ? "holder_name-error" : undefined
              }
            />
            {fieldErrors.holder_name && (
              <span className="form-error" id="holder_name-error">
                {fieldErrors.holder_name}
              </span>
            )}
          </div>

          <div className="form-info">
            {formData.type === "card" && (
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8c7e6e",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>Card Information:</strong> For security reasons, we
                  don't store card details. During checkout, you'll be securely
                  prompted to enter your card information through our payment
                  processor.
                </p>
              </div>
            )}
            {formData.type === "paypal" && (
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8c7e6e",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>PayPal:</strong> You'll be redirected to PayPal during
                  checkout to complete the payment securely.
                </p>
              </div>
            )}
            {formData.type === "bank_transfer" && (
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8c7e6e",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>Bank Transfer:</strong> Payment instructions will be
                  provided at checkout.
                </p>
              </div>
            )}
            {formData.type === "gcash" && (
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8c7e6e",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>GCash:</strong> Payment instructions will be provided
                  at checkout.
                </p>
              </div>
            )}
            {formData.type === "other" && (
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8c7e6e",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>Other:</strong> Details will be provided at checkout.
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label
              className="checkbox-row"
              onClick={() =>
                handleInputChange("is_default", !formData.is_default)
              }
            >
              <div
                className={`checkbox-box ${formData.is_default ? "checked" : ""}`}
              >
                {formData.is_default && <Icons.Check />}
              </div>
              <span className="checkbox-text">
                Set as default payment method
              </span>
            </label>
          </div>

          {formError && (
            <div className="form-alert error">
              <span>⚠</span> {formError}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="spinner-small" />
            ) : (
              "Add Payment Method"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
