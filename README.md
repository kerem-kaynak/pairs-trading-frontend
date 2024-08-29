# Web Application to Visualize the Performance of Machine Learning Aided Pairs Trading Strategies

![Archutecture Diagram](https://i.ibb.co/F4GWF1g/Pairs-Trading-Architecture.png)

This repository is part of a project that aims to showcase the performance of a machine learning assisted pairs trading strategy developed for a thesis. The project consists of 4 separate services in different repositories.

- [Orchestrator](https://github.com/kerem-kaynak/pairs-trading-orchestrator): Orchestrator of data pipelines and processing workflows. Runs scheduled ETL jobs.
- [Quant / ML Service](https://github.com/kerem-kaynak/pairs-trading-quant-service): Web server exposing endpoints to perform machine learning tasks.
- [Backend API](https://github.com/kerem-kaynak/pairs-trading-backend): Backend API serving data to the client.
- [Frontend](https://github.com/kerem-kaynak/pairs-trading-frontend): Frontend application for web access.

The research in the thesis leading to this project can be found [here](https://github.com/kerem-kaynak/pairs-trading-with-ml) with deeper explanations of the financial and statistical concepts.

## Pairs Trading Frontend

This service is the access point for external users to the data of the project. Users can interface with the transformed data and visualize the performance of the trading strategy. Users can also see up-to-date suggestions for pairs and inspect tickers to discover trading opportunities.

# Technologies

The service is built using React (specifically create-react-app). Uses TailwindCSS for styling, Recharts for visualizations.

# Project Structure

Project is made up of components wrapped by the Layout component, with the only exception being the Login Page. All components can be found under `src/components/` directory and the Login Page under `src/pages/` directory. The entry point for the project is `src/App.js`.

# Requirements

- React 18+
- Node.js 16.2+
- Firebase CLI (optional, required for deployments)

# Local Development

Install dependencies:
```
npm install
```

Run the development server:
```
npm run start
```
