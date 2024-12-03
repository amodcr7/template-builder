import React, { useState, useEffect } from 'react';

const TemplateForm = ({ template, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('user-created');

    useEffect(() => {
        if (template) {
            setTitle(template.title);
            setContent(template.content);
            setType(template.type);
        } else {
            setTitle('');
            setContent('');
            setType('user-created');
        }
    }, [template]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content, type });
    };

    return (
        <div className="template-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Template Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                />
                <textarea
                    placeholder="Template Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea-field"
                />
                <div className="type-select">
                    <label>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="type-dropdown">
                        <option value="user-created">User-created</option>
                        <option value="library">Library</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">
                    {template ? 'Update Template' : 'Save Template'}
                </button>
            </form>
        </div>
    );
};

export default TemplateForm;
