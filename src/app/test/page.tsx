import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Type something..." className="mb-4" />
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </div>
  )
}