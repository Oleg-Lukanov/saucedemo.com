# WDIO Test Automation

This project is a test automation suite using WebdriverIO.
It includes tests for sorting and displaying products on a web application, Docker
and integrates with GitHub Actions for continuous integration. Docker and Allure report

# WebDriverIO Testing Project

A project for end-to-end testing using WebDriverIO, Allure Reporting, and Docker.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Docker](#docker)
- [GitHub Actions](#github-actions)
- [Configuration](#configuration)
- [License](#license)

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- Docker Desktop
- Allure CLI (for generating reports locally)

### Steps

1. **Clone the repository**:
  ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

Install dependencies:

  ```bash
    npm install
```

Run tests (examples):

  ```bash
    npm run test:chrome
    npm run test:firefox
    npm run test:edge
    Usage
    Running Specific Tests
```

Run all tests:
  ```bash
    npm run test
```

Run tests in Chrome:
  ```bash
    npm run test:chrome

Run tests in Firefox:
  ```bash
    npm run test:firefox
```
Run a single test file:
  ```bash
    npm run test:file -- --spec path/to/test.e2e.js
```
Generating and open Allure Reports
  ```bash
    npm run report
```
**Docker**

Build Docker Image
```bash
docker build -t wdio-test-image .
```
Run Docker Container
```bash
docker run -it wdio-test-image
```
**GitHub Actions**
This project uses GitHub Actions for CI/CD. The pipeline will run tests and deploy Allure reports to GitHub Pages.

Configuration
Configuration files are located in the root directory:

wdio.conf.js: Base configuration
wdio.conf.chrome.js: Chrome configuration
wdio.conf.firefox.js: Firefox configuration
wdio.conf.edge.js: Edge configuration

### Final Notes

Make sure to replace placeholders like `your-username` and `your-repository` with actual values
