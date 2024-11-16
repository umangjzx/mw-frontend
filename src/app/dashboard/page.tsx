import Link from "next/link";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link href="/schedule">Schedule</Link>
    </div>
  );
};

export default Dashboard;
