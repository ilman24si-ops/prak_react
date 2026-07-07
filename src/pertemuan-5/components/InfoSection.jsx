import './InfoSection.css';

export default function InfoSection({ title, items, linkText }) {
    return (
        <div className="info-section">
            <div className="info-section-header">
                <h3 className="info-section-title">{title}</h3>
                <a href="#" className="info-section-link">{linkText} »</a>
            </div>
            
            <div className="info-section-content">
                {items.map((item, index) => (
                    <div key={index} className="info-item">
                        <div className="info-item-value">{item.value}</div>
                        <div className="info-item-label">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}