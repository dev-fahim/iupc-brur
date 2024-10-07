"use client"

import SectionHeader from "@/components/sections/header"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form" // Adjust the path to your shadcn components
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { CardTitle } from "@/components/ui/card"
import { CheckboxIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as z from "zod"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

type PaymentFormValues = {
  paymentMethod: string
  trxId: string
}

const paymentFormSchema = z.object({
  paymentMethod: z
    .string()
    .min(1, "Payment method is required") // Ensure it's not empty
    .refine(
      (val) => val === "Bkash" || val === "Nagad" || val === "Rocket",
      "Invalid payment method"
    ),
  trxId: z
    .string()
    .min(8, "Transaction ID must be at least 8 characters") // Example length validation
    .nonempty("Transaction ID is required"),
})

const TeamPaymentPage = ({ params }: { params: { objectId: string } }) => {
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null)
  const [trxId, setTrxId] = useState<string | null>(null) // New trxId state
  const [teamId, setTeamId] = useState<number | null>(null) // New teamId state
  const [isLoading, setIsLoading] = useState<boolean>(true) // New loading state

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "",
      trxId: "",
    },
  })

  // Fetch team data using useEffect
  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true) // Start loading
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/team-registration/${params.objectId}`,
          {
            method: "GET",
          }
        )
        const data = await response.json()
        console.log("Team data after reg. : ", data)
        setPaymentStatus(data.paymentStatus) // Set paymentStatus state
        setTrxId(data.trxId) // Store trxId if available
        setTeamId(data.teamId)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false) // Stop loading after fetching
      }
    }

    if (params.objectId) {
      fetchTeam()
    }
  }, [params.objectId])

  const onSubmit = async (values: PaymentFormValues) => {
    const toastId = toast({
      title: "Submitting...",
      description: (
        <div className="flex items-center space-x-2">
          <div className="animate-spin">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>{" "}
          <span className="sr-only">Loading...</span>
          {/* Loading spinner */}
          <span>Sending payment info, please wait...</span>
        </div>
      ),
    })

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/team-registration/payment/${params.objectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trxId: values.trxId,
            paymentMethod: values.paymentMethod,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setPaymentStatus(data.paymentStatus) // Update the payment status in UI
        setTrxId(data.trxId) // Update trxId in the state

        // Trigger success toast
        toast({
          title: "✅ Payment Information Sent",
          description:
            "Your payment information has been sent successfully. We will process it soon.",
        })

        form.reset()

        console.log("Payment information updated successfully:", data)
      } else {
        console.error("❌ Failed to update payment information")
      }
    } catch (error) {
      console.error("Error submitting payment information:", error)
    }
  }

  return (
    <div className="relative w-full py-24 overflow-hidden min-h-screen bg-black text-white items-center justify-between">
      <Link
        href="/"
        className="absolute text-zinc-500 hover:text-zinc-400 transition-all duration-200 -translate-y-12 translate-x-12"
      >
        &larr; Go Back
      </Link>
      <div className="mt-12" />

      {/* Show loading message while fetching */}
      {isLoading ? (
        <p className="text-center text-lg text-zinc-400">
          Retrieving payment info, please wait...
        </p>
      ) : (
        <>
          {/* Conditionally render based on paymentStatus and trxId */}
          {paymentStatus === true ? (
            // Completed Status
            <>
              <CheckboxIcon className="text-green-500 w-12 h-12 mx-auto" />
              <h1 className="text-5xl text-center mt-8 font-bold text-zinc-100">
                Payment Verification Complete!
              </h1>
              <p className="text-zinc-400 text-center mt-2">
                Thanks for making the payment. Your team has successfully been
                registered.
              </p>
            </>
          ) : trxId && paymentStatus === false ? (
            // Processing Status
            <>
              <InfoCircledIcon className="text-yellow-500 w-12 h-12 mx-auto" />
              <h1 className="text-5xl text-center mt-8 font-bold text-zinc-100">
                Payment is being processed
              </h1>
              <p className="text-zinc-400 text-center mt-2">
                We've received your transaction ID. Please wait while we verify
                your payment.
              </p>
            </>
          ) : (
            // Pending Status (No trxId)
            <>
              <SectionHeader title="Payment Verification" subtitle={<></>} />
              <div className="max-w-md mx-auto p-6">
                <p className="text-zinc-200 pb-8">Reference: {teamId}</p>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Payment Method Selector */}
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bkash">Bkash</SelectItem>
                                <SelectItem value="Nagad">Nagad</SelectItem>
                                <SelectItem value="Rocket">Rocket</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Transaction ID Input */}
                    <FormField
                      control={form.control}
                      name="trxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction ID</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter transaction ID"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>

                <p className="mt-4 text-zinc-500">or</p>
                <Link href="/" className="text-zinc-300 underline mt-2">
                  Pay Later
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default TeamPaymentPage
