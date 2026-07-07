import '../components/Dashboard.css';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import InfoSection from '../components/InfoSection';

export default function Dashboard() {
    const statCardsData = [
        {
            icon: '✓',
            title: 'Good Inventory Status',
            value: '1,540',
            subtitle: '+3.5% from last week',
            buttonText: 'View Details',
            buttonColor: 'green',
            borderColor: 'green'
        },
        {
            icon: '$',
            title: 'Revenue',
            value: '$7,843',
            subtitle: '+2.1% from last week',
            buttonText: 'View Details',
            buttonColor: 'yellow',
            borderColor: 'yellow'
        },
        {
            icon: '💊',
            title: 'Medicines Available',
            value: '842',
            subtitle: '+1.2% from last week',
            buttonText: 'View Details',
            buttonColor: 'blue',
            borderColor: 'blue'
        },
        {
            icon: '⚠',
            title: 'Medicine Shortage',
            value: '42',
            subtitle: '+0.5% from last week',
            buttonText: 'View Details',
            buttonColor: 'red',
            borderColor: 'red'
        }
    ];

    const inventoryData = [
        { value: '5,842', label: 'Stock In' },
        { value: '2,420', label: 'Stock Out' }
    ];

    const quickReportData = [
        { value: '1,842', label: 'Total Sales' },
        { value: '847', label: 'Total Return' }
    ];

    const myPharmacyData = [
        { value: '25', label: 'Branches' },
        { value: '842', label: 'Employees' }
    ];

    const customersData = [
        { value: '1,842', label: 'Total Customers' },
        { value: '742', label: 'New Customers' }
    ];

    return (
        <div className="dashboard">
            <PageHeader />
            
            <div className="stat-cards-grid">
                {statCardsData.map((card, index) => (
                    <StatCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        buttonText={card.buttonText}
                        buttonColor={card.buttonColor}
                        borderColor={card.borderColor}
                    />
                ))}
            </div>

            <div className="dashboard-grid">
                <InfoSection
                    title="Inventory"
                    items={inventoryData}
                    linkText="View Inventory"
                />
                <InfoSection
                    title="Quick Report"
                    items={quickReportData}
                    linkText="View Report"
                />
            </div>

            <div className="dashboard-grid">
                <InfoSection
                    title="My Pharmacy"
                    items={myPharmacyData}
                    linkText="View Pharmacy"
                />
                <InfoSection
                    title="Customers"
                    items={customersData}
                    linkText="View Customers"
                />
            </div>
        </div>
    );
}