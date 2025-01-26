import { google } from "googleapis"
import { NextResponse } from "next/server"

const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

if (!credentialsJson) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON is not set")
}

const credentials = JSON.parse(credentialsJson)

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
const analyticsPropertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

if (!analyticsPropertyId) {
  throw new Error("GOOGLE_ANALYTICS_PROPERTY_ID is not set")
}

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    })

    const analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth,
    })

    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${analyticsPropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      },
    })

    const formattedData =
      response.data.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value,
        activeUsers: Number.parseInt(row.metricValues?.[0].value || "0", 10),
        pageViews: Number.parseInt(row.metricValues?.[1].value || "0", 10),
      })) || []

    return NextResponse.json(formattedData)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Google Analytics data:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
  }
}

