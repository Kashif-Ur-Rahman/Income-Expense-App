/*
express: Web framework for Node.js.
cors: Middleware to enable cross-origin requests.
*/

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Here we will Create the Express app...⬇
const app = express();
const PORT = 5000;

// Here we Define Transaction interface...⬇
interface Transaction {
  id: number;
  name: string;
  transactionType: string;
  amount: number;
}

// Middleware is here...⬇
app.use(cors());
app.use(express.json());

let transactions: Transaction[] = [];

// GET all transactions here...⬇
app.get("/api/transactions", (req: Request, res: Response): void => {
  res.status(200).json(transactions);  // response type is set to void..
});

// POST a new transaction here...⬇
app.post("/api/transactions", (req: Request, res: Response): void => {
  const { name, transactionType, amount } = req.body;

  if (!name || !transactionType || typeof amount !== "number") {
    res.status(400).json({ message: "Invalid transaction data" });    // 400: Bad req..
    return;
  }

  const newTransaction: Transaction = {
    id: transactions.length + 1,           // Simple ID generation...
    name,
    transactionType,
    amount,
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);      // 201 means req created..
});

// PUT - Update a transaction here(Update Whole Block)...⬇
app.put("/api/transactions/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);                      // parseInt: convert string to a number..
  const { name, transactionType, amount } = req.body;

  const transactionIndex = transactions.findIndex((t) => t.id === id); //find

  if (transactionIndex === -1) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  if (!name || !transactionType || typeof amount !== "number") {
    res.status(400).json({ message: "Invalid transaction data" });   // 400: Bad req..
    return;
  }

  const updatedTransaction: Transaction = {
    id,
    name,
    transactionType,
    amount,
  };

  transactions[transactionIndex] = updatedTransaction;
  res.status(200).json(updatedTransaction);
});

// DELETE a transaction...⬇
app.delete("/api/transactions/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const transactionIndex = transactions.findIndex((t) => t.id === id);

  if (transactionIndex === -1) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  transactions.splice(transactionIndex, 1); // Remove transaction from array..
  res.status(200).json({ message: "Transaction deleted" });
});

// Error-handling middleware (optional for debugging)...⬇
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server...⬇
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
