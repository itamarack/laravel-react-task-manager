import React from 'react';
import { createRoot } from 'react-dom/client';
import Application from './Application';

const container = document.getElementById('entrypoint');
const root = createRoot(container);
root.render(<Application />);
