import React from "react";
import { useTransactions } from "../context/TransactionContext";

const TransactionSummary: React.FC = () => {
    const { state } = useTransactions();
    const totals = state.transactions.reduce(
        (acc, t) => {
            acc[t.transactionType === "Income" ? "income" : "expenses"] += t.amount;
            return acc;
        }, { income: 0, expenses: 0 }
    );

    return (
        <div className="mb-4 flex justify-between items-center">
            <div className="text-white bg-blue-500 rounded-lg px-5 py-2.5">Income: ${totals.income}</div>
            <div className="text-white bg-red-500 rounded-lg px-5 py-2.5">Expenses: ${totals.expenses}</div>
            <div className="text-white bg-green-500 rounded-lg px-5 py-2.5">Total: ${totals.income - totals.expenses}</div>
        </div>
    );
};

export default TransactionSummary;

