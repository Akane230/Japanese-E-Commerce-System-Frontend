// ─── DashboardPage.jsx ─────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUpdateProfile } from "../../hooks/useAuthMutations";
import { useRemoveAddress, useSetDefaultAddress } from "../../hooks/useAuth";
import { orderApi, productApi, getApiErrorMessage } from "../../utils/api";
import { formatPrice } from "../../utils/helpers";
import { Icons } from "../common/Icons";
import { Button } from "../common/Button";
import { Chip } from "../common/Chip";
import { Price } from "../common/Price";
import useToastStore from "../../stores/toastStore";
import { AddAddressModal } from "../modals/AddAddressModal";
import { AddPaymentMethodModal } from "../modals/AddPaymentMethodModal";
import "../../styles/pages/DashboardPage.css";

export function DashboardPage({ onNavigate }) {
  const { user, reloadProfile } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const { addToast } = useToastStore();

  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null); // { index, data }
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] =
    useState(false);

  const removeAddressMutation = useRemoveAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  React.useEffect(() => {
    setProfileForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
    });
  }, [user]);

  const handleProfileChange = (field) => (event) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    updateProfileMutation.mutate(profileForm, {
      onSuccess: () => {
        setProfileMessage("Profile updated successfully.");
      },
      onError: (error) => {
        setProfileError(getApiErrorMessage(error, "Failed to update profile."));
      },
    });
  };

  const tabs = [
    ["profile", "👤", "Profile"],
    ["orders", "📦", "Orders"],
    ["addresses", "📍", "Addresses"],
    ["wishlist", "❤️", "Wishlist"],
    ["logout", "🚪", "Logout"],
  ];

  useEffect(() => {
    if (tab !== "orders") return;

    setOrdersLoading(true);

    const fetchData = async () => {
      try {
        const data = await orderApi.list();
        setOrders(data || []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchData();
  }, [tab]);

  useEffect(() => {
    if (tab !== "wishlist") return;

    if (!user) {
      setWishlistProducts([]);
      setWishlistError("");
      return;
    }

    const ids = Array.isArray(user.wishlist) ? user.wishlist : [];
    if (!ids.length) {
      setWishlistProducts([]);
      setWishlistError("");
      return;
    }

    let alive = true;
    setWishlistLoading(true);
    setWishlistError("");

    productApi
      .list({ page: 1, page_size: 500 })
      .then((list) => {
        if (!alive) return;
        const products = Array.isArray(list) ? list : [];
        const setIds = new Set(ids.map(String));
        setWishlistProducts(products.filter((p) => setIds.has(String(p.id))));
      })
      .catch((e) => {
        if (!alive) return;
        setWishlistProducts([]);
        setWishlistError(getApiErrorMessage(e, "Failed to load wishlist."));
      })
      .finally(() => {
        if (!alive) return;
        setWishlistLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [tab, user]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-eyebrow">Welcome back</div>
        <h1 className="dashboard-title">My Account</h1>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {/* User header */}
          <div className="dashboard-user-header">
            <div className="dashboard-avatar">👤</div>
            <div className="dashboard-user-name">{user?.name || "Guest"}</div>
            <div className="dashboard-user-email">{user?.email || ""}</div>
          </div>

          {tabs.map(([id, ico, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`dashboard-nav-btn ${
                tab === id
                  ? "dashboard-nav-btn--active"
                  : "dashboard-nav-btn--inactive"
              }`}
            >
              <span className="dashboard-nav-icon">{ico}</span> {label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="dashboard-main">
          {!user && (
            <div>
              <div className="dashboard-guest-title">
                Sign in to view your account
              </div>
              <div className="dashboard-guest-text">
                Your profile, orders, addresses, and wishlist are available
                after login.
              </div>
              <Button onClick={() => onNavigate("auth")}>Go to Login</Button>
            </div>
          )}

          {user && tab === "profile" && (
            <form onSubmit={handleSaveProfile}>
              <h3 className="dashboard-section-head">Profile</h3>
              <div className="profile-form">
                {[
                  ["First Name", "first_name"],
                  ["Last Name", "last_name"],
                  ["Email", "email"],
                  ["Phone", "phone_number"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="profile-label">{label}</label>
                    <input
                      value={profileForm[key] || ""}
                      onChange={handleProfileChange(key)}
                      className="profile-input"
                    />
                  </div>
                ))}

                {profileMessage && (
                  <div className="profile-message">{profileMessage}</div>
                )}
                {profileError && (
                  <div className="profile-error">{profileError}</div>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="profile-save-btn"
                >
                  {updateProfileMutation.isLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {user && tab === "orders" && (
            <div>
              <h3 className="dashboard-section-head">Order History</h3>
              {ordersLoading && (
                <p className="orders-loading">Loading your orders…</p>
              )}
              {!ordersLoading && orders.length === 0 && (
                <div className="orders-empty">
                  <div className="orders-empty-icon">📦</div>
                  <p className="orders-empty-text">
                    No orders yet. Start shopping to see them here.
                  </p>
                </div>
              )}
              {orders.map((o) => (
                <div key={o.id || o.order_number} className="order-row">
                  <div className="order-row__info">
                    <div className="order-row__number">
                      {o.order_number || o.id}
                    </div>
                    <div className="order-row__meta">
                      {(o.created_at &&
                        new Date(o.created_at).toLocaleDateString()) ||
                        o.date}{" "}
                      · {o.items_count || o.items?.length || 0} items
                    </div>
                  </div>
                  <Chip
                    color={
                      o.status === "delivered" || o.status === "Delivered"
                        ? "green"
                        : "gold"
                    }
                  >
                    {o.status_label || o.status || "Pending"}
                  </Chip>
                  <strong className="order-row__total">
                    {formatPrice(o.grand_total, o.currency || "JPY")}
                  </strong>
                  {/* Pass order_number directly so TrackingPage auto-searches */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onNavigate("tracking", o.order_number || o.id)
                    }
                  >
                    Track
                  </Button>
                </div>
              ))}
            </div>
          )}

          {user && tab === "addresses" && (
            <div>
              <div className="addresses-header">
                <h3 className="dashboard-section-head" style={{ margin: 0 }}>
                  Addresses
                </h3>
                <Button size="sm" onClick={() => setShowAddAddressModal(true)}>
                  + Add
                </Button>
              </div>
              {(Array.isArray(user.addresses) ? user.addresses : []).length ===
              0 ? (
                <div className="addresses-empty">
                  You don't have any saved addresses yet.
                </div>
              ) : (
                (Array.isArray(user.addresses) ? user.addresses : []).map(
                  (a, i) => (
                    <div
                      key={i}
                      className={`address-card ${
                        a.is_default
                          ? "address-card--default"
                          : "address-card--standard"
                      }`}
                    >
                      <div className="address-card__header">
                        <Icons.Pin />
                        <strong className="address-card__name">
                          {a.recipient_name}
                        </strong>
                        {a.is_default && (
                          <span className="address-card__default-badge">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="address-card__text">
                        {[
                          a.street,
                          a.building,
                          `${a.city} ${a.postal_code}`.trim(),
                          a.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      <div className="address-card__actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditAddress({ index: i, data: a })}
                        >
                          Edit
                        </Button>
                        {!a.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={setDefaultAddressMutation.isPending}
                            onClick={async () => {
                              try {
                                await setDefaultAddressMutation.mutateAsync(i);
                                reloadProfile();
                                addToast("Default address updated.", "success");
                              } catch {
                                addToast(
                                  "Failed to update default address.",
                                  "error",
                                );
                              }
                            }}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={removeAddressMutation.isPending}
                          onClick={async () => {
                            if (!window.confirm("Remove this address?")) return;
                            try {
                              await removeAddressMutation.mutateAsync(i);
                              reloadProfile();
                              addToast(
                                "Address removed successfully.",
                                "success",
                              );
                            } catch {
                              addToast("Failed to remove address.", "error");
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          )}

          {user && tab === "wishlist" && (
            <div>
              <h3 className="dashboard-section-head">Wishlist</h3>
              <div className="wishlist-grid">
                {wishlistLoading ? (
                  <div className="wishlist-empty">Loading wishlist…</div>
                ) : wishlistError ? (
                  <div className="wishlist-empty">{wishlistError}</div>
                ) : wishlistProducts.length === 0 ? (
                  <div className="wishlist-empty">Your wishlist is empty.</div>
                ) : (
                  wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="wishlist-card"
                      onClick={() => onNavigate("product", p.slug)}
                    >
                      <img
                        src={p.image || ""}
                        alt={p.name}
                        className="wishlist-card__img"
                      />
                      <div className="wishlist-card__body">
                        <div className="wishlist-card__name">{p.name}</div>
                        <Price
                          price={p.price}
                          salePrice={p.salePrice || p.sale_price}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {user && tab === "logout" && (
            <div>
              <div className="logout-text">
                Are you sure you want to log out?
              </div>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSuccess={() => {
          setShowAddAddressModal(false);
          reloadProfile();
        }}
        showToast={addToast}
      />

      {/* Edit Address Modal */}
      <AddAddressModal
        isOpen={!!editAddress}
        onClose={() => setEditAddress(null)}
        onSuccess={() => {
          setEditAddress(null);
          reloadProfile();
        }}
        showToast={addToast}
        editIndex={editAddress?.index ?? null}
        initialData={editAddress?.data ?? null}
      />

      {/* Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentMethodModal}
        onClose={() => setShowAddPaymentMethodModal(false)}
        onSuccess={() => {
          setShowAddPaymentMethodModal(false);
          reloadProfile();
        }}
        showToast={addToast}
      />
    </div>
  );
}
