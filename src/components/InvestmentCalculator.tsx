import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DollarSign, TrendingUp, Calendar, Percent } from 'lucide-react';

interface InvestmentCalculatorProps {
  propertyPrice: number;
}

const InvestmentCalculator = ({ propertyPrice }: InvestmentCalculatorProps) => {
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [appreciationRate, setAppreciationRate] = useState(8);

  const loanAmount = propertyPrice - (propertyPrice * downPayment) / 100;
  const monthlyRate = interestRate / 12 / 100;
  const numberOfPayments = loanTenure * 12;
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayment = emi * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;
  const futureValue = propertyPrice * Math.pow(1 + appreciationRate / 100, loanTenure);
  const totalGain = futureValue - propertyPrice;
  const roi = ((totalGain / propertyPrice) * 100).toFixed(2);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lac`;
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Investment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Down Payment</Label>
            <span className="text-sm font-medium">{downPayment}% ({formatCurrency(propertyPrice * downPayment / 100)})</span>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            min={10}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Interest Rate</Label>
            <span className="text-sm font-medium">{interestRate}% per annum</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={6}
            max={15}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Loan Tenure */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Loan Tenure</Label>
            <span className="text-sm font-medium">{loanTenure} years</span>
          </div>
          <Slider
            value={[loanTenure]}
            onValueChange={(value) => setLoanTenure(value[0])}
            min={5}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Appreciation Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Expected Appreciation</Label>
            <span className="text-sm font-medium">{appreciationRate}% per year</span>
          </div>
          <Slider
            value={[appreciationRate]}
            onValueChange={(value) => setAppreciationRate(value[0])}
            min={3}
            max={15}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Results */}
        <div className="space-y-4 pt-6 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(emi)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-lg font-bold">{formatCurrency(loanAmount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-lg font-bold">{formatCurrency(totalInterest)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Payment</p>
              <p className="text-lg font-bold">{formatCurrency(totalPayment)}</p>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Future Value ({loanTenure} years)</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(futureValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Expected Gain
              </span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(totalGain)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Percent className="w-4 h-4" />
                ROI
              </span>
              <span className="text-lg font-bold text-green-600">{roi}%</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-4 border-t">
          *This is an estimated calculation. Actual values may vary based on lender terms and market conditions.
        </p>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;
