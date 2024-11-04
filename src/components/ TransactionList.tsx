import React,  { useState } from "react";
import Button from "./Button";
import { useTransactions } from "../context/TransactionContext";
import { FaArrowDown } from "react-icons/fa";

const TransactionList: React.FC<{ onEdit: (transaction: any) => void }> = ({ onEdit }) => {
    const { state, dispatch } = useTransactions();
    const [error, setError] = useState<string | null>(null); // State to handle error messages..

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error('Transaction deletion failed');
            }   

            dispatch({ type: "DELETE_TRANSACTION", payload: id });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            setError("Failed to delete transaction"); // Set error message in the catch block..
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4 text-center">
                History <FaArrowDown className="inline-block" />
            </h2>
            {error && <p className="text-red-500">{error}</p>} {/* Display error if it exists..*/}
            {state.transactions.map((t) => (
                <div key={t.id} className={`flex justify-between p-4 rounded ${t.transactionType === "Income" ? "bg-blue-400" : "bg-red-400"}`}>
                    {t.name} - ${t.amount}
                    <Button
                        className="bg-red-500 text-white py-2 px-4 ml-2 rounded"
                        text="Delete"
                        onClick={() => handleDelete(t.id)}  // Ensure the correct ID is passed here..
                    />
                    <Button
                        className="bg-yellow-500 text-white py-2 px-4 rounded"
                        text="Update"
                        onClick={() => onEdit(t)} // Ensure the transaction object with the correct ID is passed..
                    />

                </div>
            ))}
        </div>
    );
};

export default TransactionList;
