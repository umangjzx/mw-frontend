import Link from "next/link";

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Link href="/schedule">Schedule</Link>
        </div>
    );
};

export default Dashboard;
