const SHIP_ENGINE_API_KEY = process.env.TEST_SHIPENGINE_API_KEY;
const SHIP_ENGINE_API_URL = "https://api.shipengine.com/v1/labels"

async function validateAddress(address: any) {
  const VALIDATE_ADDRESS_URL = "https://api.shipengine.com/v1/addresses/validate";
  
  if (!SHIP_ENGINE_API_KEY) {
    throw new Error("ShipEngine API key is not defined");
  }
  
  try {
    const response = await fetch(VALIDATE_ADDRESS_URL, {
      method: "POST",
      headers: {
        "API-Key": SHIP_ENGINE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([address]),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ShipEngine API error response:", errorBody);
      throw new Error(`ShipEngine API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0];
  } catch (error) {
    console.error("Error validating address:", error);
    throw error;
  }
}

export async function createShippingLabel(customerDetails: any, items: any[]) {
  const shipment = {
    carrier_id: "se-1610072", // stamps_com
    service_code: "usps_priority_mail_international", // Changed to international service
    ship_to: {
      name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      phone: customerDetails.phoneNumber,
      address_line1: customerDetails.houseNo,
      city_locality: "Karachi",
      state_province: "SD", // ISO 3166-2 code for Sindh
      postal_code: customerDetails.postalCode,
      country_code: "PK",
      address_residential_indicator: "yes",
    },
    ship_from: {
      name: "Your Clothing Brand Ltd.",
      phone: "+92 3311245238",
      company_name: "Your Clothing Brand Ltd.",
      address_line1: "123 Warehouse St",
      city_locality: "Karachi",
      state_province: "SD", // ISO 3166-2 code for Sindh
      postal_code: "75950",
      country_code: "PK",
      address_residential_indicator: "no",
    },
    packages: [
      {
        weight: {
          value: 1,
          unit: "pound"
        },
        dimensions: {
          height: 6,
          width: 12,
          length: 24,
          unit: "inch"
        }
      }
    ],
    customs: {
      contents: "merchandise",
      non_delivery: "return_to_sender",
      customs_items: items.map(item => ({
        description: item.name,
        quantity: item.quantity,
        value: {
          amount: item.price,
          currency: "USD"
        },
        harmonized_tariff_code: "6103.42.1020",
        country_of_origin: "PK",
        unit_of_measure: "EA",
        sku: item.productId
      })),
      declaration: "I hereby certify that the information contained in this shipment is accurate and complete.",
      invoice_number: `INV-${Date.now()}`,
      reason_for_export: "sale"
    }
  }

  console.log("Shipment data being sent to ShipEngine:", JSON.stringify(shipment, null, 2))

  // In your createShippingLabel function, add these lines before creating the shipment:
  const validatedShipTo = await validateAddress(shipment.ship_to);
  const validatedShipFrom = await validateAddress(shipment.ship_from);

  // Update the shipment object with the validated addresses
  shipment.ship_to = validatedShipTo.matched_address;
  shipment.ship_from = validatedShipFrom.matched_address;

  try {
    if (!SHIP_ENGINE_API_KEY) {
      throw new Error("ShipEngine API key is not defined")
    }

    const response = await fetch(SHIP_ENGINE_API_URL, {
      method: "POST",
      headers: {
        "API-Key": SHIP_ENGINE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipment }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("ShipEngine API error response:", errorBody)
      throw new Error(`ShipEngine API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating shipping label:", error)
    throw error
  }
}

