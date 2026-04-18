import { createShiprocketOrder } from "./src/lib/shiprocket";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  console.log("Testing Shiprocket Order Creation...");
  try {
    const dummyOrder = {
      id: "TEST_ORDER_" + Math.floor(Math.random() * 1000000),
      customerName: "Test User",
      address: "123 Test Street",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
      email: "test@example.com",
      phone: "9876543210",
      paymentMethod: "cod",
      totalAmount: 500,
      items: [
        {
          id: "prod_123",
          name: "Test Product",
          quantity: 1,
          price: "500",
        }
      ]
    };

    const response = await createShiprocketOrder(dummyOrder);
    console.log("Test Completed successfully!");
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

test();
