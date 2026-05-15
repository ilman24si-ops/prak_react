import PageHeader from './PageHeader';
import StatCard from './StatCard';
import InfoSection from './InfoSection';
import './Dashboard.css';

export default function Dashboard() {
    const statCardsData = [
        {
            icon: '🛡️',
            title: 'Good',
            value: 'Inventory Status',
            buttonText: 'View Detailed Report',
            buttonColor: 'green',
            borderColor: 'green'
        },
        {
            icon: '💵',
            title: 'Rs. 8,55,875',
            value: 'Revenue',
            subtitle: 'Jan 2022',
            buttonText: 'View Detailed Report',
            buttonColor: 'yellow',
            borderColor: 'yellow'
        },
        {
            icon: '🏥',
            title: '298',
            value: 'Medicines Available',
            buttonText: 'Visit Inventory',
            buttonColor: 'blue',
            borderColor: 'blue'
        },
        {
            icon: '⚠️',
            title: '01',
            value: 'Medicine Shortage',
            buttonText: 'Resolve Now',
            buttonColor: 'red',
            borderColor: 'red'
        }
    ];

    const inventoryItems = [
        { value: '298', label: 'Total no of Medicines' },
        { value: '24', label: 'Medicine Groups' }
    ];

    const quickReportItems = [
        { value: '70,856', label: 'Qty of Medicines Sold' },
        { value: '5,288', label: 'Invoices Generated' }
    ];

    const myPharmacyItems = [
        { value: '04', label: 'Total no of Suppliers' },
        { value: '05', label: 'Total no of Users' }
    ];

    const customersItems = [
        { value: '845', label: 'Total no of Customers' },
        { value: 'Adalimumab', label: 'Frequently bought item' }
    ];

    return (
        <div className="dashboard">
            <PageHeader />
            
            <div className="stat-cards-grid">
                {statCardsData.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <InfoSection 
                        title="Inventory"
                        linkText="Go to Configuration"
                        items={inventoryItems}
                    />
                </div>
                <div className="dashboard-right">
                    <InfoSection 
                        title="Quick Report"
                        linkText="January 2022"
                        items={quickReportItems}
                    />
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <InfoSection 
                        title="My Pharmacy"
                        linkText="Go to User Management"
                        items={myPharmacyItems}
                    />
                </div>
                <div className="dashboard-right">
                    <InfoSection 
                        title="Customers"
                        linkText="Go to Customers Page"
                        items={customersItems}
                    />
                </div>
            </div>
        </div>
    );
}