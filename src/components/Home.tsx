import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TransactionProvider, useTransactions } from "../context/TransactionContext";
import Button from "../components/Button";
import TransactionList from "../components/ TransactionList";
import TransactionSummary from "../components/TransactionSummary";
import { v4 as uuidv4 } from "uuid";
import '../index.css';

interface FormValues {
    name: string;
    transactionType: "Income" | "Expenses";
    amount: number;
}

interface Transaction extends FormValues {
    id: string;
}

const Home: React.FC = () => {
    const { dispatch } = useTransactions();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>();
    const [transactionBeingEdited, setTransactionBeingEdited] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch existing transactions when component mounts (GET request)...⬇
    useEffect(() => {
        setIsLoading(true);  // Loading is start...
        fetch("http://localhost:5000/api/transactions")
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch transactions');
                return response.json();
            })
            .then(data => {
                dispatch({ type: "SET_TRANSACTIONS", payload: data });
                setIsLoading(false); // Stop loading..
            })
            .catch(err => {
                console.error("Error fetching transactions:", err);
                setError("Failed to load transactions"); // Set error message..
                setIsLoading(false);
            });
    }, [dispatch]);

    if (isLoading) return <div>Loading...</div>;     // Show a loading indicator if loading..

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const transactionData: Transaction = {
            id: transactionBeingEdited ? transactionBeingEdited.id : uuidv4(),
            name: data.name,
            transactionType: data.transactionType,
            amount: Number(data.amount),
        };

        if (transactionBeingEdited) {
            // Update transaction (PUT request)...⬇
            fetch(`http://localhost:5000/api/transactions/${transactionBeingEdited.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            })
                .then(response => response.json())
                .then(updatedTransaction => {
                    dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTransaction });
                    setTransactionBeingEdited(null); // Reset after editing..
                })
                .catch(error => console.error("Error updating transaction:", error));
        } else {
            // Add new transaction (POST request)...⬇
            fetch("http://localhost:5000/api/transactions", {  // Updated endpoint..
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Make sure to return the result..
                })
                .then(newTransaction => {
                    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
                })
                .catch(error => console.error("Error adding transaction:", error));
        }
        reset();
    };

    const handleEdit = (transaction: Transaction) => {
        setTransactionBeingEdited(transaction);
        setValue("name", transaction.name);
        setValue("transactionType", transaction.transactionType);
        setValue("amount", transaction.amount);
    };

    return (
        <div className="bg-gray-700 w-full min-h-screen flex flex-col items-center p-4">
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-6xl text-white font-bold mb-8 mt-20">Expense Tracker</h1>
            <p className="text-white text-xl">With React Hook Form, useReducer, and Context API</p>
            <div className="flex flex-col lg:flex-row w-full max-w-7xl h-[496px] mt-14">
                <div className="bg-white p-6 rounded shadow-md w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4">
                    {/* React Hook Form...⬇ */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                            <input
                                {...register("name", { required: true })}
                                id="name"
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                            {errors.name && <p className="text-red-500">Name is required</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="transactionType">Transaction Type</label>
                            <select
                                {...register("transactionType")}
                                id="transactionType"
                                className="w-full border border-gray-300 p-2 rounded"
                            >
                                <option value="Income">Income</option>
                                <option value="Expenses">Expenses</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="amount">Amount</label>
                            <input
                                {...register("amount", { required: true })}
                                type="number"
                                id="amount"
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                            {errors.amount && <p className="text-red-500">Amount is required</p>}
                        </div>
                        <Button
                            type="submit"
                            text={transactionBeingEdited ? "Update" : "Submit"}
                            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br"
                        />
                    </form>
                </div>

                <div className="bg-white p-6 rounded shadow-md w-full lg:w-1/2">
                    <TransactionSummary />
                    <TransactionList onEdit={handleEdit} /> {/* Pass the handleEdit function */}
                </div>
            </div>
        </div>
    );
};

export default () => (
    <TransactionProvider>
        <Home />
    </TransactionProvider>
);
