export const organizations = [
  {
    name: 'Tim Paine',
    handle: 'timkpaine',
    description: 'Personal projects across data, Jupyter, finance, and developer tools.',
    href: 'https://github.com/timkpaine',
    avatar: 'https://avatars.githubusercontent.com/u/3105306?v=4'
  },
  {
    name: '1kbgz',
    handle: '1kbgz',
    description: 'A development studio based in New York City.',
    href: 'https://github.com/1kbgz',
    avatar: 'https://avatars.githubusercontent.com/u/147121325?v=4'
  },
  {
    name: 'FINOS',
    handle: 'finos',
    description: 'Open innovation and open-source collaboration across financial services.',
    href: 'https://github.com/finos',
    avatar: 'https://avatars.githubusercontent.com/u/35377814?v=4'
  },
  {
    name: 'Perspective',
    handle: 'perspective-dev',
    description: 'High-performance visualization and analytics for large, streaming datasets.',
    href: 'https://github.com/perspective-dev',
    avatar: 'https://avatars.githubusercontent.com/u/195977497?v=4'
  },
  {
    name: 'dau.',
    handle: 'dau-dev',
    description: 'A dataflow hardware accelerator platform.',
    href: 'https://github.com/dau-dev',
    avatar: 'https://avatars.githubusercontent.com/u/113467871?v=4'
  },
  {
    name: 'Point72',
    handle: 'Point72',
    description: 'Open-source software from a global asset management firm.',
    href: 'https://github.com/Point72',
    avatar: 'https://avatars.githubusercontent.com/u/112506536?v=4'
  },
  {
    name: 'JPMorganChase',
    handle: 'jpmorganchase',
    description: 'Open-source projects from JPMorganChase.',
    href: 'https://github.com/jpmorganchase',
    avatar: 'https://avatars.githubusercontent.com/u/22640571?v=4'
  },
  {
    name: 'Python Project Templates',
    handle: 'python-project-templates',
    description: 'Project templates for Python, C++, Rust, JavaScript, Jupyter, and more.',
    href: 'https://github.com/python-project-templates',
    avatar: 'https://avatars.githubusercontent.com/u/137446063?v=4'
  },
  {
    name: 'nbprint',
    handle: 'nbprint',
    description: 'A framework for building print-oriented media with Jupyter.',
    href: 'https://github.com/nbprint',
    avatar: 'https://avatars.githubusercontent.com/u/166062041?v=4'
  },
  {
    name: 'laminar',
    handle: 'airflow-laminar',
    description: 'Tools that make Apache Airflow smoother.',
    href: 'https://github.com/airflow-laminar',
    avatar: 'https://avatars.githubusercontent.com/u/177271696?v=4'
  },
  {
    name: 'JupyterLab',
    handle: 'jupyterlab',
    description: 'The next-generation user interface for Project Jupyter.',
    href: 'https://github.com/jupyterlab',
    avatar: 'https://avatars.githubusercontent.com/u/22800682?v=4'
  },
  {
    name: 'conda-forge',
    handle: 'conda-forge',
    description: 'Community-led packages and infrastructure for conda.',
    href: 'https://github.com/conda-forge',
    avatar: 'https://avatars.githubusercontent.com/u/11897326?v=4'
  }
] as const;

export const talks = [
  {
    year: '2025',
    title: 'Build a data studio in your notebook with jupyter-fs',
    event: 'PyData Paris',
    description: 'Composable file systems and data tools inside JupyterLab.',
    slides: '/talks/jupyterfs2025.html?print-pdf=true'
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
