import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { CreditCardIcon, Copy, CheckCircle2, Wifi } from "lucide-react"

interface CreditCardProps {
  number: string
  holderName: string
  expiryDate: string
  cvc?: string
  className?: string
  variant?: "default" | "platinum" | "black" | "gold"
}

export function CreditCard({ number, holderName, expiryDate, cvc, className, variant = "default" }: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCardBackground = () => {
    switch (variant) {
      case "platinum":
        return "bg-gradient-to-r from-slate-500 to-slate-700"
      case "black":
        return "bg-gradient-to-r from-gray-900 to-black"
      case "gold":
        return "bg-gradient-to-r from-amber-500 to-yellow-600"
      default:
        return "bg-gradient-to-r from-primary to-blue-600"
    }
  }

  const formatCardNumber = (num: string) => {
    // Show only last 4 digits, rest as asterisks
    return `**** **** **** ${num.slice(-4)}`
  }

  return (
    <div className={cn("relative w-full h-56", className)}>
      <motion.div
        className="w-full h-full perspective-1000"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => cvc && setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute w-full h-full rounded-xl p-6 text-white overflow-hidden backface-hidden",
            getCardBackground(),
          )}
        >
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
            <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-12 -translate-y-12 w-40 h-80"></div>
            <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-32 -translate-y-8 w-40 h-80"></div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Banking App</p>
              <p className="text-xs opacity-60 mt-1">Virtual Card</p>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 opacity-80" />
              <CreditCardIcon className="h-8 w-8" />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center">
              <p className="text-xl tracking-widest">{formatCardNumber(number)}</p>
              <button
                onClick={() => copyToClipboard(number)}
                className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-300" /> : <Copy className="h-4 w-4 opacity-70" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-end mt-10">
            <div>
              <p className="text-xs opacity-80">Card Holder</p>
              <p className="text-sm font-medium">{holderName}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Expires</p>
              <p className="text-sm font-medium">{expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        {cvc && (
          <div
            className={cn(
              "absolute w-full h-full rounded-xl overflow-hidden backface-hidden rotate-y-180",
              getCardBackground(),
            )}
          >
            <div className="w-full h-12 bg-black/30 mt-10"></div>
            <div className="px-6 mt-6">
              <div className="bg-white/80 h-10 flex items-center justify-end px-4 rounded">
                <p className="text-gray-800 font-mono font-bold">{cvc}</p>
              </div>
              <p className="text-xs text-white/70 mt-4 text-right">
                This is a virtual card for online transactions.
                <br />
                Keep your CVC code confidential.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

