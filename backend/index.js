const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://amod007:9R4oqdmtQJ507odV@cluster0.hnesf.mongodb.net/template-builder')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB:', err));


const templateSchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ['library', 'user-created'], 
        default: 'user-created', 
    },
});

const Template = mongoose.model('Template', templateSchema);


app.get('/api/templates', async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates); 
    } catch (err) {
        res.status(500).send('Error fetching templates');
    }
});


app.post('/api/templates', async (req, res) => {
    const { title, content, type = 'user-created' } = req.body;
    try {
        const template = new Template({ title, content, type });
        await template.save();
        res.status(201).json(template);
    } catch (err) {
        res.status(500).send('Error creating template');
    }
});


app.put('/api/templates/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid template ID');
    }

    const { title, content, type } = req.body;
    try {
        const template = await Template.findByIdAndUpdate(
            id,
            { title, content, type },
            { new: true }
        );
        if (!template) {
            return res.status(404).send('Template not found');
        }
        res.json(template);
    } catch (err) {
        res.status(500).send('Error updating template');
    }
});


app.delete('/api/templates/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid template ID');
    }

    try {
        const deletedTemplate = await Template.findByIdAndDelete(id);
        if (!deletedTemplate) {
            return res.status(404).send('Template not found');
        }
        res.json({ message: 'Template deleted successfully' });
    } catch (err) {
        res.status(500).send('Error deleting template');
    }
});


const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
