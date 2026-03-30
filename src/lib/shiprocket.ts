let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

export const getShiprocketToken = async () => {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),

  });
  console.log("EMAIL:", process.env.SHIPROCKET_EMAIL);
  console.log("PASSWORD:", process.env.SHIPROCKET_PASSWORD);

  const data = await response.json();
  console.log("Shiprocket Auth Response:", data);

  if (!data.token) {
    console.error("Shiprocket Auth Failed. Data:", data);
    throw new Error("Failed to authenticate with Shiprocket");
  }

  shiprocketToken = data.token;
  // Token usually expires in 10 days, but we'll refresh every 24 hours to be safe
  tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

  return shiprocketToken;
};

export const createShiprocketOrder = async (orderData: any) => {
  try {
    const token = await getShiprocketToken();

    const payload = {
      order_id: orderData.id,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      billing_customer_name: orderData.customerName,
      billing_last_name: "",
      billing_address: orderData.address,
      billing_city: orderData.city,
      billing_pincode: orderData.pincode,
      billing_state: orderData.state,
      billing_country: "India",
      billing_email: orderData.email,
      billing_phone: orderData.phone,
      shipping_is_billing: true,
      order_items: orderData.items.map((item: any) => ({
        name: item.name,
        sku: item.id || item.productId,
        units: parseInt(item.quantity.toString()),
        selling_price: parseFloat(item.price.toString()),
      })),
      payment_method: orderData.paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: parseFloat(orderData.totalAmount.toString()),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    console.log("Shiprocket Request Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    console.log("Shiprocket Response Status:", response.status);
    console.log("Shiprocket Response Data:", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error in createShiprocketOrder:", error);
    throw error;
  }
};
