import React, { useState, useEffect } from 'react';
import TemplateForm from './components/TemplateForm';
import TemplateList from './components/TemplateList';

function App() {
    const [templates, setTemplates] = useState([]);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [currentTab, setCurrentTab] = useState('library');
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        const response = await fetch('http://localhost:5001/api/templates');
        const data = await response.json();
        setTemplates(data);
    };

    const createTemplate = async (template) => {
        const response = await fetch('http://localhost:5001/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(template),
        });
        if (response.ok) {
            fetchTemplates();
        } else {
            console.error('Failed to create template');
        }
    };

    const updateTemplate = async (template) => {
        const response = await fetch(`http://localhost:5001/api/templates/${template._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(template),
        });

        if (response.ok) {
            fetchTemplates();
            setEditingTemplate(null);
        } else {
            console.error('Failed to update template');
        }
    };

    const deleteTemplate = async (id) => {
        const response = await fetch(`http://localhost:5001/api/templates/${id}`, { method: 'DELETE' });

        if (response.ok) {
            fetchTemplates();
        } else {
            console.error('Failed to delete template');
        }
    };

    const openEditor = (template) => {
        setEditingTemplate(template || null);
        setIsEditorVisible(true);
    };

    const closeEditor = () => {
        setEditingTemplate(null);
        setIsEditorVisible(false);
    };

    return (
        <div className="app">
            <h1 className="header">Template Builder</h1>
            {!isEditorVisible ? (
                <div className="template-library">
                    <div className="tabs">
                        <button
                            className={`tab-button ${currentTab === 'library' ? 'active' : ''}`}
                            onClick={() => setCurrentTab('library')}
                        >
                            Template Library
                        </button>
                        <button
                            className={`tab-button ${currentTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setCurrentTab('saved')}
                        >
                            Saved Templates
                        </button>
                    </div>
                    <div className="create-button">
                        <button onClick={() => openEditor(null)}>Create Template</button>
                    </div>
                    <TemplateList
                        templates={templates.filter((template) =>
                            currentTab === 'library' ? template.type === 'library' : template.type === 'user-created'
                        )}
                        onDelete={deleteTemplate}
                        onEdit={openEditor}
                    />
                </div>
            ) : (
                <div className="editor-page">
                    <button className="back-button" onClick={closeEditor}>
                        Back to List
                    </button>
                    <TemplateForm
                        template={editingTemplate}
                        onSubmit={(template) => {
                            if (editingTemplate) {
                                updateTemplate({ ...template, _id: editingTemplate._id });
                            } else {
                                createTemplate(template);
                            }
                            closeEditor();
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
