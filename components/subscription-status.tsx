"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Calendar, CreditCard, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

interface SubscriptionData {
  plan_type: string
  status: string
  hasActiveSubscription: boolean
  isExpired?: boolean
  daysUntilExpiry?: number
  current_period_end?: string
  billing_cycle?: string
  amount_cents?: number
  currency?: string
}

interface UsageData {
  current: number
  limit: number
  plan: string
}

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchSubscriptionData()
    }
  }, [user])

  const fetchSubscriptionData = async () => {
    try {
      const [subResponse, usageResponse] = await Promise.all([
        fetch("/api/user/subscription"),
        fetch("/api/user/usage")
      ])

      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData)
      }

      if (usageResponse.ok) {
        const usageData = await usageResponse.json()
        setUsage(usageData)
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error)
    } finally {
      setLoading(false)
    }
  }  co
nst handleUpgrade = () => {
    router.push("/pricing")
  }

  const handleManageSubscription = () => {
    // This would typically redirect to a customer portal
    // For now, redirect to pricing page
    router.push("/pricing")
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Unable to load subscription information.</p>
        </CardContent>
      </Card>
    )
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter": return "bg-blue-500"
      case "pro": return "bg-purple-500"
      case "premium": return "bg-gold-500"
      default: return "bg-gray-500"
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "starter": return "Starter"
      case "pro": return "Pro"
      case "premium": return "Premium"
      default: return "Free"
    }
  }

  const formatPrice = (cents: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(cents / 100)
  }

  const usagePercentage = usage ? (usage.current / usage.limit) * 100 : 0  retu
rn (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          Manage your subscription and view usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getPlanColor(subscription.plan_type)}>
              {getPlanName(subscription.plan_type)}
            </Badge>
            {subscription.hasActiveSubscription ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Inactive
              </Badge>
            )}
          </div>
          {subscription.amount_cents && (
            <div className="text-right">
              <p className="font-semibold">
                {formatPrice(subscription.amount_cents, subscription.currency)}
              </p>
              <p className="text-sm text-muted-foreground">
                per {subscription.billing_cycle}
              </p>
            </div>
          )}
        </div>

        {/* Expiry Warning */}
        {subscription.hasActiveSubscription && subscription.daysUntilExpiry && subscription.daysUntilExpiry <= 7 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Your subscription expires in {subscription.daysUntilExpiry} days
            </p>
          </div>
        >
  )
}Card
    </ent> </CardContdiv>
     
        </ )}         </>
        )}
                >
     </Button        rade
              Upg        pgrade}>
 {handleU onClick=Button        <
        ium" && (!== "preman_type ption.pl    {subscri          n>
  </Butto         n
   iocriptubse SManag              1">
  me="flex- classNaiption}scrleManageSubhandk={Cliconine" nt="outlutton varia   <B                   <>
 : (
         )     >
 </Button            Now
scribe     Sub     " />
     mr-2"h-4 w-4ame=d classN<CreditCar        1">
      flex-sName="de} clasndleUpgrack={ha onCli    <Button        tion ? (
cripsActiveSubstion.haripubsc{!s
          2"> gap-"flex=ameclassN      <div /}
  ons *Action Butt    {/*   )}

            </div>
 >
             </span)}
      ateString(toLocaleDod_end).rent_pericurption.bscri(su{new Datebilling:    Next    >
            <span    4" />
    h-4 w-e="Namr classlenda   <Ca      d">
   -foregrounxt-mutedt-sm tetexenter gap-2 items-cflex me="ssNacladiv    <       && (
_end eriodt_prenon.curpti& subscriiption &bscrasActiveSuption.hsubscri        {*/}
ng Date  Next Billi   {/*}

         )iv>
       </d
       }     )
       2" />"h-assName=)} cl00ge, 1tagePercenmin(usath.lue={Magress va    <Pro     (
     && == 999999 e.limit !      {usag  iv>
     </d        
    </span>          t}
   .limi: usage9 ? "∞" 9999t === 9 {usage.limicurrent} /ge.        {usa">
        oregroundd-ft-mutet-sm tex"tex=sNamespan clas      <
        pan>s month</sts thiium">Presesm font-medxt-="temespan classNa          <n">
    betweey- justifnters-ceem"flex itlassName=  <div c       3">
   pace-y-Name="sdiv class        <&& (
  iption veSubscrtion.hasActiipcr && subs  {usage}
       */onInformati/* Usage     {)}

    