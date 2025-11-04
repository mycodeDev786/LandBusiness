"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Expense } from "@/types/expense";
import {
  PlusCircleIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else window.location.href = "/login";
    });

    const unsubscribeExpenses = onSnapshot(
      collection(db, "expenses"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];
        setExpenses(data);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeExpenses();
    };
  }, []);

  const handleAddExpense = async () => {
    if (!user || !amount || !desc) return;

    const email = user.email?.toLowerCase() || "";
    const addedBy = email.includes("azhar") ? "Azhar" : "Dr Shahzad";

    await addDoc(collection(db, "expenses"), {
      amount: parseFloat(amount),
      description: desc,
      addedBy,
      date: new Date().toISOString(),
    });

    setShowModal(false);
    setAmount("");
    setDesc("");
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const azharExpenses = expenses.filter((e) => e.addedBy === "Azhar");
  const shahzadExpenses = expenses.filter((e) => e.addedBy === "Dr Shahzad");
  const azharTotal = azharExpenses.reduce((sum, e) => sum + e.amount, 0);
  const shahzadTotal = shahzadExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-semibold">Land Expense Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          Logout
        </button>
      </header>

      {/* Totals */}
      <main className="p-6 flex-1">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-gray-600 text-lg mb-2">Total Expenses</h2>
            <p className="text-3xl font-bold text-blue-600">PKR {total}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-gray-600 text-lg mb-2">Dr Shahzad’s Total</h2>
            <p className="text-3xl font-bold text-purple-600">
              PKR {shahzadTotal}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-gray-600 text-lg mb-2">Azhar’s Total</h2>
            <p className="text-3xl font-bold text-green-600">
              PKR {azharTotal}
            </p>
          </div>
        </div>

        {/* Partner Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Dr Shahzad’s Table */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-4">
              <UserCircleIcon className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Dr Shahzad’s Expenses
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {shahzadExpenses.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{e.description}</td>
                    <td className="py-2 font-medium text-purple-600">
                      PKR {e.amount}
                    </td>
                    <td className="py-2 text-gray-500">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-purple-50 font-semibold">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-purple-700">PKR {shahzadTotal}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Azhar’s Table */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-4">
              <UserCircleIcon className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Azhar’s Expenses
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {azharExpenses.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{e.description}</td>
                    <td className="py-2 font-medium text-green-600">
                      PKR {e.amount}
                    </td>
                    <td className="py-2 text-gray-500">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-semibold">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-green-700">PKR {azharTotal}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </button>

        {/* Add Expense Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
              <input
                type="number"
                placeholder="Amount (PKR)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
