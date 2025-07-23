interface PolarConfig {
  accessToken: string
  server?: string
}

class PolarClient {
  private accessToken: string
  private baseUrl: string

  constructor(config: PolarConfig) {
    this.accessToken = config.accessToken
    this.baseUrl = config.server || "https://api.polar.sh"
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Polar API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async createCheckoutSession(data: {
    product_id: string
    price_id: string
    success_url: string
    customer_email?: string
  }) {
    return this.request("/v1/checkouts/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCustomerPortalUrl(customer_id: string) {
    return this.request(`/v1/customers/${customer_id}/portal`)
  }

  async getSubscription(subscription_id: string) {
    return this.request(`/v1/subscriptions/${subscription_id}`)
  }

  async listSubscriptions(customer_id?: string) {
    const params = customer_id ? `?customer_id=${customer_id}` : ""
    return this.request(`/v1/subscriptions${params}`)
  }
}

export function createPolarClient(): PolarClient | null {
  const accessToken = process.env.POLAR_ACCESS_TOKEN

  if (!accessToken) {
    console.warn("Polar access token not configured")
    return null
  }

  return new PolarClient({
    accessToken,
    server: process.env.POLAR_SERVER,
  })
}
