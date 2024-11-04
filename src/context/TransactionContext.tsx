import React, { useReducer, createContext, useContext, useEffect } from "react";

// Types...⬇
interface Transaction {
    id: string;
    name: string;
    transactionType: "Income" | "Expenses";
    amount: number;
}

interface State {
    transactions: Transaction[];
}

type Action =
    | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
    | { type: "ADD_TRANSACTION"; payload: Transaction }
    | { type: "DELETE_TRANSACTION"; payload: string }
    | { type: "UPDATE_TRANSACTION"; payload: Transaction };

const initialState: State = { transactions: [] };

// Reducer...⬇
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_TRANSACTIONS":
            return { ...state, transactions: action.payload };
        case "ADD_TRANSACTION":
            return { ...state, transactions: [...state.transactions, action.payload] };
        case "DELETE_TRANSACTION":
            return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
        case "UPDATE_TRANSACTION":
            return {
                ...state,
                transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
            };
        default:
            return state;
    }
};

// Update the Context to include state, dispatch, and CRUD functions...⬇
interface TransactionContextProps {
    state: State;
    dispatch: React.Dispatch<Action>;
    addTransaction: (transaction: Transaction) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (transaction: Transaction) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps | null>(null);
export const useTransactions = () => useContext(TransactionContext)!;

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Fetch transactions from the backend...⬇
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/transactions"); // Replace with actual URL
                const data = await response.json();
                dispatch({ type: "SET_TRANSACTIONS", payload: data });
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    // Add transaction to backend...⬇
    const addTransaction = async (transaction: Transaction) => {
        try {
            const response = await fetch("http://localhost:5000/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });
            const newTransaction = await response.json();
            dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    // Delete transaction from backend...⬇
    const deleteTransaction = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/transactions/${id}`, { method: "DELETE" });
            dispatch({ type: "DELETE_TRANSACTION", payload: id });
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    // Update transaction in backend...⬇
    const updateTransaction = async (transaction: Transaction) => {
        try {
            const response = await fetch(`http://localhost:5000/api/transactions/${transaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });
            const updatedTransaction = await response.json();
            dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTransaction });
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    return (
        <TransactionContext.Provider value={{ state, dispatch, addTransaction, deleteTransaction, updateTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};
