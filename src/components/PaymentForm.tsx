
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, ArrowRight, Check } from 'lucide-react';

interface PaymentFormProps {
  onPaymentComplete: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'gcash'>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [gcashNumber, setGcashNumber] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your enrollment fee payment of ₱1,000 has been processed.",
      });
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Card className="shadow-lg w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enrollment Fee Payment</CardTitle>
        <CardDescription>
          Please pay the enrollment fee of ₱1,000 to complete your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Select Payment Method</h3>
              <RadioGroup
                defaultValue="credit-card"
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'credit-card' | 'gcash')}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    Credit Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gcash" id="gcash" />
                  <Label htmlFor="gcash" className="flex items-center cursor-pointer">
                    <Smartphone className="mr-2 h-5 w-5 text-primary" />
                    GCash
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'credit-card' ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardInfo.cardNumber}
                    onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input 
                    id="cardName"
                    placeholder="John Doe"
                    value={cardInfo.cardName}
                    onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardInfo.expiryDate}
                      onChange={(e) => setCardInfo({...cardInfo, expiryDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gcashNumber">GCash Number</Label>
                  <Input 
                    id="gcashNumber"
                    placeholder="09XX XXX XXXX"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    1. Open your GCash app
                    <br />
                    2. Enter the school's GCash number: 09123456789
                    <br />
                    3. Enter the amount: ₱1,000
                    <br />
                    4. Use your application reference as payment description
                  </p>
                </div>
              </div>
            )}

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Enrollment Fee:</span>
                <span className="font-medium">₱1,000.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>₱1,000.00</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing}
          className="min-w-[120px]"
        >
          {isProcessing ? (
            <>Processing<span className="ml-2 animate-pulse">...</span></>
          ) : (
            <>Pay ₱1,000 <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
