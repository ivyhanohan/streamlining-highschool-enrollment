
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Landmark, Wallet } from 'lucide-react';

type PaymentFormProps = {
  onPaymentComplete: (paymentMethod: string, paymentDetails: any) => void;
  onCancel: () => void;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Credit card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Bank transfer state
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate based on payment method
    if (paymentMethod === "credit_card") {
      if (!cardNumber || !cardName || !expiry || !cvc) {
        toast({
          title: "Missing Information",
          description: "Please fill in all credit card details.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === "bank_transfer") {
      if (!accountName || !accountNumber || !bankName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all bank transfer details.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    }

    // Simulate payment processing
    setTimeout(() => {
      // Create payment details object based on payment method
      const paymentDetails = paymentMethod === "credit_card"
        ? {
            cardNumber: cardNumber.replace(/\d(?=\d{4})/g, "*"),
            cardName,
            expiry
          }
        : {
            accountName,
            accountNumber: accountNumber.replace(/\d(?=\d{4})/g, "*"),
            bankName
          };

      onPaymentComplete(paymentMethod, paymentDetails);
      setIsProcessing(false);

      // Show success message
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
    }, 2000);
  };

  // Handle card number formatting
  const formatCardNumber = (input: string) => {
    // Remove non-digits
    const value = input.replace(/\D/g, '');
    // Add a space after every 4 digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  // Handle expiry date formatting
  const formatExpiry = (input: string) => {
    // Remove non-digits
    const value = input.replace(/\D/g, '');
    // Format as MM/YY
    if (value.length > 2) {
      return `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    return value;
  };

  return (
    <Card className="shadow-lg max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Payment Information</CardTitle>
        <CardDescription>
          Please provide your payment details to complete enrollment.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">Select Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col space-y-1 sm:flex-row sm:space-x-6 sm:space-y-0"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Credit Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex items-center">
                    <Landmark className="mr-2 h-4 w-4" /> Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod === "credit_card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiration Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === "bank_transfer" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountName"
                    placeholder="John Smith"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Payment Summary</h3>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex justify-between py-1">
                  <span>Enrollment Fee</span>
                  <span>₱1,000.00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Processing Fee</span>
                  <span>₱0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2 font-bold">
                  <span>Total</span>
                  <span>₱1,000.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
