"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestSupabasePage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-supabase")
      const results = await response.json()
      setTestResults(results)
    } catch (error) {
      setTestResults({ error: "Failed to run tests" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
        <p className="text-muted-foreground">
          Test your Supabase connection and verify all tables are set up correctly.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Run Supabase Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={isLoading} className="mb-4">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Test Supabase Connection"
            )}
          </Button>

          {testResults && (
            <div className="space-y-4">
              {testResults.error ? (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>Error: {testResults.error}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(testResults).map(([test, result]: [string, any]) => (
                    <div key={test} className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {test.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      {result.count !== undefined && (
                        <span className="text-muted-foreground">({result.count} records)</span>
                      )}
                      {result.error && <span className="text-red-600 text-sm">- {result.error}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>✅ Supabase project created</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              <span>⏳ Run scripts/supabase_schema.sql in Supabase SQL editor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              <span>⏳ Configure environment variables</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              <span>⏳ Test Supabase connection (click button above)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
