import React from 'react';
import { Progress } from "antd";
import "../styles/AnalyticsStyles.css";

const Analytics = ({ allTransactions }) => {
  // Category list
  const categoryList = [
    'Education', 'Food', 'Freelancing', 'Investments', 'Medical',
    'Movie', 'Project', 'Rent', 'Salary', 'Shopping', 'Travel', 'Other'
  ];

  // Total transactions
  const totalTransaction = allTransactions.length;
  const totalIncomeTransactions = allTransactions.filter(transaction => transaction.type === 'Income');
  const totalExpenseTransactions = allTransactions.filter(transaction => transaction.type === 'Expense');
  const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

  // Total turnover
  const totalTurnover = allTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalIncomeTurnover = allTransactions
    .filter(transaction => transaction.type === 'Income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnover = allTransactions
    .filter(transaction => transaction.type === 'Expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent = totalTurnover !== 0
    ? (totalIncomeTurnover / totalTurnover) * 100
    : 0;

  const totalExpenseTurnoverPercent = totalTurnover !== 0
    ? (totalExpenseTurnover / totalTurnover) * 100
    : 0;

  return (
    <>
      <div className="analytics-container">
        <div className="row">
          {/* Total Transactions */}
          <div className="col-lg-3 col-md-6">
            <div className="analytics-card">
              <div className="analytics-header">
                Total Transactions: {totalTransaction}
              </div>
              <div className="analytics-body">
                <h5 className="income-text">
                  Income: {totalIncomeTransactions.length}
                </h5>
                <h5 className="expense-text">
                  Expense: {totalExpenseTransactions.length}
                </h5>
                <div className="progress-circle-container">
                  <Progress
                    type="circle"
                    strokeColor="green"
                    className="progress-circle"
                    percent={totalIncomePercent.toFixed(0)}
                  />
                  <Progress
                    type="circle"
                    strokeColor="red"
                    className="progress-circle mt-3"
                    percent={totalExpensePercent.toFixed(0)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total Turnover */}
          <div className="col-lg-3 col-md-6">
            <div className="analytics-card">
              <div className="analytics-header">
                Total Money-Flow: {totalTurnover}
              </div>
              <div className="analytics-body">
                <h5 className="income-text">Income: {totalIncomeTurnover}</h5>
                <h5 className="expense-text">
                  Expense: {totalExpenseTurnover}
                </h5>
                <div className="progress-circle-container">
                  <Progress
                    type="circle"
                    strokeColor="green"
                    className="progress-circle"
                    percent={totalIncomeTurnoverPercent.toFixed(0)}
                  />
                  <Progress
                    type="circle"
                    strokeColor="red"
                    className="progress-circle mt-3"
                    percent={totalExpenseTurnoverPercent.toFixed(0)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category-wise Income */}
          <div className="col-lg-3 col-md-6">
            <h6 className="analytics-title income-bg">Category-wise Income</h6>
            {categoryList.map((category) => {
              const amount = allTransactions
                .filter(
                  (transaction) =>
                    transaction.type === "Income" &&
                    transaction.category === category
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0);

              const percentage =
                totalIncomeTurnover > 0
                  ? ((amount / totalIncomeTurnover) * 100).toFixed(0)
                  : 0;

              return (
                amount > 0 && (
                  <div className="analytics-progress-container" key={category}>
                    <div className="analytics-card">
                      <div className="analytics-body">
                        <h6>{category}</h6>
                        <Progress percent={percentage} />
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>

          {/* Category-wise Expense */}
          <div className="col-lg-3 col-md-6">
            <h6 className="analytics-title expense-bg">
              Category-wise Expense
            </h6>
            {categoryList.map((category) => {
              const amount = allTransactions
                .filter(
                  (transaction) =>
                    transaction.type === "Expense" &&
                    transaction.category === category
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0);

              const percentage =
                totalExpenseTurnover > 0
                  ? ((amount / totalExpenseTurnover) * 100).toFixed(0)
                  : 0;

              return (
                amount > 0 && (
                  <div className="analytics-progress-container" key={category}>
                    <div className="analytics-card">
                      <div className="analytics-body">
                        <h6>{category}</h6>
                        <Progress percent={percentage} />
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>

      <div className="row mt-3 analytics"></div>
    </>
  );
};

export default Analytics;
