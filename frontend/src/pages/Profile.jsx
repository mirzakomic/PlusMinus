import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../providers/UserContext'; // Import the context
import Button from '../components/Button';

const Profile = () => {
  const { income, updateIncome } = useContext(UserContext); // Access income and updateIncome from context
  const [monthlyIncome, setMonthlyIncome] = useState(income || 0);

  useEffect(() => {
    if (income !== null) {
      setMonthlyIncome(income);
    }
  }, [income]);

  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    await updateIncome(monthlyIncome); // Call the updateIncome function from context
  };

  return (
    <section>
      <div className="mt-10 space-y-3">
      <h1>Profile</h1>
      <h3>Update Monthly Income</h3>
      <form className='dashboard bg-paperGrey flex rounded-xl' onSubmit={handleIncomeUpdate}>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder={monthlyIncome}
        />
        <Button variant="primary" shape="xl" type="submit">Update Income</Button>
        <br></br>
      </form>
      </div>
    </section>
  );
};

export default Profile;