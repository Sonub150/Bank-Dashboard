import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Optional Error Boundary Component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600">Error loading chart.</div>;
    }
    return this.props.children;
  }
}

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

  // EMI Calculation logic
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

  // Handlers for input changes
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
    <div className="container min-h-screen bg-gradient-to-tr from-amber-50 to-yellow-100 p-6 flex flex-col md:flex-row gap-8">
      {/* Input Section */}
      <div className="inputs w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-indigo-600 border-b pb-2">Loan Configuration</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loan Amount (${loanAmount})
          </label>
          <input
            type="range"
            value={loanAmount}
            readOnly
            className="w-full accent-indigo-300 cursor-not-allowed bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Interest Rate ({interestRate}%)
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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

      {/* Results Section */}
      <div className="results w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-700 border-b pb-2">
          Loan Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 p-4 rounded-xl shadow-inner">
            <h3 className="text-sm font-medium text-green-800">Monthly EMI</h3>
            <p className="text-2xl font-bold text-green-700">${monthlyEMI}</p>
          </div>

          <div className="bg-red-100 p-4 rounded-xl shadow-inner">
            <h3 className="text-sm font-medium text-red-800">Total Interest</h3>
            <p className="text-2xl font-bold text-red-600">${totalInterest}</p>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl shadow-inner">
            <h3 className="text-sm font-medium text-blue-800">Total Payment</h3>
            <p className="text-2xl font-bold text-blue-600">${totalEMI}</p>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="h-64">
          <ErrorBoundary>
            <Pie
              key={`${loanAmount}-${totalInterest}`} // Force remount on change
              data={{
                labels: ["Principal", "Interest"],
                datasets: [
                  {
                    data: [loanAmount, totalInterest],
                    backgroundColor: ["#6366f1", "#f97316"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#4B5563", font: { size: 14 } },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
