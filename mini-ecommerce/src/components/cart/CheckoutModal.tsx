'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAppDispatch } from '@/store/hooks';
import { createOrder } from '@/features/ordersSlice';
import { useScrollLock, useEscapeKey } from '@/hooks';
import { formatCurrency, isValidEmail, cn } from '@/utils';
import type { CheckoutFormData } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

const initialFormData: CheckoutFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
};

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, discount, tax, total, clear, itemsCount, promoCode } = useCart();

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Close on escape key
  useEscapeKey(onClose);

  // Handle click outside - disable when submitting
  // Note: handleClose is safely called only when !isSubmitting via the condition check
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isSubmitting, onClose]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name as keyof CheckoutFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create order in Redux store (persists to localStorage)
      dispatch(
        createOrder({
          items,
          customer: formData,
          subtotal,
          discount,
          tax,
          total,
          promoCode: promoCode || undefined,
        })
      );

      setIsSubmitting(false);

      // Clear cart after successful order
      clear();

      // Close modal and navigate to the order tracking page
      onClose();
      router.push('/orders');
    },
    [validateForm, clear, dispatch, items, formData, subtotal, discount, tax, total, promoCode, onClose, router]
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  }, [isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="overlay" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* Close Button */}
        {!isSubmitting && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close checkout"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Form State */}
        <form onSubmit={handleSubmit} className="p-6">
          <h2
            id="checkout-title"
            className="mb-6 text-xl font-semibold text-gray-900"
          >
            Checkout
          </h2>

          {/* Order Summary */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
              Contact Information
            </h3>
            <div className="space-y-4">
              <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="John Doe"
                  required
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="john@example.com"
                  required
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
                Shipping Address
              </h3>
              <div className="space-y-4">
                <FormField
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="123 Main Street"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    placeholder="San Francisco"
                    required
                  />
                  <FormField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                    placeholder="CA"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={errors.zipCode}
                    placeholder="94102"
                    required
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="input"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full gap-2 py-3 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(total)}`
              )}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              By placing this order, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </form>
      </div>
    </div>
  );
}

// Form Field Component
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'input',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-200'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
