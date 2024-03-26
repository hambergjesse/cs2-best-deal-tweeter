# CS2 Best Deal Tweeter

## Description

This project automates the process of fetching the daily best deal for Counter-Strike 2 (CS2) items from CSFloat and tweeting it out using the Twitter API. It consists of two main modules: `floatFetch.js` for fetching the best deal from CSFloat and `apiFetch.js` for interacting with the Twitter API to post the best deal as a tweet. The main file `main.js` orchestrates these modules to fetch the deal and post it on Twitter.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository: `git clone https://github.com/hambergjesse/cs2-best-deal-tweeter.git`

2. Navigate to the project directory: `cd cs2-best-deal-tweeter`

3. Install dependencies: `npm install`

## Configuration

1. Create a .env file in the root directory of the project.

2. Add your Twitter API credentials and CSFloat API key in the .env file:

```
CONSUMER_KEY=your_twitter_consumer_key
CONSUMER_SECRET=your_twitter_consumer_secret
FLOAT_API_KEY=your_csfloat_api_key
```

## Usage

To run the project:

```
node main.js
```

The script will fetch the daily best deal from CSFloat and tweet it out using the specified Twitter account.

## Credits

CSFloat - For providing the API to fetch daily best deals for CS2 items.
Twitter API - For enabling the automation of tweeting the best deal.
License
This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Issues

If you encounter any issues or have suggestions for improvements, please open an issue on GitHub.

## Disclaimer

This project is for educational purposes only. Use it responsibly and at your own risk.
