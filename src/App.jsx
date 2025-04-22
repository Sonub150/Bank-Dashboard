import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [principal, setPrincipal] = useState(5000);
  const [downPayment, setDownPayment] = useState(1000);
  const [loanAmount, setLoanAmount] = useState(4000);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(5);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalEMI, setTotalEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
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
  }, [loanAmount, interestRate, years]);

  const handlePrincipalChange = (val) => {
    const newVal = Math.max(0, Number(val));
    setPrincipal(newVal);
    setDownPayment(Math.min(downPayment, newVal));
    setLoanAmount(newVal - downPayment);
  };

  const handleDownPaymentChange = (val) => {
    const newDown = Math.max(0, Math.min(Number(val), principal));
    setDownPayment(newDown);
    setLoanAmount(principal - newDown);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 p-10 font-[Poppins] text-gray-800">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white bg-opacity-80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6 border border-white/30 transition hover:shadow-amber-300">
          <h2 className="text-3xl font-bold text-indigo-600 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            💰 Loan Configuration
          </h2>

          <div className="space-y-5">
            {/* Principal */}
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Principal: <span className="text-indigo-600">${principal}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={principal}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                className="w-full slider"
              />
            </div>

            {/* Down Payment */}
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Down Payment: <span className="text-orange-500">${downPayment}</span>
              </label>
              <input
                type="range"
                min="0"
                max={principal}
                step="1000"
                value={downPayment}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                className="w-full slider"
              />
            </div>

            {/* Loan Amount */}
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Loan Amount: <span className="text-gray-700">${loanAmount}</span>
              </label>
              <input
                type="range"
                value={loanAmount}
                readOnly
                className="w-full cursor-not-allowed bg-gray-200 rounded-full"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Interest Rate: <span className="text-pink-500">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="2"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full slider"
              />
            </div>

            {/* Tenure */}
            <div>
              <label className="text-sm font-semibold mb-1 block">Loan Tenure</label>
              <select
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {[5, 10, 15, 20].map((y) => (
                  <option key={y} value={y}>
                    {y} years
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white bg-opacity-80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6 border border-white/30 transition hover:shadow-purple-300">
          <h2 className="text-3xl font-bold text-indigo-600 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            📊 Loan Summary
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="bg-green-100/60 p-4 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xs text-green-700">Monthly EMI</h3>
              <p className="text-xl font-bold text-green-700">${monthlyEMI}</p>
            </div>
            <div className="bg-red-100/60 p-4 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xs text-red-700">Total Interest</h3>
              <p className="text-xl font-bold text-red-700">${totalInterest}</p>
            </div>
            <div className="bg-blue-100/60 p-4 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xs text-blue-700">Total Payment</h3>
              <p className="text-xl font-bold text-blue-700">${totalEMI}</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="h-72 mt-4 bg-white/80 p-4 rounded-xl shadow-inner">
            <Pie
              data={{
                labels: ["Principal", "Interest"],
                datasets: [
                  {
                    data: [loanAmount, totalInterest],
                    backgroundColor: ["#6366f1", "#f97316"],
                    borderWidth: 2,
                    borderColor: "#fff",
                    hoverOffset: 8,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#374151",
                      font: { size: 14 },
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
