import React, { useState, useEffect } from 'react';

const BudgetComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update the current date every minute
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60000 milliseconds = 1 minute

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const today = currentDate.getDate();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  return (
    <div>
      <h2>Budget Overview</h2>
      <p>Today: {today}</p>
      <p>Yesterday: {yesterday.getDate()}</p>
      <p>Tomorrow: {tomorrow.getDate()}</p>
      <p>Month and Year: {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
      {/* Add your budget-related components and logic here */}
    </div>
  );
};

export default BudgetComponent;
