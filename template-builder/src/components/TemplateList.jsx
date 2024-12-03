import React from 'react';

const TemplateList = ({ templates, onDelete, onEdit }) => {
    return (
        <div className="template-list">
            <h2>Templates</h2>
            <div className="template-cards">
                {templates.map((template) => (
                    <div key={template._id} className="template-card">
                        <h3>{template.title}</h3>
                        <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                        <p>Type: {template.type}</p>
                        <div className="template-actions">
                            <button onClick={() => onEdit(template)}>Edit</button>
                            <button onClick={() => onDelete(template._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateList;
