import React, { useRef, useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

function App() {
  // State variables
  const [principal, setPrincipal] = useState(5000);
  const [downPayment, setDownPayment] = useState(1000);
  const [loanAmount, setLoanAmount] = useState(4000);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(5);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalEMI, setTotalEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Calculate whenever dependencies change
  useEffect(() => {
    const calculateEMI = () => {
      const monthlyInterest = interestRate / 100 / 12;
      const months = years * 12;
      
      if (loanAmount > 0 && monthlyInterest > 0 && months > 0) {
        const emi = 
          (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
          (Math.pow(1 + monthlyInterest, months) - 1);
        
        setMonthlyEMI(emi.toFixed(2));
        setTotalEMI((emi * months).toFixed(2));
        setTotalInterest((emi * months - loanAmount).toFixed(2));
      }
    };

    calculateEMI();
  }, [loanAmount, interestRate, years]);

  // Handler functions
  const handlePrincipalChange = (value) => {
    const newPrincipal = Math.max(0, Number(value));
    setPrincipal(newPrincipal);
    setDownPayment(Math.min(downPayment, newPrincipal));
    setLoanAmount(newPrincipal - downPayment);
  };

  const handleDownPaymentChange = (value) => {
    const newDown = Math.max(0, Math.min(Number(value), principal));
    setDownPayment(newDown);
    setLoanAmount(principal - newDown);
  };

  return (
    <div className="container min-h-screen bg-amber-50 flex flex-col md:flex-row gap-8 p-6">
      {/* Input Section */}
      <div className="inputs w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="space-y-4">
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal (${principal})
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={principal}
              onChange={(e) => handlePrincipalChange(e.target.value)}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment (${downPayment})
            </label>
            <input
              type="range"
              min="0"
              max={principal}
              step="1000"
              value={downPayment}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (${loanAmount})
            </label>
            <input
              type="range"
              min="0"
              max={principal}
              step="1000"
              value={loanAmount}
              readOnly
              className="w-full accent-indigo-600 cursor-not-allowed"
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate ({interestRate}%)
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Tenure
            </label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              {[5, 10, 15, 20].map((year) => (
                <option key={year} value={year}>
                  {year} years
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-600 border-b pb-2">
          Loan Summary
        </h2>
        
        <div className="space-y-4">
          <div className="stat-card bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Monthly EMI</h3>
            <p className="text-2xl font-bold text-green-600">${monthlyEMI}</p>
          </div>
          
          <div className="stat-card bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Interest</h3>
            <p className="text-2xl font-bold text-red-600">${totalInterest}</p>
          </div>
          
          <div className="stat-card bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Payment</h3>
            <p className="text-2xl font-bold text-blue-600">${totalEMI}</p>
          </div>
        </div>

        <div className="chart-container h-64">
          <Pie
            data={{
              labels: ["Principal", "Interest"],
              datasets: [{
                data: [loanAmount, totalInterest],
                backgroundColor: ["#6366f1", "#f97316"],
                borderWidth: 0,
              }]
            }}
            options={{
              plugins: {
                legend: { position: 'bottom' }
              },
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;