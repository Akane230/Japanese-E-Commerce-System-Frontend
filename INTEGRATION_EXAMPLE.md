# Integration Example

## Adding Address & Payment Modals to CheckoutPage

Here's how to integrate the new modal components into the CheckoutPage:

```jsx
// Add these imports at the top of CheckoutPage.jsx
import { AddAddressModal } from "../modals/AddAddressModal";
import { AddPaymentMethodModal } from "../modals/AddPaymentMethodModal";

// Add state for modals in the CheckoutPage component
const [showAddressModal, setShowAddressModal] = useState(false);
const [showPaymentModal, setShowPaymentModal] = useState(false);

// Add these functions to handle modal success
const handleAddressAdded = () => {
  // Refresh addresses or update state as needed
  console.log("Address added successfully");
};

const handlePaymentMethodAdded = () => {
  // Refresh payment methods or update state as needed
  console.log("Payment method added successfully");
};

// Add the modal components at the end of the CheckoutPage JSX (before the closing div)
return (
  <div className="max-w-5xl mx-auto px-5 py-9">
    {/* ... existing checkout content ... */}
    
    {/* Add Address Modal */}
    <AddAddressModal
      isOpen={showAddressModal}
      onClose={() => setShowAddressModal(false)}
      onSuccess={handleAddressAdded}
    />
    
    {/* Add Payment Method Modal */}
    <AddPaymentMethodModal
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      onSuccess={handlePaymentMethodAdded}
    />
  </div>
);

// Add buttons to trigger the modals (example in Step 1 and Step 3)

// In Step 1 (Shipping Address), add a button:
<button
  type="button"
  onClick={() => setShowAddressModal(true)}
  className="text-xs text-pink-500 hover:text-pink-600 font-medium"
>
  + Add New Address
</button>

// In Step 3 (Payment Method), add a button:
<button
  type="button"
  onClick={() => setShowPaymentModal(true)}
  className="text-xs text-pink-500 hover:text-pink-600 font-medium"
>
  + Add New Payment Method
</button>
```

## Features Implemented

### ✅ Refactored Styling
- **CheckoutPage**: Converted all inline styles to Tailwind CSS
- **CartPage**: Converted all inline styles to Tailwind CSS
- **Responsive Design**: Added proper responsive breakpoints (sm:, md:, lg:)

### ✅ Address Modal
- Full CRUD integration with backend API
- Form validation and error handling
- Support for all address fields from backend model
- Default address setting
- Responsive design with Tailwind CSS

### ✅ Payment Method Modal
- Multiple payment types (Card, PayPal, Bank Transfer, GCash)
- Card number formatting and validation
- Expiry date formatting
- Brand detection (Visa, Mastercard, Amex)
- Default payment method setting
- Responsive design with Tailwind CSS

### ✅ API Integration
- Added `addPaymentMethod` function to authApi
- Proper error handling with `getApiErrorMessage`
- Loading states and form validation
- Success callbacks for UI updates

## Backend Compatibility

The modals are designed to work with the existing backend models:

### Address Model Fields
- `label`: Home/Work/Other
- `recipient_name`: Full recipient name
- `postal_code`: ZIP/postal code
- `city`: City name
- `street`: Street address
- `building`: Apartment/suite (optional)
- `country`: Country name
- `phone`: Phone number
- `is_default`: Default address flag

### Payment Method Model Fields
- `id`: Payment method token
- `type`: card/paypal/bank_transfer/gcash/other
- `brand`: visa/mastercard/amex
- `last4`: Last 4 digits
- `expiry`: MM/YYYY format
- `holder_name`: Cardholder name
- `is_default`: Default payment flag

## Usage Notes

1. **Responsive Design**: All components are fully responsive with proper breakpoints
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Loading States**: Loading indicators during API calls
4. **Form Validation**: HTML5 validation with custom formatting
5. **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation
6. **Styling Consistency**: Matches existing design system with Tailwind CSS

The implementation maintains compatibility with the existing codebase while providing a modern, maintainable styling solution using Tailwind CSS.
