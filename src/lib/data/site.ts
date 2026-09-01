/** Open-source accounts, listed inline rather than as a card grid. */
export const organizations = [
  'JupyterLab',
  'conda-forge',
  'Perspective',
  'nbprint',
  'dau.',
  'airflow-laminar',
  'python-project-templates',
  'FINOS',
  'Point72',
  'JPMorganChase',
  '1kbgz'
] as const;

export const talks = [
  {
    year: '2025',
    title: 'Build a data studio in your notebook with jupyter-fs',
    event: 'PyData Paris',
    description: 'Composable file systems and data tools inside JupyterLab.',
    slides: '/talks/jupyterfs2025.html?print-pdf=true',
    recording: 'https://youtu.be/q0mMlVbXssk'
  },
  {
    year: '2025',
    title: 'Control all of your projects with Copier',
    event: 'PyData London',
    description: 'Keeping a fleet of projects aligned without giving up local control.',
    slides: '/talks/copier2025.html?print-pdf=true',
    recording: 'https://youtu.be/rF6yrKx8T9U'
  },
  {
    year: '2024',
    title: 'High Performance Data Visualization for the Web',
    event: 'PyCon Italia · PyCon DE · PyData Paris',
    description: 'Streaming, transforming, and rendering large datasets with Perspective.',
    slides: '/talks/perspective2024.html?print-pdf=true',
    recording: 'https://youtu.be/v5Y5ftlGNhU'
  },
  {
    year: '2024',
    title: 'Jupyter Notebooks for Print Media',
    event: 'PyCon DE / PyData Berlin',
    description: 'A notebook-first workflow for exacting, print-oriented output.',
    slides: '/talks/nbprint2024.html?print-pdf=true',
    recording: 'https://youtu.be/XEwZ-Dvs21s'
  },
  {
    year: '2024',
    title: 'Building FPGA-based Machine Learning Accelerators in Python',
    event: 'PyCon US',
    description: 'An open-source path from Python models to specialized hardware.',
    slides: '/talks/fpga2024.html?print-pdf=true',
    recording: 'https://youtu.be/pFRFZDLnr-s'
  },
  {
    year: '2024',
    title: 'Streaming Cross-sectional Visualization with Perspective',
    event: 'Databricks Data + AI',
    description: 'Live market data, cross-sectional analysis, and interactive visualization with Tim Bess.',
    recording: 'https://www.youtube.com/watch?v=lDpIu4dnp78',
    source: 'https://github.com/ProspectiveCo/databricks-conf-talk-june-2024'
  },
  {
    year: '2023',
    title: 'Visualizing Live Data Pipelines',
    event: 'JupyterCon',
    description: 'Making streaming Python systems inspectable and interactive.',
    slides: '/talks/jupytercon2023.html?print-pdf=true'
  },
  {
    year: '2020',
    title: 'Production Notebooks',
    event: 'JupyterCon',
    description: 'Tools and patterns for moving notebooks into dependable workflows.',
    slides: '/talks/jupytercon2020.html?print-pdf=true',
    recording: 'https://youtu.be/MTGlyvbNG_Q'
  },
  {
    year: '2020',
    title: 'Beyond Spreadsheets',
    event: 'NYC Data Council',
    description: 'Building better interfaces for analytical work with Jeff Sternberg.',
    recording: 'https://youtu.be/PYTVU4A_3Kc'
  }
] as const;

export const experience = [
  {
    company: 'Point72 · Cubist',
    role: 'Central Research Team',
    years: '2022—Now'
  },
  {
    company: 'IEX',
    role: 'Head of Software Engineering, Cloud',
    years: '2020—2021'
  },
  {
    company: 'J.P. Morgan',
    role: 'Vice President, Athena Research',
    years: '2016—2020'
  },
  {
    company: 'MayStreet',
    role: 'Software Engineer',
    years: '2015—2016'
  }
] as const;
