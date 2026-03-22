// ─── DashboardPage.jsx ─────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUpdateProfile } from "../../hooks/useAuthMutations";
import { orderApi, productApi, getApiErrorMessage } from "../../utils/api";
import { Icons } from "../common/Icons";
import { Button } from "../common/Button";
import { Chip } from "../common/Chip";
import { Price } from "../common/Price";
import useToastStore from "../../stores/toastStore";
import { AddAddressModal } from "../modals/AddAddressModal";
import { AddPaymentMethodModal } from "../modals/AddPaymentMethodModal";

export function DashboardPage({ onNavigate }) {
  const { user, refetch: refetchUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const { addToast } = useToastStore();

  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] =
    useState(false);
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
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 20px" }}>
      <div style={{ marginBottom: 28 }}>
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
          Welcome back
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
          My Account
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "210px 1fr",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid #ede5d8",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(26,16,8,0.05)",
          }}
        >
          {/* User header */}
          <div
            style={{
              padding: "22px 16px",
              textAlign: "center",
              background: "linear-gradient(145deg, #0f0a04, #2d1a0e)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e8637a, #c9933a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                margin: "0 auto 10px",
                boxShadow: "0 4px 14px rgba(232,99,122,0.4)",
              }}
            >
              👤
            </div>
            <div style={{ color: "#faf7f2", fontWeight: 700, fontSize: 13.5 }}>
              {user?.name || "Guest"}
            </div>
            <div style={{ color: "#7a6d5e", fontSize: 11.5, marginTop: 3 }}>
              {user?.email || ""}
            </div>
          </div>

          {tabs.map(([id, ico, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "11px 16px",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                textAlign: "left",
                fontFamily: "inherit",
                background: tab === id ? "#fde8ec" : "transparent",
                color: tab === id ? "#e8637a" : "#3d2415",
                fontWeight: tab === id ? 700 : 500,
                borderRight:
                  tab === id ? "3px solid #e8637a" : "3px solid transparent",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <span style={{ fontSize: 15 }}>{ico}</span> {label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid #ede5d8",
            padding: "26px",
            boxShadow: "0 4px 20px rgba(26,16,8,0.05)",
            minHeight: 400,
          }}
        >
          {!user && (
            <div style={{ color: "#8c7e6e" }}>
              <div
                style={{
                  fontWeight: 800,
                  color: "#1a1008",
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                Sign in to view your account
              </div>
              <div
                style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 16 }}
              >
                Your profile, orders, addresses, and wishlist are available
                after login.
              </div>
              <Button onClick={() => onNavigate("auth")}>Go to Login</Button>
            </div>
          )}

          {user && tab === "profile" && (
            <form onSubmit={handleSaveProfile}>
              <SectionHead>Profile</SectionHead>
              <div style={{ display: "grid", gap: 14, maxWidth: 480 }}>
                {[
                  ["First Name", "first_name"],
                  ["Last Name", "last_name"],
                  ["Email", "email"],
                  ["Phone", "phone_number"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label
                      style={{
                        fontSize: 10.5,
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
                    <input
                      value={profileForm[key] || ""}
                      onChange={handleProfileChange(key)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#e8637a")}
                      onBlur={(e) => (e.target.style.borderColor = "#ede5d8")}
                    />
                  </div>
                ))}

                {profileMessage && (
                  <div style={{ color: "#1a1008", fontSize: 13.5 }}>
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div style={{ color: "#e8637a", fontSize: 13.5 }}>
                    {profileError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  style={{
                    padding: "11px 22px",
                    background: "linear-gradient(135deg, #e8637a, #d44f67)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(232,99,122,0.35)",
                    transition: "transform 0.15s",
                    opacity: updateProfileMutation.isLoading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-1px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "none")
                  }
                >
                  {updateProfileMutation.isLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {user && tab === "orders" && (
            <div>
              <SectionHead>Order History</SectionHead>
              {ordersLoading && (
                <p style={{ fontSize: 13.5, color: "#8c7e6e" }}>
                  Loading your orders…
                </p>
              )}
              {!ordersLoading && orders.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#8c7e6e",
                  }}
                >
                  <div style={{ fontSize: 42, marginBottom: 12 }}>📦</div>
                  <p style={{ margin: 0, fontSize: 13.5 }}>
                    No orders yet. Start shopping to see them here.
                  </p>
                </div>
              )}
              {orders.map((o) => (
                <div
                  key={o.id || o.order_number}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 16px",
                    border: "1.5px solid #ede5d8",
                    borderRadius: 14,
                    marginBottom: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#faf7f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        marginBottom: 3,
                      }}
                    >
                      {o.order_number || o.id}
                    </div>
                    <div style={{ fontSize: 12, color: "#8c7e6e" }}>
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
                  <strong style={{ fontSize: 14 }}>
                    ${(parseFloat(o.grand_total) || 0).toFixed(2)}
                  </strong>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <SectionHead style={{ margin: 0 }}>Addresses</SectionHead>
                <Button size="sm" onClick={() => setShowAddAddressModal(true)}>
                  + Add
                </Button>
              </div>
              {(Array.isArray(user.addresses) ? user.addresses : []).length ===
              0 ? (
                <div style={{ color: "#8c7e6e", fontSize: 13.5 }}>
                  You don’t have any saved addresses yet.
                </div>
              ) : (
                (Array.isArray(user.addresses) ? user.addresses : []).map(
                  (a, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "15px 16px",
                        borderRadius: 14,
                        marginBottom: 10,
                        border: `2px solid ${a.is_default ? "#e8637a" : "#ede5d8"}`,
                        background: a.is_default ? "#fff9fa" : "white",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <Icons.Pin />
                        <strong style={{ fontSize: 13.5 }}>
                          {a.recipient_name}
                        </strong>
                        {a.is_default && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#e8637a",
                              background: "rgba(232,99,122,0.1)",
                              padding: "2px 8px",
                              borderRadius: 20,
                            }}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: "#5c4a37" }}>
                        {[
                          a.street,
                          a.building,
                          `${a.city} ${a.postal_code}`.trim(),
                          a.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        {!a.is_default && (
                          <Button variant="ghost" size="sm">
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          )}

          {user && tab === "wishlist" && (
            <div>
              <SectionHead>Wishlist</SectionHead>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 14,
                }}
              >
                {wishlistLoading ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      color: "#8c7e6e",
                      fontSize: 13.5,
                    }}
                  >
                    Loading wishlist…
                  </div>
                ) : wishlistError ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      color: "#8c7e6e",
                      fontSize: 13.5,
                    }}
                  >
                    {wishlistError}
                  </div>
                ) : wishlistProducts.length === 0 ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      color: "#8c7e6e",
                      fontSize: 13.5,
                    }}
                  >
                    Your wishlist is empty.
                  </div>
                ) : (
                  wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        border: "1.5px solid #ede5d8",
                        borderRadius: 16,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        boxShadow: "0 2px 8px rgba(26,16,8,0.04)",
                      }}
                      onClick={() => onNavigate("product", p.slug)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 22px rgba(26,16,8,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(26,16,8,0.04)";
                      }}
                    >
                      <img
                        src={p.image || ""}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: 130,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div style={{ padding: "10px 12px" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 12,
                            marginBottom: 4,
                            lineHeight: 1.3,
                          }}
                        >
                          {p.name}
                        </div>
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
            <div style={{ color: "#8c7e6e" }}>
              <div style={{ fontSize: 13.5, marginBottom: 10 }}>
                Are you sure you want to log out?
              </div>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSuccess={() => {
          setShowAddAddressModal(false);
          refetchUser?.();
        }}
        showToast={addToast}
      />

      {/* Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentMethodModal}
        onClose={() => setShowAddPaymentMethodModal(false)}
        onSuccess={() => {
          setShowAddPaymentMethodModal(false);
          refetchUser?.();
        }}
        showToast={addToast}
      />
    </div>
  );
}

function SectionHead({ children, style }) {
  return (
    <h3
      style={{
        fontWeight: 700,
        fontSize: 16.5,
        margin: "0 0 18px",
        color: "#1a1008",
        ...style,
      }}
    >
      {children}
    </h3>
  );
}
