import React, { useState, useEffect, useRef } from "react";
import { useAddAddress, useUpdateAddress } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/api";
import { Button } from "../common/Button";
import { Icons } from "../auth/icons/icons";
import "../styles/modal.css";

const EMPTY_FORM = {
  label: "Home",
  recipient_name: "",
  postal_code: "",
  city: "",
  street: "",
  building: "",
  country: "United States",
  country_code: "US",
  phone: "",
  is_default: false,
};

export const AddAddressModal = ({
  isOpen,
  onClose,
  onSuccess,
  showToast,
  // When provided the modal operates in edit mode
  editIndex = null,
  initialData = null,
}) => {
  const isEditing = editIndex !== null && initialData !== null;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const activeMutation = isEditing ? updateAddressMutation : addAddressMutation;

  // Populate form when opening in edit mode
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
      setFieldErrors({});
      setFormError("");
    }
  }, [isOpen, initialData]);

  const countries = [
    { name: "United States", code: "US" },
    { name: "Canada", code: "CA" },
    { name: "Mexico", code: "MX" },
    { name: "United Kingdom", code: "GB" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Japan", code: "JP" },
    { name: "Philippines", code: "PH" },
    { name: "Australia", code: "AU" },
    { name: "New Zealand", code: "NZ" },
    { name: "Singapore", code: "SG" },
    { name: "Malaysia", code: "MY" },
    { name: "Thailand", code: "TH" },
    { name: "India", code: "IN" },
    { name: "China", code: "CN" },
  ];

  const labels = ["Home", "Work", "Other"];

  const validate = () => {
    const errors = {};

    if (!formData.recipient_name?.trim()) {
      errors.recipient_name = "Recipient name is required.";
    }
    if (!formData.postal_code?.trim()) {
      errors.postal_code = "Postal code is required.";
    } else if (formData.postal_code.trim().length < 3) {
      errors.postal_code = "Postal code is too short.";
    }
    if (!formData.city?.trim()) {
      errors.city = "City is required.";
    }
    if (!formData.street?.trim()) {
      errors.street = "Street address is required.";
    }
    if (!formData.country?.trim()) {
      errors.country = "Country is required.";
    }

    if (formData.phone?.trim()) {
      if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        errors.phone = "Enter a valid phone number.";
      }
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

  const handleCountryChange = (countryName) => {
    const country = countries.find((c) => c.name === countryName);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      country_code: country?.code || "",
    }));
    if (fieldErrors.country) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.country;
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

    try {
      if (isEditing) {
        await updateAddressMutation.mutateAsync({
          idx: editIndex,
          addressData: formData,
        });
        if (showToast) showToast("Address updated successfully.", "success");
      } else {
        await addAddressMutation.mutateAsync(formData);
        if (showToast) showToast("Address added successfully.", "success");
      }
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        isEditing
          ? "Failed to update address. Please try again."
          : "Failed to add address. Please try again.",
      );
      setFormError(msg);
      if (showToast) showToast(msg, "error");
    }
  };

  const handleClose = () => {
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
        aria-labelledby="address-modal-title"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <h2 id="address-modal-title" className="modal-title">
            {isEditing ? "Edit Address" : "Add New Address"}
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
            <label className="form-label">Address Label</label>
            <div className="label-selector">
              {labels.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`label-option ${formData.label === l ? "active" : ""}`}
                  onClick={() => handleInputChange("label", l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Recipient Name *</label>
            <input
              type="text"
              className={`form-input ${fieldErrors.recipient_name ? "error" : ""}`}
              placeholder="Full name"
              value={formData.recipient_name}
              onChange={(e) =>
                handleInputChange("recipient_name", e.target.value)
              }
              aria-invalid={!!fieldErrors.recipient_name}
              aria-describedby={
                fieldErrors.recipient_name ? "recipient_name-error" : undefined
              }
            />
            {fieldErrors.recipient_name && (
              <span className="form-error" id="recipient_name-error">
                {fieldErrors.recipient_name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className={`form-input ${fieldErrors.phone ? "error" : ""}`}
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            />
            {fieldErrors.phone && (
              <span className="form-error" id="phone-error">
                {fieldErrors.phone}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              className={`form-input ${fieldErrors.street ? "error" : ""}`}
              placeholder="Street address"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              aria-invalid={!!fieldErrors.street}
              aria-describedby={fieldErrors.street ? "street-error" : undefined}
            />
            {fieldErrors.street && (
              <span className="form-error" id="street-error">
                {fieldErrors.street}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Building / Suite (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Apartment, suite, etc."
              value={formData.building}
              onChange={(e) => handleInputChange("building", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className={`form-input ${fieldErrors.city ? "error" : ""}`}
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                aria-invalid={!!fieldErrors.city}
                aria-describedby={fieldErrors.city ? "city-error" : undefined}
              />
              {fieldErrors.city && (
                <span className="form-error" id="city-error">
                  {fieldErrors.city}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Postal Code *</label>
              <input
                type="text"
                className={`form-input ${fieldErrors.postal_code ? "error" : ""}`}
                placeholder="12345"
                value={formData.postal_code}
                onChange={(e) =>
                  handleInputChange("postal_code", e.target.value)
                }
                aria-invalid={!!fieldErrors.postal_code}
                aria-describedby={
                  fieldErrors.postal_code ? "postal_code-error" : undefined
                }
              />
              {fieldErrors.postal_code && (
                <span className="form-error" id="postal_code-error">
                  {fieldErrors.postal_code}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Country *</label>
            <select
              className={`form-select ${fieldErrors.country ? "error" : ""}`}
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              aria-invalid={!!fieldErrors.country}
              aria-describedby={
                fieldErrors.country ? "country-error" : undefined
              }
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldErrors.country && (
              <span className="form-error" id="country-error">
                {fieldErrors.country}
              </span>
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
              <span className="checkbox-text">Set as default address</span>
            </label>
          </div>

          {formError && (
            <div className="form-alert error">
              <span>⚠</span> {formError}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={activeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={activeMutation.isPending}
          >
            {activeMutation.isPending
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save Changes"
                : "Add Address"}
          </Button>
        </div>
      </div>
    </>
  );
};
